#!/usr/bin/env python3
"""
Code Complexity Analyzer

Analyzes code files and directories for complexity metrics to inform refactoring decisions.
Helps identify hotspots that need attention during MEDIUM and DEEP refactoring.

Usage:
    python analyze_complexity.py <path> [--format json|text] [--threshold <n>]

Examples:
    python analyze_complexity.py src/
    python analyze_complexity.py src/users/user-service.ts --format json
    python analyze_complexity.py . --threshold 15
"""

import argparse
import json
import os
import re
import sys
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import List, Optional, Dict


MAX_FUNCTION_LINES = 40
MAX_CYCLOMATIC_COMPLEXITY = 10
MAX_NESTING_DEPTH = 3
MAX_PARAMETER_COUNT = 5
LINES_PER_COMPLEXITY_POINT = 100


@dataclass
class FunctionMetrics:
    """Metrics for a single function."""
    name: str
    start_line: int
    end_line: int
    line_count: int
    cyclomatic_complexity: int
    nesting_depth: int
    parameter_count: int

    @property
    def needs_attention(self) -> bool:
        return (
            self.line_count > MAX_FUNCTION_LINES or
            self.cyclomatic_complexity > MAX_CYCLOMATIC_COMPLEXITY or
            self.nesting_depth > MAX_NESTING_DEPTH or
            self.parameter_count > MAX_PARAMETER_COUNT
        )


@dataclass
class FileMetrics:
    """Metrics for a single file."""
    path: str
    total_lines: int
    code_lines: int
    comment_lines: int
    blank_lines: int
    function_count: int
    functions: List[FunctionMetrics]
    import_count: int
    
    @property
    def hotspot_functions(self) -> List[FunctionMetrics]:
        return [f for f in self.functions if f.needs_attention]
    
    @property
    def complexity_score(self) -> int:
        """Overall complexity score for the file."""
        if not self.functions:
            return 0
        avg_complexity = sum(f.cyclomatic_complexity for f in self.functions) / len(self.functions)
        return int(avg_complexity * len(self.hotspot_functions) + self.total_lines / LINES_PER_COMPLEXITY_POINT)


def count_cyclomatic_complexity(code: str) -> int:
    """
    Estimate cyclomatic complexity by counting decision points.
    This is a simplified heuristic, not a precise calculation.
    """
    decision_keywords = [
        r'\bif\b', r'\belse\s+if\b', r'\belif\b', r'\belse\b',
        r'\bfor\b', r'\bwhile\b', r'\bdo\b',
        r'\bcase\b', r'\bcatch\b', r'\bexcept\b',
        r'\b\?\s*[^:]+\s*:', r'&&', r'\|\|',  # Ternary and logical operators
    ]
    
    complexity = 1  # Base complexity
    for pattern in decision_keywords:
        complexity += len(re.findall(pattern, code))
    
    return complexity


def find_max_nesting_depth(code: str) -> int:
    """Find the maximum nesting depth in code."""
    max_depth = 0
    current_depth = 0
    
    for char in code:
        if char == '{':
            current_depth += 1
            max_depth = max(max_depth, current_depth)
        elif char == '}':
            current_depth = max(0, current_depth - 1)
    
    return max_depth


def extract_functions_js_ts(content: str) -> List[FunctionMetrics]:
    """Extract function metrics from JavaScript/TypeScript code."""
    functions = []
    
    # Patterns for function definitions
    patterns = [
        # function name() { }
        r'function\s+(\w+)\s*\(([^)]*)\)',
        # const name = () => { }
        r'(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>',
        # const name = function() { }
        r'(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s*)?function\s*\([^)]*\)',
        # method() { } in class
        r'(?:async\s+)?(\w+)\s*\(([^)]*)\)\s*(?::\s*\w+(?:<[^>]+>)?)?\s*{',
    ]
    
    lines = content.split('\n')
    
    for pattern in patterns:
        for match in re.finditer(pattern, content):
            name = match.group(1)
            start_pos = match.start()
            start_line = content[:start_pos].count('\n') + 1
            
            # Find the function body
            brace_start = content.find('{', match.end())
            if brace_start == -1:
                # Arrow function without braces
                end_line = start_line
                func_code = match.group(0)
            else:
                # Find matching closing brace
                depth = 1
                pos = brace_start + 1
                while pos < len(content) and depth > 0:
                    if content[pos] == '{':
                        depth += 1
                    elif content[pos] == '}':
                        depth -= 1
                    pos += 1
                
                end_line = content[:pos].count('\n') + 1
                func_code = content[match.start():pos]
            
            # Count parameters
            param_match = re.search(r'\(([^)]*)\)', match.group(0))
            params = param_match.group(1) if param_match else ''
            param_count = len([p for p in params.split(',') if p.strip()]) if params.strip() else 0
            
            functions.append(FunctionMetrics(
                name=name,
                start_line=start_line,
                end_line=end_line,
                line_count=end_line - start_line + 1,
                cyclomatic_complexity=count_cyclomatic_complexity(func_code),
                nesting_depth=find_max_nesting_depth(func_code),
                parameter_count=param_count,
            ))
    
    # Deduplicate by name and line (keep first occurrence)
    seen = set()
    unique_functions = []
    for f in functions:
        key = (f.name, f.start_line)
        if key not in seen:
            seen.add(key)
            unique_functions.append(f)
    
    return unique_functions


