#!/usr/bin/env python3

"""
Print Statement Stripper

Removes print() statements from Python files. Matches the no-print-logging
rule in check_data.py. Skips test files and if __name__ == "__main__" blocks.

Handles multi-line print calls by tracking parenthesis depth.

Usage:
  python strip_print.py <path>            Fix all .py files under <path>
  python strip_print.py file.py           Fix a single file
  python strip_print.py --dry-run <path>  Show what would change

Exit: 0 = success, 1 = error
"""

import os
import re
import sys

IGNORE_DIRS = {
    "node_modules", ".git", "~Transfer", "dist", "build",
    "__pycache__", ".venv", "venv", ".tox", ".mypy_cache",
    ".pytest_cache",
}

PRINT_RE = re.compile(r"\bprint\s*\(")


def is_test_file(filepath):
    basename = os.path.basename(filepath)
    return (
        basename.startswith("test_")
        or basename.endswith("_test.py")
        or basename == "conftest.py"
        or "/tests/" in filepath.replace("\\", "/")
        or "\\tests\\" in filepath
    )


def find_py_files(root):
    results = []
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in IGNORE_DIRS]
        for fname in filenames:
            if fname.endswith(".py"):
                fp = os.path.join(dirpath, fname)
                if not is_test_file(fp):
                    results.append(fp)
    return sorted(results)


def strip_strings(line):
    line = re.sub(r'"[^"\\]*(?:\\.[^"\\]*)*"', '""', line)
    line = re.sub(r"'[^'\\]*(?:\\.[^'\\]*)*'", "''", line)
    return line


def process_file(filepath):
    """Remove print() calls from a file. Returns (modified_lines, count)."""
    with open(filepath, encoding="utf-8", errors="replace") as f:
        lines = f.readlines()

    result = []
    removed = 0
    in_main_block = False
    skip_until_depth_zero = False
    paren_depth = 0
    i = 0

    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        # Track __main__ blocks
        if re.match(r"""if\s+__name__\s*==\s*['"]__main__['"]\s*:""", stripped):
            in_main_block = True
            result.append(line)
            i += 1
            continue
        elif in_main_block and stripped and not stripped.startswith("#") and not line[0:1] in (" ", "\t"):
            in_main_block = False

        # Skip prints inside __main__
        if in_main_block:
            result.append(line)
            i += 1
            continue

        # Handle continuation of multi-line print removal
        if skip_until_depth_zero:
            for ch in line:
                if ch == "(":
                    paren_depth += 1
                elif ch == ")":
                    paren_depth -= 1
            if paren_depth <= 0:
                skip_until_depth_zero = False
                paren_depth = 0
            i += 1
            continue

        # Check for print() on this line
        clean = strip_strings(line)
        if PRINT_RE.search(clean):
            # Count parens to handle multi-line
            paren_depth = 0
            for ch in line[line.index("print"):]:
                if ch == "(":
                    paren_depth += 1
                elif ch == ")":
                    paren_depth -= 1

            if paren_depth > 0:
                skip_until_depth_zero = True

            # Check if print is the only statement on the line
            before_print = line[:line.index("print")].strip()
            if not before_print:
                # Check if we need to replace with pass (e.g., in except: block)
                if i > 0:
                    prev_stripped = lines[i - 1].strip()
                    if prev_stripped.endswith(":") and any(
                        prev_stripped.startswith(kw)
                        for kw in ("except", "else", "elif", "if", "for", "while", "with", "try", "finally")
                    ):
                        indent = line[: len(line) - len(line.lstrip())]
                        result.append(f"{indent}pass\n")
                        removed += 1
                        i += 1
                        continue

                removed += 1
                i += 1
                continue

        result.append(line)
        i += 1

    return result, removed


def main():
    dry_run = "--dry-run" in sys.argv
    args = [a for a in sys.argv[1:] if a != "--dry-run"]

    if not args:
        print("Usage: strip_print.py [--dry-run] <path>", file=sys.stderr)
        sys.exit(1)

    target = args[0]
    files = [target] if os.path.isfile(target) else find_py_files(target)

    total_removed = 0
    files_modified = 0

    for fp in files:
        new_lines, removed = process_file(fp)
        if removed > 0:
            rel = os.path.relpath(fp)
            if dry_run:
                print(f"  {rel}: {removed} print statement(s) would be removed")
            else:
                with open(fp, "w", encoding="utf-8") as f:
                    f.writelines(new_lines)
                print(f"  {rel}: {removed} print statement(s) removed")
            total_removed += removed
            files_modified += 1

    if total_removed == 0:
        print("  No print statements found")
    else:
        action = "would be modified" if dry_run else "modified"
        print(f"\n  {files_modified} file(s) {action}, {total_removed} print statement(s) removed")


if __name__ == "__main__":
    main()
