#!/usr/bin/env python3
"""
Dead Code Detector

Identifies potentially unused code: unreferenced functions, unused imports,
and commented-out code blocks.

This is a heuristic-based tool - results should be verified manually.

Usage:
    python detect_dead_code.py <path> [--format json|text]

Examples:
    python detect_dead_code.py src/
    python detect_dead_code.py src/utils.ts --format json
"""

import argparse
import json
import os
import re
import sys
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import List, Set, Dict
from collections import defaultdict


MIN_COMMENTED_BLOCK_LINES = 2
PREVIEW_MAX_LENGTH = 60


@dataclass
class UnusedImport:
    """An import that appears unused in the file."""
    file: str
    line: int
    import_statement: str
    imported_names: List[str]


@dataclass
class UnusedExport:
    """An exported function/variable that may be unused across the codebase."""
    file: str
    line: int
    name: str
    export_type: str  # 'function', 'const', 'class', etc.


@dataclass
class CommentedCode:
    """A block of commented-out code."""
    file: str
    start_line: int
    end_line: int
    preview: str


@dataclass
class DeadCodeReport:
    """Full report of potential dead code."""
    unused_imports: List[UnusedImport]
    unused_exports: List[UnusedExport]
    commented_code: List[CommentedCode]
    

def extract_imported_names(import_line: str) -> List[str]:
    """Extract the names being imported from an import statement."""
    names = []
    
    match = re.match(r'import\s+(\w+)\s+from', import_line)
    if match:
        names.append(match.group(1))

    match = re.search(r'import\s*{([^}]+)}', import_line)
    if match:
        for name in match.group(1).split(','):
            name = name.strip()
            if ' as ' in name:
                name = name.split(' as ')[1].strip()
            if name:
                names.append(name)

    match = re.search(r'import\s*\*\s*as\s+(\w+)', import_line)
    if match:
        names.append(match.group(1))

    match = re.match(r'from\s+\S+\s+import\s+(.+)', import_line)
    if match:
        for name in match.group(1).split(','):
            name = name.strip()
            if ' as ' in name:
                name = name.split(' as ')[1].strip()
            if name and name != '*':
                names.append(name)

    match = re.match(r'^import\s+([^{][^;]+)$', import_line)
    if match and 'from' not in import_line:
        for name in match.group(1).split(','):
            name = name.strip()
            if ' as ' in name:
                name = name.split(' as ')[1].strip()
            if name:
                names.append(name.split('.')[0])  # For 'import os.path'
    
    return names


def find_unused_imports(filepath: str, content: str) -> List[UnusedImport]:
    """Find imports that aren't used in the file."""
    unused = []
    lines = content.split('\n')
    
    imports = []
    for i, line in enumerate(lines):
        stripped = line.strip()
        if stripped.startswith('import ') or stripped.startswith('from '):
            names = extract_imported_names(stripped)
            if names:
                imports.append((i + 1, stripped, names))
    
    code_lines = []
    in_multiline_comment = False
    for line in lines:
        stripped = line.strip()
        
        if stripped.startswith('/*'):
            in_multiline_comment = True
        if in_multiline_comment:
            if '*/' in stripped:
                in_multiline_comment = False
            continue
        
        if not (stripped.startswith('import ') or 
                stripped.startswith('from ') or
                stripped.startswith('//') or
                stripped.startswith('#')):
            code_lines.append(line)
    
    code_text = '\n'.join(code_lines)

    for line_num, import_stmt, names in imports:
        unused_names = []
        for name in names:
            pattern = rf'\b{re.escape(name)}\b'
            if not re.search(pattern, code_text):
                unused_names.append(name)
        
        if unused_names:
            unused.append(UnusedImport(
                file=filepath,
                line=line_num,
                import_statement=import_stmt,
                imported_names=unused_names,
            ))
    
    return unused