def extract_functions_python(content: str) -> List[FunctionMetrics]:
    """Extract function metrics from Python code."""
    functions = []
    lines = content.split('\n')
    
    pattern = r'^(\s*)def\s+(\w+)\s*\(([^)]*)\)'
    
    for i, line in enumerate(lines):
        match = re.match(pattern, line)
        if match:
            indent = len(match.group(1))
            name = match.group(2)
            params = match.group(3)
            start_line = i + 1
            
            # Find end of function (next line with same or less indent that's not empty)
            end_line = start_line
            for j in range(i + 1, len(lines)):
                if lines[j].strip():  # Non-empty line
                    line_indent = len(lines[j]) - len(lines[j].lstrip())
                    if line_indent <= indent and not lines[j].strip().startswith('#'):
                        break
                end_line = j + 1
            
            func_code = '\n'.join(lines[i:end_line])
            param_count = len([p for p in params.split(',') if p.strip()]) if params.strip() else 0
            
            functions.append(FunctionMetrics(
                name=name,
                start_line=start_line,
                end_line=end_line,
                line_count=end_line - start_line + 1,
                cyclomatic_complexity=count_cyclomatic_complexity(func_code),
                nesting_depth=find_max_nesting_depth(func_code.replace(':', '{')),  # Rough Python nesting
                parameter_count=param_count,
            ))
    
    return functions


def analyze_file(filepath: str) -> Optional[FileMetrics]:
    """Analyze a single file and return metrics."""
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
    except Exception as e:
        print(f"Warning: Could not read {filepath}: {e}", file=sys.stderr)
        return None
    
    lines = content.split('\n')
    total_lines = len(lines)
    blank_lines = sum(1 for line in lines if not line.strip())
    
    # Count comments (simplified)
    comment_lines = 0
    in_multiline = False
    for line in lines:
        stripped = line.strip()
        if stripped.startswith('"""') or stripped.startswith("'''"):
            in_multiline = not in_multiline
            comment_lines += 1
        elif in_multiline:
            comment_lines += 1
        elif stripped.startswith('#') or stripped.startswith('//'):
            comment_lines += 1
        elif stripped.startswith('/*'):
            in_multiline = True
            comment_lines += 1
        elif stripped.endswith('*/'):
            in_multiline = False
            comment_lines += 1
    
    code_lines = total_lines - blank_lines - comment_lines
    
    # Count imports
    import_patterns = [
        r'^import\s+',
        r'^from\s+\S+\s+import',
        r'^const\s+.*require\s*\(',
    ]
    import_count = sum(
        1 for line in lines
        if any(re.match(pattern, line.strip()) for pattern in import_patterns)
    )
    
    # Extract functions based on file type
    ext = Path(filepath).suffix.lower()
    if ext in ['.js', '.ts', '.jsx', '.tsx', '.mjs']:
        functions = extract_functions_js_ts(content)
    elif ext == '.py':
        functions = extract_functions_python(content)
    else:
        functions = []
    
    return FileMetrics(
        path=filepath,
        total_lines=total_lines,
        code_lines=code_lines,
        comment_lines=comment_lines,
        blank_lines=blank_lines,
        function_count=len(functions),
        functions=functions,
        import_count=import_count,
    )


