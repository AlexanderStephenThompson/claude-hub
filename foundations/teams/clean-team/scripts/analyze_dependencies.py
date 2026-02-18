#!/usr/bin/env python3
"""
Dependency Analyzer

Analyzes import/dependency structure in a codebase to identify:
- Circular dependencies
- Highly coupled modules
- Dependency direction violations
- Module boundary issues

Usage:
    python analyze_dependencies.py <path> [--format json|text] [--show-graph]

Examples:
    python analyze_dependencies.py src/
    python analyze_dependencies.py src/ --format json
"""

import argparse
import json
import os
import re
import sys
from collections import defaultdict
from dataclasses import dataclass, asdict, field
from pathlib import Path
from typing import List, Dict, Tuple, Optional


@dataclass
class ModuleInfo:
    """Information about a module/file."""
    path: str
    imports: List[str] = field(default_factory=list)
    exports: List[str] = field(default_factory=list)
    import_count: int = 0
    imported_by_count: int = 0


@dataclass
class CircularDependency:
    """A circular dependency chain."""
    cycle: List[str]
    
    @property
    def description(self) -> str:
        return ' → '.join(self.cycle + [self.cycle[0]])


HIGH_COUPLING_THRESHOLD = 5
TOTAL_COUPLING_THRESHOLD = 10
MAX_MERMAID_NODES = 30
TOP_MODULES_DISPLAY_LIMIT = 10
MAX_COUPLING_DISPLAY = 10
MAX_VIOLATIONS_DISPLAY = 15


@dataclass
class CouplingIssue:
    """A module with high coupling."""
    module: str
    incoming: int  # modules that import this
    outgoing: int  # modules this imports
    total: int

    @property
    def is_hub(self) -> bool:
        """High incoming AND outgoing - potential god module."""
        return self.incoming > HIGH_COUPLING_THRESHOLD and self.outgoing > HIGH_COUPLING_THRESHOLD


@dataclass 
class DependencyReport:
    """Full dependency analysis report."""
    modules: Dict[str, ModuleInfo]
    circular_dependencies: List[CircularDependency]
    coupling_issues: List[CouplingIssue]
    layer_violations: List[Tuple[str, str, str]]  # (from, to, violation_type)
    

def normalize_path(path: str, base_dir: str) -> str:
    """Normalize a path relative to base directory."""
    try:
        return os.path.relpath(path, base_dir)
    except ValueError:
        return path


def resolve_import(import_path: str, current_file: str, base_dir: str) -> Optional[str]:
    """Resolve an import path to an actual file path."""
    # Handle relative imports
    if import_path.startswith('.'):
        current_dir = os.path.dirname(current_file)
        
        if import_path.startswith('./'):
            resolved = os.path.join(current_dir, import_path[2:])
        elif import_path.startswith('../'):
            parts = import_path.split('/')
            up_count = sum(1 for p in parts if p == '..')
            remaining = '/'.join(p for p in parts if p != '..')
            
            target_dir = current_dir
            for _ in range(up_count):
                target_dir = os.path.dirname(target_dir)
            resolved = os.path.join(target_dir, remaining)
        else:
            resolved = os.path.join(current_dir, import_path[1:])
    
    # Handle absolute imports (from project root)
    elif import_path.startswith('@/') or import_path.startswith('~/'):
        resolved = os.path.join(base_dir, import_path[2:])
    
    # Handle node_modules or external packages
    elif not import_path.startswith('/'):
        # Check if it's a local file
        potential_local = os.path.join(base_dir, import_path)
        if os.path.exists(potential_local) or os.path.exists(potential_local + '.ts'):
            resolved = potential_local
        else:
            return None  # External package
    else:
        resolved = import_path
    
    # Try common extensions
    for ext in ['', '.ts', '.tsx', '.js', '.jsx', '.py', '/index.ts', '/index.js']:
        full_path = resolved + ext
        if os.path.isfile(full_path):
            return normalize_path(full_path, base_dir)
    
    return None


