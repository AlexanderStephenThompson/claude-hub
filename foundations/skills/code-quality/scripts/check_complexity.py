#!/usr/bin/env python3
"""
Check code complexity metrics across a codebase.

Validates:
1. Function length (lines of code)
2. Nesting depth (max indentation levels)
3. Parameter count (function arguments)

Usage:
    python check_complexity.py <path> [--format json|text] [--max-lines 30] [--max-depth 3] [--max-params 4]
"""

import os
import re
import sys
import json
import argparse
from pathlib import Path
from typing import Dict, List
from dataclasses import dataclass, field


# Defaults
DEFAULT_MAX_LINES = 30
DEFAULT_MAX_DEPTH = 3
DEFAULT_MAX_PARAMS = 4
MAX_FUNCTION_BODY_SCAN = 500


@dataclass
class ComplexityIssue:
    """Represents a complexity issue."""
    file: str
    line: int
    name: str
    issue_type: str
    value: int
    threshold: int
    message: str


@dataclass
class ComplexityResult:
    """Results of complexity validation."""
    files_checked: int = 0
    functions_checked: int = 0
    issues: List[ComplexityIssue] = field(default_factory=list)

    @property
    def is_valid(self) -> bool:
        return len(self.issues) == 0


@dataclass
class FunctionInfo:
    """Information about a detected function."""
    name: str
    file: str
    start_line: int
    end_line: int
    param_count: int
    max_depth: int
    line_count: int