def analyze_directory(dirpath: str, extensions: List[str] = None) -> List[FileMetrics]:
    """Analyze all matching files in a directory."""
    if extensions is None:
        extensions = ['.js', '.ts', '.jsx', '.tsx', '.py', '.mjs']
    
    results = []
    
    for root, dirs, files in os.walk(dirpath):
        # Skip common non-source directories
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', '__pycache__', 'dist', 'build', '.venv', 'venv']]
        
        for filename in files:
            if any(filename.endswith(ext) for ext in extensions):
                filepath = os.path.join(root, filename)
                metrics = analyze_file(filepath)
                if metrics:
                    results.append(metrics)
    
    return results


def format_text_report(files: List[FileMetrics], threshold: int = 10) -> str:
    """Format metrics as human-readable text."""
    output = []
    output.append("=" * 60)
    output.append("CODE COMPLEXITY ANALYSIS REPORT")
    output.append("=" * 60)
    output.append("")
    
    # Summary
    total_files = len(files)
    total_lines = sum(f.total_lines for f in files)
    total_functions = sum(f.function_count for f in files)
    hotspot_files = [f for f in files if f.hotspot_functions]
    
    output.append("SUMMARY")
    output.append("-" * 40)
    output.append(f"Files analyzed: {total_files}")
    output.append(f"Total lines: {total_lines:,}")
    output.append(f"Total functions: {total_functions}")
    output.append(f"Files with hotspots: {len(hotspot_files)}")
    output.append("")
    
    # Sort files by complexity score
    sorted_files = sorted(files, key=lambda f: f.complexity_score, reverse=True)
    
    # Top complex files
    output.append("TOP COMPLEX FILES")
    output.append("-" * 40)
    for f in sorted_files[:10]:
        if f.complexity_score >= threshold:
            output.append(f"{f.path}")
            output.append(f"  Lines: {f.total_lines} | Functions: {f.function_count} | Score: {f.complexity_score}")
            if f.hotspot_functions:
                output.append("  Hotspots:")
                for func in f.hotspot_functions[:3]:
                    output.append(f"    - {func.name}() L{func.start_line}-{func.end_line}: {func.line_count} lines, complexity {func.cyclomatic_complexity}")
            output.append("")
    
    # All hotspot functions
    all_hotspots = []
    for f in files:
        for func in f.hotspot_functions:
            all_hotspots.append((f.path, func))
    
    if all_hotspots:
        output.append("ALL HOTSPOT FUNCTIONS")
        output.append("-" * 40)
        all_hotspots.sort(key=lambda x: x[1].line_count, reverse=True)
        for path, func in all_hotspots[:20]:
            issues = []
            if func.line_count > MAX_FUNCTION_LINES:
                issues.append(f"{func.line_count} lines")
            if func.cyclomatic_complexity > MAX_CYCLOMATIC_COMPLEXITY:
                issues.append(f"complexity {func.cyclomatic_complexity}")
            if func.nesting_depth > MAX_NESTING_DEPTH:
                issues.append(f"nesting {func.nesting_depth}")
            if func.parameter_count > MAX_PARAMETER_COUNT:
                issues.append(f"{func.parameter_count} params")
            
            output.append(f"{path}:{func.start_line} {func.name}()")
            output.append(f"  Issues: {', '.join(issues)}")
    
    output.append("")
    output.append("=" * 60)
    
    return '\n'.join(output)


def main():
    parser = argparse.ArgumentParser(description='Analyze code complexity')
    parser.add_argument('path', help='File or directory to analyze')
    parser.add_argument('--format', choices=['text', 'json'], default='text', help='Output format')
    parser.add_argument('--threshold', type=int, default=10, help='Minimum complexity score to report')
    
    args = parser.parse_args()
    
    path = Path(args.path)
    
    if path.is_file():
        metrics = analyze_file(str(path))
        files = [metrics] if metrics else []
    elif path.is_dir():
        files = analyze_directory(str(path))
    else:
        print(f"Error: {path} does not exist", file=sys.stderr)
        sys.exit(1)
    
    if args.format == 'json':
        output = {
            'files': [asdict(f) for f in files],
            'summary': {
                'total_files': len(files),
                'total_lines': sum(f.total_lines for f in files),
                'total_functions': sum(f.function_count for f in files),
                'hotspot_files': len([f for f in files if f.hotspot_functions]),
            }
        }
        print(json.dumps(output, indent=2))
    else:
        print(format_text_report(files, args.threshold))


if __name__ == '__main__':
    main()