def extract_imports_js_ts(content: str, filepath: str, base_dir: str) -> List[str]:
    """Extract import paths from JavaScript/TypeScript files."""
    imports = []
    
    patterns = [
        r'import\s+.*?\s+from\s+[\'"]([^\'"]+)[\'"]',
        r'import\s*\([\'"]([^\'"]+)[\'"]\)',  # Dynamic imports
        r'require\s*\([\'"]([^\'"]+)[\'"]\)',
    ]
    
    for pattern in patterns:
        for match in re.finditer(pattern, content):
            import_path = match.group(1)
            resolved = resolve_import(import_path, filepath, base_dir)
            if resolved:
                imports.append(resolved)
    
    return imports


def extract_imports_python(content: str, filepath: str, base_dir: str) -> List[str]:
    """Extract import paths from Python files."""
    imports = []
    
    # from x import y
    for match in re.finditer(r'from\s+([\w.]+)\s+import', content):
        module_path = match.group(1)
        # Convert module path to file path
        file_path = module_path.replace('.', '/')
        resolved = resolve_import(file_path, filepath, base_dir)
        if resolved:
            imports.append(resolved)
    
    # import x
    for match in re.finditer(r'^import\s+([\w.]+)', content, re.MULTILINE):
        module_path = match.group(1)
        file_path = module_path.replace('.', '/')
        resolved = resolve_import(file_path, filepath, base_dir)
        if resolved:
            imports.append(resolved)
    
    return imports


def analyze_file(filepath: str, base_dir: str) -> Optional[ModuleInfo]:
    """Analyze a single file for its dependencies."""
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
    except Exception:
        return None
    
    rel_path = normalize_path(filepath, base_dir)
    ext = Path(filepath).suffix.lower()
    
    if ext in ['.js', '.ts', '.jsx', '.tsx', '.mjs']:
        imports = extract_imports_js_ts(content, filepath, base_dir)
    elif ext == '.py':
        imports = extract_imports_python(content, filepath, base_dir)
    else:
        imports = []
    
    # Extract exports (simplified)
    exports = []
    export_patterns = [
        r'export\s+(?:default\s+)?(?:function|class|const|let|var)\s+(\w+)',
        r'export\s*{\s*([^}]+)\s*}',
        r'module\.exports\s*=',
    ]
    for pattern in export_patterns:
        for match in re.finditer(pattern, content):
            exports.append(match.group(1) if match.lastindex else 'default')
    
    return ModuleInfo(
        path=rel_path,
        imports=list(set(imports)),  # Dedupe
        exports=exports,
        import_count=len(set(imports)),
    )


def find_circular_dependencies(modules: Dict[str, ModuleInfo]) -> List[CircularDependency]:
    """Find all circular dependency chains using DFS."""
    cycles = []
    visited = set()
    rec_stack = set()
    
    def dfs(node: str, path: List[str]):
        if node in rec_stack:
            # Found cycle - extract it
            cycle_start = path.index(node)
            cycle = path[cycle_start:]
            cycles.append(CircularDependency(cycle=cycle))
            return
        
        if node in visited:
            return
        
        visited.add(node)
        rec_stack.add(node)
        path.append(node)
        
        if node in modules:
            for imported in modules[node].imports:
                if imported in modules:  # Only internal dependencies
                    dfs(imported, path.copy())
        
        rec_stack.remove(node)
    
    for module in modules:
        if module not in visited:
            dfs(module, [])
    
    # Deduplicate cycles (same cycle can be found from different starting points)
    unique_cycles = []
    seen_cycles = set()
    for cycle in cycles:
        normalized = tuple(sorted(cycle.cycle))
        if normalized not in seen_cycles:
            seen_cycles.add(normalized)
            unique_cycles.append(cycle)
    
    return unique_cycles