def find_exports(filepath: str, content: str) -> List[tuple]:
    """Find all exports in a file."""
    exports = []
    lines = content.split('\n')
    
    patterns = [
        # export function name
        (r'export\s+(?:async\s+)?function\s+(\w+)', 'function'),
        # export const/let/var name
        (r'export\s+(?:const|let|var)\s+(\w+)', 'const'),
        # export class name
        (r'export\s+class\s+(\w+)', 'class'),
        # export { name }
        (r'export\s*{\s*(\w+)', 'named'),
        # export default
        (r'export\s+default\s+(?:function\s+)?(\w+)', 'default'),
        # module.exports.name (CommonJS)
        (r'module\.exports\.(\w+)\s*=', 'commonjs'),
        # exports.name (CommonJS)
        (r'(?<!module\.)exports\.(\w+)\s*=', 'commonjs'),
    ]
    
    for i, line in enumerate(lines):
        for pattern, export_type in patterns:
            match = re.search(pattern, line)
            if match:
                exports.append((i + 1, match.group(1), export_type))
    
    return exports


def find_all_references(directory: str, extensions: List[str] = None) -> Dict[str, Set[str]]:
    """Build a map of all identifiers referenced across files."""
    if extensions is None:
        extensions = ['.js', '.ts', '.jsx', '.tsx', '.py', '.mjs']
    
    references = defaultdict(set)  # name -> set of files that reference it
    
    for root, dirs, files in os.walk(directory):
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', '__pycache__', 'dist', 'build']]
        
        for filename in files:
            if any(filename.endswith(ext) for ext in extensions):
                filepath = os.path.join(root, filename)
                try:
                    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                    
                    # Find all word-like tokens
                    tokens = set(re.findall(r'\b([A-Za-z_]\w*)\b', content))
                    for token in tokens:
                        references[token].add(filepath)
                        
                except Exception:
                    pass
    
    return references


def find_unused_exports(directory: str) -> List[UnusedExport]:
    """Find exports that might not be used anywhere."""
    extensions = ['.js', '.ts', '.jsx', '.tsx', '.py', '.mjs']
    
    # First, build reference map
    references = find_all_references(directory, extensions)
    
    # Then check each file's exports
    unused = []
    
    for root, dirs, files in os.walk(directory):
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', '__pycache__', 'dist', 'build']]
        
        for filename in files:
            if any(filename.endswith(ext) for ext in extensions):
                filepath = os.path.join(root, filename)
                try:
                    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                    
                    exports = find_exports(filepath, content)
                    
                    for line_num, name, export_type in exports:
                        # Check if this export is referenced in OTHER files
                        referencing_files = references.get(name, set())
                        other_files = referencing_files - {filepath}
                        
                        if not other_files:
                            unused.append(UnusedExport(
                                file=filepath,
                                line=line_num,
                                name=name,
                                export_type=export_type,
                            ))
                            
                except Exception:
                    pass
    
    return unused


def find_commented_code(filepath: str, content: str) -> List[CommentedCode]:
    """Find blocks of commented-out code."""
    commented = []
    lines = content.split('\n')
    
    # Patterns that suggest code rather than documentation
    code_patterns = [
        r'^\s*//\s*(if|for|while|function|const|let|var|return|import|export)\b',
        r'^\s*//\s*\w+\s*[=({]',  # Assignments or function calls
        r'^\s*//\s*}\s*$',  # Closing braces
        r'^\s*#\s*(if|for|while|def|class|return|import|from)\b',  # Python
        r'^\s*#\s*\w+\s*[=(]',
    ]
    
    i = 0
    while i < len(lines):
        line = lines[i]

        if not any(re.match(pattern, line) for pattern in code_patterns):
            i += 1
            continue

        start_line = i + 1
        end_line = start_line

        j = i + 1
        while j < len(lines):
            next_line = lines[j]
            if next_line.strip().startswith('//') or next_line.strip().startswith('#'):
                end_line = j + 1
                j += 1
            elif not next_line.strip():
                j += 1
            else:
                break

        if end_line - start_line >= MIN_COMMENTED_BLOCK_LINES:
            preview = lines[i].strip()[:PREVIEW_MAX_LENGTH]
            if len(lines[i].strip()) > PREVIEW_MAX_LENGTH:
                preview += '...'

            commented.append(CommentedCode(
                file=filepath,
                start_line=start_line,
                end_line=end_line,
                preview=preview,
            ))

        i = j
    
    return commented


