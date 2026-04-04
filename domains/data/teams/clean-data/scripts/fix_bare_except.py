#!/usr/bin/env python3

"""
Bare Except Fixer

Converts bare except: and except Exception: pass to proper exception handling.
Matches the no-bare-except rule in check_data.py.

Patterns fixed:
  except:                      -> except Exception:
  except:\n    pass             -> except Exception:\n    raise
  except Exception:\n    pass  -> except Exception:\n    raise

Skips test files and content inside strings or comments.

Usage:
  python fix_bare_except.py <path>            Fix all .py files under <path>
  python fix_bare_except.py file.py           Fix a single file
  python fix_bare_except.py --dry-run <path>  Show what would change

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

BARE_EXCEPT_RE = re.compile(r"^(\s*)except\s*:\s*$")
EXCEPT_EXCEPTION_RE = re.compile(
    r"^(\s*)except\s+Exception(\s+as\s+\w+)?\s*:\s*$"
)


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
    """Replace string literals with empty strings so regex won't match inside them."""
    line = re.sub(r'"[^"\\]*(?:\\.[^"\\]*)*"', '""', line)
    line = re.sub(r"'[^'\\]*(?:\\.[^'\\]*)*'", "''", line)
    return line


def find_body_pass_index(lines, except_line_index):
    """Find the index of a lone 'pass' in the except block body.

    Returns the line index if the body is a single 'pass' statement,
    or -1 if the body contains other statements.
    """
    except_line = lines[except_line_index]
    except_indent = len(except_line) - len(except_line.lstrip())
    body_indent = None
    pass_index = -1
    has_other_statements = False

    for j in range(except_line_index + 1, min(except_line_index + 20, len(lines))):
        raw = lines[j]
        stripped = raw.strip()

        # Skip blank lines and comments
        if not stripped or stripped.startswith("#"):
            continue

        line_indent = len(raw) - len(raw.lstrip())

        # If we've dedented back to or past the except level, block is over
        if line_indent <= except_indent:
            break

        # First real statement sets the body indent
        if body_indent is None:
            body_indent = line_indent

        # Only count lines at body indent level (not nested deeper)
        if line_indent == body_indent:
            if stripped == "pass" and pass_index == -1:
                pass_index = j
            else:
                has_other_statements = True
                break

    if has_other_statements:
        return -1
    return pass_index


def process_file(filepath):
    """Fix bare except patterns in a file. Returns (new_lines, changes_list)."""
    with open(filepath, encoding="utf-8", errors="replace") as f:
        lines = f.readlines()

    result = list(lines)
    changes = []
    in_triple_single = False
    in_triple_double = False

    for i, line in enumerate(lines):
        stripped = line.strip()

        # Track triple-quoted strings (docstrings / multiline strings)
        triple_double = stripped.count('"""')
        triple_single = stripped.count("'''")

        if in_triple_double:
            if triple_double % 2 == 1:
                in_triple_double = False
            continue
        if in_triple_single:
            if triple_single % 2 == 1:
                in_triple_single = False
            continue

        # Detect opening triple quotes that don't close on the same line
        if triple_double % 2 == 1:
            in_triple_double = True
            continue
        if triple_single % 2 == 1:
            in_triple_single = True
            continue

        # Skip comment lines
        if stripped.startswith("#"):
            continue

        # Check for except patterns on the string-stripped version
        clean = strip_strings(line)
        clean_stripped = clean.strip()

        # Pattern: bare except:
        bare_match = BARE_EXCEPT_RE.match(line)
        if bare_match and BARE_EXCEPT_RE.match(clean):
            indent = bare_match.group(1)
            pass_idx = find_body_pass_index(lines, i)

            if pass_idx >= 0:
                # except:\n    pass -> except Exception:\n    raise
                result[i] = f"{indent}except Exception:\n"
                body_indent = lines[pass_idx][: len(lines[pass_idx]) - len(lines[pass_idx].lstrip())]
                result[pass_idx] = f"{body_indent}raise\n"
                changes.append(f"line {i + 1}: except: pass -> except Exception: raise")
            else:
                # except: -> except Exception:
                result[i] = f"{indent}except Exception:\n"
                changes.append(f"line {i + 1}: except: -> except Exception:")
            continue

        # Pattern: except Exception: with pass-only body
        exc_match = EXCEPT_EXCEPTION_RE.match(line)
        if exc_match and EXCEPT_EXCEPTION_RE.match(clean):
            pass_idx = find_body_pass_index(lines, i)

            if pass_idx >= 0:
                body_indent = lines[pass_idx][: len(lines[pass_idx]) - len(lines[pass_idx].lstrip())]
                result[pass_idx] = f"{body_indent}raise\n"
                changes.append(f"line {pass_idx + 1}: pass -> raise (under except Exception)")

    return result, changes


def main():
    dry_run = "--dry-run" in sys.argv
    args = [a for a in sys.argv[1:] if a != "--dry-run"]

    if not args:
        print("Usage: fix_bare_except.py [--dry-run] <path>", file=sys.stderr)
        sys.exit(1)

    target = args[0]
    files = [target] if os.path.isfile(target) else find_py_files(target)

    total_changes = 0
    files_modified = 0

    for fp in files:
        new_lines, changes = process_file(fp)
        if changes:
            rel = os.path.relpath(fp)
            if dry_run:
                print(f"  {rel}: {len(changes)} fix(es) would be applied")
                for c in changes:
                    print(f"    {c}")
            else:
                with open(fp, "w", encoding="utf-8") as f:
                    f.writelines(new_lines)
                print(f"  {rel}: {len(changes)} fix(es) applied")
                for c in changes:
                    print(f"    {c}")
            total_changes += len(changes)
            files_modified += 1

    if total_changes == 0:
        print("  No bare except patterns found")
    else:
        action = "would be modified" if dry_run else "modified"
        print(f"\n  {files_modified} file(s) {action}, {total_changes} fix(es) applied")


if __name__ == "__main__":
    main()
