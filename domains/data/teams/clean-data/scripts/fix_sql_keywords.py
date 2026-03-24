#!/usr/bin/env python3

"""
SQL Keyword Uppercaser

Uppercases SQL keywords in .sql files for consistency. Preserves content
inside string literals and comments.

Usage:
  python fix_sql_keywords.py <path>            Fix all .sql files under <path>
  python fix_sql_keywords.py file.sql          Fix a single file
  python fix_sql_keywords.py --dry-run <path>  Show what would change

Exit: 0 = success, 1 = error
"""

import os
import re
import sys

IGNORE_DIRS = {
    "node_modules", ".git", "~Transfer", "dist", "build",
    "__pycache__", ".venv", "venv",
}

# SQL keywords to uppercase (sorted by length desc to match longer first)
KEYWORDS = sorted([
    "SELECT", "FROM", "WHERE", "JOIN", "LEFT", "RIGHT", "INNER", "OUTER",
    "CROSS", "FULL", "ON", "AND", "OR", "NOT", "IN", "EXISTS", "BETWEEN",
    "LIKE", "ILIKE", "ORDER", "BY", "GROUP", "HAVING", "LIMIT", "OFFSET",
    "UNION", "ALL", "INTERSECT", "EXCEPT", "INSERT", "INTO", "VALUES",
    "UPDATE", "SET", "DELETE", "CREATE", "ALTER", "DROP", "TABLE", "INDEX",
    "VIEW", "SCHEMA", "DATABASE", "IF", "ELSE", "END", "CASE", "WHEN",
    "THEN", "AS", "WITH", "RECURSIVE", "DISTINCT", "COUNT", "SUM", "AVG",
    "MIN", "MAX", "COALESCE", "NULLIF", "CAST", "PARTITION", "OVER",
    "ROW_NUMBER", "RANK", "DENSE_RANK", "LAG", "LEAD", "FIRST_VALUE",
    "LAST_VALUE", "NULL", "IS", "TRUE", "FALSE", "ASC", "DESC", "FETCH",
    "NEXT", "ROWS", "ONLY", "RETURNING", "DO", "NOTHING", "MERGE",
    "USING", "MATCHED", "GRANT", "REVOKE", "TRUNCATE", "BEGIN", "COMMIT",
    "ROLLBACK", "EXPLAIN", "ANALYZE", "CONFLICT",
], key=len, reverse=True)

# Build regex pattern for word-boundary matching
KEYWORD_PATTERN = re.compile(
    r"\b(" + "|".join(re.escape(kw) for kw in KEYWORDS) + r")\b",
    re.IGNORECASE,
)


def find_sql_files(root):
    results = []
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in IGNORE_DIRS]
        for fname in filenames:
            if fname.endswith(".sql"):
                results.append(os.path.join(dirpath, fname))
    return sorted(results)


def uppercase_keywords_in_line(line):
    """Uppercase SQL keywords while preserving strings and comments."""
    # If line is a comment, skip entirely
    stripped = line.lstrip()
    if stripped.startswith("--"):
        return line

    # Tokenize the line to protect string literals
    result = []
    pos = 0
    in_single_quote = False
    in_double_quote = False

    # Split into segments: string literals vs code
    segments = []
    current_start = 0

    i = 0
    while i < len(line):
        ch = line[i]

        if not in_single_quote and not in_double_quote:
            if ch == "'":
                # Start of single-quoted string
                segments.append(("code", line[current_start:i]))
                in_single_quote = True
                current_start = i
            elif ch == '"':
                # Start of double-quoted string (identifier)
                segments.append(("code", line[current_start:i]))
                in_double_quote = True
                current_start = i
            elif ch == "-" and i + 1 < len(line) and line[i + 1] == "-":
                # Line comment — rest of line is comment
                segments.append(("code", line[current_start:i]))
                segments.append(("comment", line[i:]))
                current_start = len(line)
                break
        elif in_single_quote:
            if ch == "'" and (i + 1 >= len(line) or line[i + 1] != "'"):
                segments.append(("string", line[current_start : i + 1]))
                in_single_quote = False
                current_start = i + 1
            elif ch == "'" and i + 1 < len(line) and line[i + 1] == "'":
                i += 1  # Skip escaped quote
        elif in_double_quote:
            if ch == '"':
                segments.append(("string", line[current_start : i + 1]))
                in_double_quote = False
                current_start = i + 1

        i += 1

    # Remaining text
    if current_start < len(line):
        seg_type = "string" if (in_single_quote or in_double_quote) else "code"
        segments.append((seg_type, line[current_start:]))

    # Only uppercase keywords in code segments
    output = []
    for seg_type, text in segments:
        if seg_type == "code":
            text = KEYWORD_PATTERN.sub(lambda m: m.group(0).upper(), text)
        output.append(text)

    return "".join(output)


def process_file(filepath):
    """Uppercase SQL keywords in a file. Returns (new_content, count)."""
    with open(filepath, encoding="utf-8", errors="replace") as f:
        original = f.read()

    lines = original.splitlines(keepends=True)
    new_lines = []
    changes = 0
    in_block_comment = False

    for line in lines:
        # Handle block comments
        if in_block_comment:
            end_pos = line.find("*/")
            if end_pos >= 0:
                in_block_comment = False
                # Everything after */ is code
                comment_part = line[: end_pos + 2]
                code_part = line[end_pos + 2 :]
                new_line = comment_part + uppercase_keywords_in_line(code_part)
            else:
                new_line = line
        else:
            # Check for block comment start
            start_pos = line.find("/*")
            if start_pos >= 0:
                end_pos = line.find("*/", start_pos + 2)
                if end_pos >= 0:
                    # Block comment starts and ends on same line
                    before = line[:start_pos]
                    comment = line[start_pos : end_pos + 2]
                    after = line[end_pos + 2 :]
                    new_line = (
                        uppercase_keywords_in_line(before)
                        + comment
                        + uppercase_keywords_in_line(after)
                    )
                else:
                    # Block comment starts, doesn't end
                    before = line[:start_pos]
                    comment = line[start_pos:]
                    new_line = uppercase_keywords_in_line(before) + comment
                    in_block_comment = True
            else:
                new_line = uppercase_keywords_in_line(line)

        if new_line != line:
            changes += 1
        new_lines.append(new_line)

    return "".join(new_lines), changes


def main():
    dry_run = "--dry-run" in sys.argv
    args = [a for a in sys.argv[1:] if a != "--dry-run"]

    if not args:
        print("Usage: fix_sql_keywords.py [--dry-run] <path>", file=sys.stderr)
        sys.exit(1)

    target = args[0]
    files = [target] if os.path.isfile(target) else find_sql_files(target)

    total_changes = 0
    files_modified = 0

    for fp in files:
        new_content, changes = process_file(fp)
        if changes > 0:
            rel = os.path.relpath(fp)
            if dry_run:
                print(f"  {rel}: {changes} line(s) would be modified")
            else:
                with open(fp, "w", encoding="utf-8") as f:
                    f.write(new_content)
                print(f"  {rel}: {changes} line(s) modified")
            total_changes += changes
            files_modified += 1

    if total_changes == 0:
        print("  All SQL keywords already uppercase")
    else:
        action = "would be modified" if dry_run else "modified"
        print(f"\n  {files_modified} file(s) {action}, {total_changes} line(s) with keyword changes")


if __name__ == "__main__":
    main()