def analyze_file(filepath: str) -> Dict:
    """Analyze a single file for dead code."""
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
    except Exception as e:
        return {'error': str(e)}
    
    return {
        'unused_imports': find_unused_imports(filepath, content),
        'commented_code': find_commented_code(filepath, content),
    }


def analyze_directory(dirpath: str) -> DeadCodeReport:
    """Analyze a directory for dead code."""
    extensions = ['.js', '.ts', '.jsx', '.tsx', '.py', '.mjs']
    
    all_unused_imports = []
    all_commented_code = []
    
    for root, dirs, files in os.walk(dirpath):
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', '__pycache__', 'dist', 'build']]
        
        for filename in files:
            if any(filename.endswith(ext) for ext in extensions):
                filepath = os.path.join(root, filename)
                result = analyze_file(filepath)
                
                if 'error' not in result:
                    all_unused_imports.extend(result['unused_imports'])
                    all_commented_code.extend(result['commented_code'])
    
    # Find unused exports across the codebase
    unused_exports = find_unused_exports(dirpath)
    
    return DeadCodeReport(
        unused_imports=all_unused_imports,
        unused_exports=unused_exports,
        commented_code=all_commented_code,
    )


def format_text_report(report: DeadCodeReport) -> str:
    """Format the report as human-readable text."""
    output = []
    output.append("=" * 60)
    output.append("DEAD CODE DETECTION REPORT")
    output.append("=" * 60)
    output.append("")
    output.append("⚠️  These are potential issues - verify before removing!")
    output.append("")
    
    # Unused imports
    if report.unused_imports:
        output.append("UNUSED IMPORTS")
        output.append("-" * 40)
        for item in report.unused_imports:
            output.append(f"{item.file}:{item.line}")
            output.append(f"  {item.import_statement}")
            output.append(f"  Unused: {', '.join(item.imported_names)}")
            output.append("")
    else:
        output.append("No unused imports detected.")
        output.append("")
    
    # Unused exports
    if report.unused_exports:
        output.append("POTENTIALLY UNUSED EXPORTS")
        output.append("-" * 40)
        output.append("(Not referenced in other files - may be used externally)")
        output.append("")
        for item in report.unused_exports:
            output.append(f"{item.file}:{item.line}")
            output.append(f"  {item.export_type}: {item.name}")
            output.append("")
    else:
        output.append("No unused exports detected.")
        output.append("")
    
    # Commented code
    if report.commented_code:
        output.append("COMMENTED-OUT CODE")
        output.append("-" * 40)
        for item in report.commented_code:
            output.append(f"{item.file}:{item.start_line}-{item.end_line}")
            output.append(f"  {item.preview}")
            output.append("")
    else:
        output.append("No significant commented-out code detected.")
        output.append("")
    
    # Summary
    output.append("SUMMARY")
    output.append("-" * 40)
    output.append(f"Unused imports: {len(report.unused_imports)}")
    output.append(f"Potentially unused exports: {len(report.unused_exports)}")
    output.append(f"Commented code blocks: {len(report.commented_code)}")
    output.append("")
    output.append("=" * 60)
    
    return '\n'.join(output)


def main():
    parser = argparse.ArgumentParser(description='Detect potential dead code')
    parser.add_argument('path', help='File or directory to analyze')
    parser.add_argument('--format', choices=['text', 'json'], default='text', help='Output format')
    
    args = parser.parse_args()
    path = Path(args.path)
    
    if path.is_file():
        result = analyze_file(str(path))
        report = DeadCodeReport(
            unused_imports=result.get('unused_imports', []),
            unused_exports=[],
            commented_code=result.get('commented_code', []),
        )
    elif path.is_dir():
        report = analyze_directory(str(path))
    else:
        print(f"Error: {path} does not exist", file=sys.stderr)
        sys.exit(1)
    
    if args.format == 'json':
        output = {
            'unused_imports': [asdict(x) for x in report.unused_imports],
            'unused_exports': [asdict(x) for x in report.unused_exports],
            'commented_code': [asdict(x) for x in report.commented_code],
        }
        print(json.dumps(output, indent=2))
    else:
        print(format_text_report(report))


if __name__ == '__main__':
    main()