def analyze_coupling(modules: Dict[str, ModuleInfo]) -> List[CouplingIssue]:
    """Analyze coupling metrics for each module."""
    # Count how many times each module is imported
    imported_by = defaultdict(int)
    for module in modules.values():
        for imp in module.imports:
            if imp in modules:
                imported_by[imp] += 1
    
    issues = []
    for path, info in modules.items():
        outgoing = info.import_count
        incoming = imported_by[path]
        total = incoming + outgoing
        
        # Flag if total coupling is high
        if total > TOTAL_COUPLING_THRESHOLD or (incoming > HIGH_COUPLING_THRESHOLD and outgoing > HIGH_COUPLING_THRESHOLD):
            issues.append(CouplingIssue(
                module=path,
                incoming=incoming,
                outgoing=outgoing,
                total=total,
            ))
    
    return sorted(issues, key=lambda x: x.total, reverse=True)


def detect_layer_violations(modules: Dict[str, ModuleInfo]) -> List[Tuple[str, str, str]]:
    """Detect common architectural layer violations."""
    violations = []
    
    # Define layer patterns (customize based on project structure)
    layer_patterns = {
        'presentation': [r'/components/', r'/pages/', r'/views/', r'/ui/'],
        'application': [r'/services/', r'/usecases/', r'/application/'],
        'domain': [r'/domain/', r'/models/', r'/entities/'],
        'infrastructure': [r'/infrastructure/', r'/repositories/', r'/adapters/', r'/db/'],
    }
    
    def get_layer(path: str) -> Optional[str]:
        for layer, patterns in layer_patterns.items():
            for pattern in patterns:
                if re.search(pattern, path):
                    return layer
        return None
    
    # Define allowed dependencies (higher layers can depend on lower)
    allowed = {
        'presentation': ['application', 'domain'],
        'application': ['domain'],
        'domain': [],  # Domain should have no internal dependencies
        'infrastructure': ['domain'],  # Implements domain interfaces
    }
    
    for path, info in modules.items():
        source_layer = get_layer(path)
        if not source_layer:
            continue
        
        for imported in info.imports:
            target_layer = get_layer(imported)
            if not target_layer:
                continue
            
            if target_layer not in allowed.get(source_layer, []) and target_layer != source_layer:
                violation_type = f"{source_layer} → {target_layer}"
                violations.append((path, imported, violation_type))
    
    return violations


def analyze_directory(dirpath: str) -> DependencyReport:
    """Analyze all files in a directory."""
    extensions = ['.js', '.ts', '.jsx', '.tsx', '.py', '.mjs']
    modules = {}
    base_dir = os.path.abspath(dirpath)
    
    for root, dirs, files in os.walk(dirpath):
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', '__pycache__', 'dist', 'build', '.venv']]
        
        for filename in files:
            if any(filename.endswith(ext) for ext in extensions):
                filepath = os.path.join(root, filename)
                info = analyze_file(filepath, base_dir)
                if info:
                    modules[info.path] = info
    
    # Update imported_by counts
    imported_by_count = defaultdict(int)
    for info in modules.values():
        for imp in info.imports:
            imported_by_count[imp] += 1
    
    for path, info in modules.items():
        info.imported_by_count = imported_by_count[path]
    
    return DependencyReport(
        modules=modules,
        circular_dependencies=find_circular_dependencies(modules),
        coupling_issues=analyze_coupling(modules),
        layer_violations=detect_layer_violations(modules),
    )