def detect_functions_python(filepath: str) -> List[FunctionInfo]:
    """Detect Python function definitions and their metrics."""
    functions = []

    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            lines = f.readlines()
    except Exception:
        return functions

    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.rstrip()

        match = re.match(r'^(\s*)def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\((.*)', stripped)
        if not match:
            i += 1
            continue

        indent = len(match.group(1))
        name = match.group(2)
        param_text = match.group(3)

        while ')' not in param_text and i + 1 < len(lines):
            i += 1
            param_text += lines[i].strip()

        param_count = count_params(param_text.split(')')[0])

        start_line = i + 1
        func_lines = []
        max_depth = 0
        j = i + 1

        while j < len(lines):
            func_line = lines[j]
            func_stripped = func_line.rstrip()

            if not func_stripped:
                func_lines.append(func_stripped)
                j += 1
                continue

            line_indent = len(func_line) - len(func_line.lstrip())

            # Function ends at same or lower indent (excluding blanks and comments)
            if line_indent <= indent and func_stripped and not func_stripped.startswith('#'):
                break

            func_lines.append(func_stripped)

            if func_stripped and not func_stripped.startswith('#'):
                body_indent = indent + 4
                relative_depth = max(0, (line_indent - body_indent) // 4) + 1
                max_depth = max(max_depth, relative_depth)

            j += 1

        code_lines = [
            func_line for func_line in func_lines
            if func_line.strip() and not func_line.strip().startswith('#')
        ]

        functions.append(FunctionInfo(
            name=name,
            file=filepath,
            start_line=start_line,
            end_line=j,
            param_count=param_count,
            max_depth=max_depth,
            line_count=len(code_lines),
        ))

        i += 1

    return functions


def detect_functions_js(filepath: str) -> List[FunctionInfo]:
    """Detect JavaScript/TypeScript function definitions and their metrics."""
    functions = []

    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            lines = f.readlines()
    except Exception:
        return functions

    for i, line in enumerate(lines):
        stripped = line.rstrip()

        # Match function declarations and arrow functions
        patterns = [
            r'(?:export\s+)?(?:async\s+)?function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\((.*)',
            r'(?:export\s+)?(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:async\s+)?\(?([^)]*)',
        ]

        for pattern in patterns:
            match = re.search(pattern, stripped)
            if match:
                name = match.group(1)
                param_text = match.group(2)
                param_count = count_params(param_text.split(')')[0] if ')' in param_text else param_text)

                # Find function body (count braces)
                brace_count = 0
                started = False
                end_line = i
                max_depth = 0
                code_lines = 0

                for j in range(i, min(i + MAX_FUNCTION_BODY_SCAN, len(lines))):
                    func_line = lines[j]

                    for char in func_line:
                        if char == '{':
                            brace_count += 1
                            started = True
                        elif char == '}':
                            brace_count -= 1

                    if started and func_line.strip() and not func_line.strip().startswith('//'):
                        code_lines += 1
                        # Estimate nesting from indentation
                        base_indent = len(line) - len(line.lstrip())
                        line_indent = len(func_line) - len(func_line.lstrip())
                        relative_depth = max(0, (line_indent - base_indent) // 2)
                        max_depth = max(max_depth, relative_depth)

                    if started and brace_count <= 0:
                        end_line = j
                        break

                functions.append(FunctionInfo(
                    name=name,
                    file=filepath,
                    start_line=i + 1,
                    end_line=end_line + 1,
                    param_count=param_count,
                    max_depth=max(0, max_depth - 1),
                    line_count=code_lines,
                ))
                break

    return functions


def count_params(param_text: str) -> int:
    """Count function parameters from parameter text."""
    param_text = param_text.strip()

    if not param_text:
        return 0

    # Remove 'self' and 'cls' (Python)
    params = [p.strip() for p in param_text.split(',')]
    params = [p for p in params if p and p not in ('self', 'cls')]

    # Remove type annotations and defaults for counting
    return len(params)


def validate_function(
    func: FunctionInfo,
    max_lines: int,
    max_depth: int,
    max_params: int,
) -> List[ComplexityIssue]:
    """Validate a single function against complexity thresholds."""
    issues = []

    if func.line_count > max_lines:
        issues.append(ComplexityIssue(
            file=func.file,
            line=func.start_line,
            name=func.name,
            issue_type='function_length',
            value=func.line_count,
            threshold=max_lines,
            message=f"Function '{func.name}' has {func.line_count} lines (max: {max_lines})",
        ))

    if func.max_depth > max_depth:
        issues.append(ComplexityIssue(
            file=func.file,
            line=func.start_line,
            name=func.name,
            issue_type='nesting_depth',
            value=func.max_depth,
            threshold=max_depth,
            message=f"Function '{func.name}' has nesting depth {func.max_depth} (max: {max_depth})",
        ))

    if func.param_count > max_params:
        issues.append(ComplexityIssue(
            file=func.file,
            line=func.start_line,
            name=func.name,
            issue_type='parameter_count',
            value=func.param_count,
            threshold=max_params,
            message=f"Function '{func.name}' has {func.param_count} parameters (max: {max_params})",
        ))

    return issues


def validate_directory(
    path: str,
    max_lines: int,
    max_depth: int,
    max_params: int,
) -> ComplexityResult:
    """Validate all files in a directory."""
    result = ComplexityResult()

    python_extensions = {'.py'}
    js_extensions = {'.js', '.jsx', '.ts', '.tsx'}
    all_extensions = python_extensions | js_extensions

    for root, dirs, files in os.walk(path):
        dirs[:] = [d for d in dirs if d not in {
            'node_modules', '__pycache__', '.git', 'venv', 'env',
            'dist', 'build', '.next', 'coverage', '.mypy_cache',
        }]

        for file in files:
            ext = Path(file).suffix
            if ext not in all_extensions:
                continue

            filepath = os.path.join(root, file)
            result.files_checked += 1

            if ext in python_extensions:
                functions = detect_functions_python(filepath)
            else:
                functions = detect_functions_js(filepath)

            result.functions_checked += len(functions)

            for func in functions:
                issues = validate_function(func, max_lines, max_depth, max_params)
                result.issues.extend(issues)

    return result


def format_output(result: ComplexityResult, format_type: str) -> str:
    """Format the validation results."""
    if format_type == 'json':
        return json.dumps({
            'valid': result.is_valid,
            'files_checked': result.files_checked,
            'functions_checked': result.functions_checked,
            'issues': [
                {
                    'file': i.file,
                    'line': i.line,
                    'name': i.name,
                    'type': i.issue_type,
                    'value': i.value,
                    'threshold': i.threshold,
                    'message': i.message,
                }
                for i in result.issues
            ]
        }, indent=2)

    # Text format
    lines = []
    lines.append("=" * 60)
    lines.append("CODE COMPLEXITY VALIDATION REPORT")
    lines.append("=" * 60)
    lines.append("")

    status = "PASS" if result.is_valid else "ISSUES FOUND"
    lines.append(f"Status: {status}")
    lines.append(f"Files checked: {result.files_checked}")
    lines.append(f"Functions checked: {result.functions_checked}")
    lines.append(f"Issues found: {len(result.issues)}")
    lines.append("")

    if result.issues:
        # Group by issue type
        by_type: Dict[str, List[ComplexityIssue]] = {}
        for issue in result.issues:
            by_type.setdefault(issue.issue_type, []).append(issue)

        for issue_type, issues in by_type.items():
            label = issue_type.upper().replace('_', ' ')
            lines.append(f"{label} ({len(issues)}):")
            lines.append("-" * 40)
            for issue in sorted(issues, key=lambda x: x.value, reverse=True):
                lines.append(f"  {issue.file}:{issue.line}")
                lines.append(f"    {issue.name}: {issue.value} (max: {issue.threshold})")
                lines.append("")

    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(
        description='Check code complexity metrics'
    )
    parser.add_argument('path', help='Path to validate')
    parser.add_argument(
        '--format', choices=['json', 'text'], default='text',
        help='Output format (default: text)'
    )
    parser.add_argument(
        '--max-lines', type=int, default=DEFAULT_MAX_LINES,
        help=f'Max function lines (default: {DEFAULT_MAX_LINES})'
    )
    parser.add_argument(
        '--max-depth', type=int, default=DEFAULT_MAX_DEPTH,
        help=f'Max nesting depth (default: {DEFAULT_MAX_DEPTH})'
    )
    parser.add_argument(
        '--max-params', type=int, default=DEFAULT_MAX_PARAMS,
        help=f'Max parameter count (default: {DEFAULT_MAX_PARAMS})'
    )

    args = parser.parse_args()

    if not os.path.exists(args.path):
        print(f"Error: Path '{args.path}' does not exist")
        sys.exit(1)

    result = validate_directory(
        args.path,
        args.max_lines,
        args.max_depth,
        args.max_params,
    )
    print(format_output(result, args.format))

    if not result.is_valid:
        sys.exit(1)


if __name__ == '__main__':
    main()
