#!/usr/bin/env python3

"""
Hardcoded Date Extractor

Extracts hardcoded date string literals to module-level constants.
Matches the no-hardcoded-dates rule in check_data.py.

Detects patterns: "YYYY-MM-DD", "YYYY/MM/DD", and datetime variants
with T or space separators. Skips dates already assigned to UPPER_CASE
constants, inside comments, or inside docstrings.

Usage:
  python fix_hardcoded_dates.py <path>            Fix all .py files under <path>
  python fix_hardcoded_dates.py file.py           Fix a single file
  python fix_hardcoded_dates.py --dry-run <path>  Show what would change

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

# Match date strings: "2024-01-15", "2024/01/15", "2024-01-15T10:30:00", "2024-01-15 10:30:00"
DATE_RE = re.compile(
    r"""(['"])(20\d{2}[-/]\d{2}[-/]\d{2}(?:[T ]\d{2}:\d{2}(?::\d{2})?)?)\1"""
)

# Variable assignment: name = "date"
ASSIGNMENT_RE = re.compile(r"^\s*([a-zA-Z_]\w*)\s*=\s*")

# Already a constant (ALL_UPPER_SNAKE)
CONSTANT_NAME_RE = re.compile(r"^[A-Z][A-Z0-9_]*$")


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


def make_constant_name(date_str, var_name=None):
    """Generate a constant name for a date string."""
    if var_name and not CONSTANT_NAME_RE.match(var_name):
        return var_name.upper()

    # Fallback: DATE_YYYY_MM_DD
    clean = date_str.replace("-", "_").replace("/", "_").replace("T", "_").replace(":", "_").replace(" ", "_")
    return f"DATE_{clean}"


def process_file(filepath):
    """Extract hardcoded dates to module-level constants. Returns (new_lines, count)."""
    with open(filepath, encoding="utf-8", errors="replace") as f:
        lines = f.readlines()

    # Pass 1: Find all dates and determine constant names
    constants = {}  # date_string -> constant_name
    replacements = []  # (line_index, date_string, quote_char)
    in_docstring = False
    docstring_char = None

    for i, line in enumerate(lines):
        stripped = line.strip()

        # Track triple-quoted docstrings
        for q in ['"""', "'''"]:
            count = stripped.count(q)
            if count >= 2:
                # Opens and closes on same line — not a multiline docstring
                continue
            if count == 1:
                if not in_docstring:
                    in_docstring = True
                    docstring_char = q
                elif q == docstring_char:
                    in_docstring = False
                    docstring_char = None

        if in_docstring:
            continue

        # Skip comment lines
        if stripped.startswith("#"):
            continue

        # Find dates on this line
        for match in DATE_RE.finditer(line):
            quote = match.group(1)
            date_str = match.group(2)
            full_match = match.group(0)

            # Check if already assigned to a constant
            assign_match = ASSIGNMENT_RE.match(line)
            if assign_match:
                var_name = assign_match.group(1)
                if CONSTANT_NAME_RE.match(var_name):
                    continue  # Already a constant

            # Check if inside an inline comment
            before_match = line[:match.start()]
            if "#" in before_match:
                # Rough check: is there an unquoted # before this match?
                clean_before = re.sub(r"""['"][^'"]*['"]""", "", before_match)
                if "#" in clean_before:
                    continue

            # Determine constant name
            if date_str not in constants:
                if assign_match:
                    var_name = assign_match.group(1)
                    const_name = make_constant_name(date_str, var_name)
                else:
                    const_name = make_constant_name(date_str)

                # Deduplicate names
                base = const_name
                suffix = 2
                while const_name in [v for v in constants.values()]:
                    const_name = f"{base}_{suffix}"
                    suffix += 1

                constants[date_str] = const_name

            replacements.append((i, date_str, quote))

    if not replacements:
        return lines, 0

    # Pass 2: Replace date literals with constant names
    new_lines = list(lines)
    for line_idx, date_str, quote in replacements:
        const_name = constants[date_str]
        old = f"{quote}{date_str}{quote}"
        new_lines[line_idx] = new_lines[line_idx].replace(old, const_name, 1)

    # Pass 3: Insert constant definitions after last import, before first def/class
    insert_idx = 0
    last_import = -1
    first_def = len(new_lines)

    for i, line in enumerate(new_lines):
        stripped = line.strip()
        if stripped.startswith(("import ", "from ")):
            last_import = i
        if stripped.startswith(("def ", "class ")) and first_def == len(new_lines):
            first_def = i

    if last_import >= 0:
        insert_idx = last_import + 1
        # Skip blank lines after imports
        while insert_idx < len(new_lines) and new_lines[insert_idx].strip() == "":
            insert_idx += 1
    elif first_def < len(new_lines):
        insert_idx = first_def
    else:
        insert_idx = 0

    # Build constant block
    const_lines = ["\n"]
    for date_str, const_name in sorted(constants.items(), key=lambda x: x[1]):
        const_lines.append(f'{const_name} = "{date_str}"\n')
    const_lines.append("\n")

    # Insert
    for j, cl in enumerate(const_lines):
        new_lines.insert(insert_idx + j, cl)

    return new_lines, len(replacements)


def main():
    dry_run = "--dry-run" in sys.argv
    args = [a for a in sys.argv[1:] if a != "--dry-run"]

    if not args:
        print("Usage: fix_hardcoded_dates.py [--dry-run] <path>", file=sys.stderr)
        sys.exit(1)

    target = args[0]
    if os.path.isfile(target):
        files = [target] if not is_test_file(target) else []
    else:
        files = find_py_files(target)

    total_fixes = 0
    files_modified = 0

    for fp in files:
        new_lines, fixes = process_file(fp)
        if fixes > 0:
            rel = os.path.relpath(fp)
            if dry_run:
                print(f"  {rel}: {fixes} hardcoded date(s) would be extracted")
            else:
                with open(fp, "w", encoding="utf-8") as f:
                    f.writelines(new_lines)
                print(f"  {rel}: {fixes} hardcoded date(s) extracted to constants")
            total_fixes += fixes
            files_modified += 1

    if total_fixes == 0:
        print("  No hardcoded dates found")
    else:
        action = "would be modified" if dry_run else "modified"
        print(f"\n  {files_modified} file(s) {action}, {total_fixes} date(s) extracted")


if __name__ == "__main__":
    main()