def format_text_report(report: DependencyReport) -> str:
    """Format the report as human-readable text."""
    output = []
    output.append("=" * 60)
    output.append("DEPENDENCY ANALYSIS REPORT")
    output.append("=" * 60)
    output.append("")
    
    # Summary
    output.append("SUMMARY")
    output.append("-" * 40)
    output.append(f"Modules analyzed: {len(report.modules)}")
    output.append(f"Circular dependencies: {len(report.circular_dependencies)}")
    output.append(f"High coupling modules: {len(report.coupling_issues)}")
    output.append(f"Layer violations: {len(report.layer_violations)}")
    output.append("")
    
    # Circular dependencies
    if report.circular_dependencies:
        output.append("🔄 CIRCULAR DEPENDENCIES")
        output.append("-" * 40)
        for i, cycle in enumerate(report.circular_dependencies, 1):
            output.append(f"{i}. {cycle.description}")
        output.append("")
    
    # Coupling issues
    if report.coupling_issues:
        output.append("🔗 HIGH COUPLING MODULES")
        output.append("-" * 40)
        for issue in report.coupling_issues[:MAX_COUPLING_DISPLAY]:
            hub_marker = " [HUB]" if issue.is_hub else ""
            output.append(f"{issue.module}{hub_marker}")
            output.append(f"  Incoming: {issue.incoming} | Outgoing: {issue.outgoing} | Total: {issue.total}")
        output.append("")
    
    # Layer violations
    if report.layer_violations:
        output.append("⚠️ LAYER VIOLATIONS")
        output.append("-" * 40)
        for source, target, violation_type in report.layer_violations[:MAX_VIOLATIONS_DISPLAY]:
            output.append(f"{violation_type}")
            output.append(f"  {source}")
            output.append(f"  → {target}")
            output.append("")
    
    # Most imported modules
    output.append("📊 MOST IMPORTED MODULES")
    output.append("-" * 40)
    sorted_modules = sorted(
        report.modules.values(),
        key=lambda x: x.imported_by_count,
        reverse=True
    )
    for info in sorted_modules[:TOP_MODULES_DISPLAY_LIMIT]:
        if info.imported_by_count > 0:
            output.append(f"{info.imported_by_count:3d} imports ← {info.path}")
    output.append("")
    
    output.append("=" * 60)
    
    return '\n'.join(output)


def generate_mermaid_graph(report: DependencyReport, max_nodes: int = MAX_MERMAID_NODES) -> str:
    """Generate a Mermaid diagram of dependencies."""
    lines = ["graph LR"]
    
    # Get most connected modules
    sorted_modules = sorted(
        report.modules.values(),
        key=lambda x: x.import_count + x.imported_by_count,
        reverse=True
    )[:max_nodes]
    
    included = {m.path for m in sorted_modules}
    
    for info in sorted_modules:
        safe_name = info.path.replace('/', '_').replace('.', '_').replace('-', '_')
        for imp in info.imports:
            if imp in included:
                safe_imp = imp.replace('/', '_').replace('.', '_').replace('-', '_')
                lines.append(f"    {safe_name} --> {safe_imp}")
    
    return '\n'.join(lines)


def main():
    parser = argparse.ArgumentParser(description='Analyze code dependencies')
    parser.add_argument('path', help='Directory to analyze')
    parser.add_argument('--format', choices=['text', 'json', 'mermaid'], default='text', help='Output format')
    parser.add_argument('--show-graph', action='store_true', help='Include Mermaid dependency graph')
    
    args = parser.parse_args()
    path = Path(args.path)
    
    if not path.is_dir():
        print(f"Error: {path} is not a directory", file=sys.stderr)
        sys.exit(1)
    
    report = analyze_directory(str(path))
    
    if args.format == 'json':
        output = {
            'modules': {k: asdict(v) for k, v in report.modules.items()},
            'circular_dependencies': [asdict(cycle) for cycle in report.circular_dependencies],
            'coupling_issues': [asdict(coupling) for coupling in report.coupling_issues],
            'layer_violations': report.layer_violations,
        }
        print(json.dumps(output, indent=2))
    elif args.format == 'mermaid':
        print(generate_mermaid_graph(report))
    else:
        print(format_text_report(report))
        if args.show_graph:
            print("\n" + "=" * 60)
            print("DEPENDENCY GRAPH (Mermaid)")
            print("=" * 60)
            print(generate_mermaid_graph(report))


if __name__ == '__main__':
    main()
