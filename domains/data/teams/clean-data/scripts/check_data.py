#!/usr/bin/env python3

"""
Data Project Checker

Deterministic enforcement of data engineering standards: SQL quality,
Python data patterns, pipeline hygiene, and infrastructure as code.
Works alongside AI skill enforcement (probabilistic) for double coverage.

Each rule maps to a skill via RULE_SKILLS. When adding/removing rules,
update BOTH the registry here AND the skill's "## Enforced Rules" section.

SQL rules (7):
  no-select-star       (error)  SELECT * in production code
  cte-for-complex      (warn)   3+ JOINs without CTEs
  no-function-on-index (warn)   Functions wrapping columns in WHERE clauses
  prefer-window-function (warn) Correlated subqueries replaceable by window functions
  no-implicit-join     (warn)   Comma-separated FROM with WHERE join
  upsert-pattern       (warn)   INSERT without ON CONFLICT / MERGE
  explicit-column-types (warn)  CREATE TABLE columns without explicit types

Python rules (10):
  no-iterrows          (error)  .iterrows() / .itertuples() for computation
  no-chained-indexing  (warn)   df["a"]["b"] pattern
  explicit-dtypes      (warn)   pd.read_*() without dtype parameter
  schema-validation    (warn)   Pandas files without schema checks
  boto3-outside-handler (warn)  boto3.client() inside Lambda handler
  no-hardcoded-dates   (warn)   Date string literals not in constants
  no-print-logging     (error)  print() in production code
  idempotent-writes    (warn)   append mode without preceding DELETE
  no-bare-except       (error)  except: or except Exception: without re-raise
  no-secrets           (error)  Passwords, API keys, tokens in string literals

Pipeline/IaC rules (6):
  remote-state         (error)  Terraform local backend
  required-tags        (warn)   AWS resources missing required tags
  no-hardcoded-values  (warn)   Hardcoded ARNs, account IDs in IaC
  s3-hive-partitions   (warn)   S3 paths without key=value/ format
  parquet-format       (warn)   Non-Parquet writes after raw layer
  config-separation    (warn)   Connection strings in non-config files

Structure rules (3):
  data-layer-structure (error)  Missing data layer directories
  dag-naming           (warn)   DAG files not following naming convention
  test-presence        (warn)   Source files without test files

Inline suppression:
  Python/Terraform:  # check-disable / check-enable / check-disable-next-line
  SQL:               -- check-disable / check-enable / check-disable-next-line

Usage:
  python check_data.py                 Check all files in current directory
  python check_data.py --quiet         Errors only (no warnings)
  python check_data.py --root <dir>    Set project root
  python check_data.py file.py         Check specific file(s)
  python check_data.py --validate-registry  Verify rule -> skill links

Exit: 0 = clean, 1 = errors found (warnings alone don't fail)
"""

import argparse
import os
import re
import sys

# ── Constants ────────────────────────────────────────────────────────────────

ERROR = "error"
WARN = "warn"

IGNORE_DIRS = {
    "node_modules", ".git", "~Transfer", "dist", "build",
    "__pycache__", ".venv", "venv", ".tox", ".mypy_cache",
    ".pytest_cache", ".eggs", "*.egg-info",
}

TEST_FILE_PATTERNS = {"test_", "_test.py", "conftest.py"}

# ── Rule -> Skill mapping ────────────────────────────────────────────────────

RULE_SKILLS = {
    # SQL (7) --data-sql
    "no-select-star":        "data-sql",
    "cte-for-complex":       "data-sql",
    "no-function-on-index":  "data-sql",
    "prefer-window-function":"data-sql",
    "no-implicit-join":      "data-sql",
    "upsert-pattern":        "data-sql",
    "explicit-column-types": "data-sql",

    # Python (10) --data-python, data-aws, data-pipelines, code-quality
    "no-iterrows":           "data-python",
    "no-chained-indexing":   "data-python",
    "explicit-dtypes":       "data-python",
    "schema-validation":     "data-python",
    "boto3-outside-handler": "data-aws",
    "no-hardcoded-dates":    "data-pipelines",
    "no-print-logging":      "code-quality",
    "idempotent-writes":     "data-pipelines",
    "no-bare-except":        "code-quality",
    "no-secrets":            "security",

    # Pipeline/IaC (6) --data-iac, data-aws, architecture
    "remote-state":          "data-iac",
    "required-tags":         "data-iac",
    "no-hardcoded-values":   "data-iac",
    "s3-hive-partitions":    "data-aws",
    "parquet-format":        "data-aws",
    "config-separation":     "architecture",

    # Structure (3) --data-pipelines, code-quality
    "data-layer-structure":  "data-pipelines",
    "dag-naming":            "data-pipelines",
    "test-presence":         "code-quality",
}

# ── ANSI helpers ─────────────────────────────────────────────────────────────

def _supports_color():
    return hasattr(sys.stdout, "isatty") and sys.stdout.isatty()

_COLOR = _supports_color()

def _red(s):    return f"\033[31m{s}\033[0m" if _COLOR else s
def _yellow(s): return f"\033[33m{s}\033[0m" if _COLOR else s
def _green(s):  return f"\033[32m{s}\033[0m" if _COLOR else s
def _dim(s):    return f"\033[2m{s}\033[0m" if _COLOR else s
def _uline(s):  return f"\033[4m{s}\033[0m" if _COLOR else s


# ── File discovery ───────────────────────────────────────────────────────────

def find_files(root, extensions):
    """Walk root directory, return files matching extensions."""
    results = []
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in IGNORE_DIRS]
        for fname in filenames:
            if any(fname.endswith(ext) for ext in extensions):
                results.append(os.path.join(dirpath, fname))
    return sorted(results)


def is_test_file(filepath):
    """Check if a file is a test file."""
    basename = os.path.basename(filepath)
    return (
        basename.startswith("test_")
        or basename.endswith("_test.py")
        or basename == "conftest.py"
        or "/tests/" in filepath.replace("\\", "/")
        or "\\tests\\" in filepath
    )


# ── Suppression ──────────────────────────────────────────────────────────────

def build_suppression_set(lines, comment_prefix="#"):
    """Return set of line numbers (1-based) that are suppressed."""
    suppressed = set()
    disabled = False
    for i, line in enumerate(lines, 1):
        stripped = line.strip()
        if f"{comment_prefix} check-disable-next-line" in stripped:
            suppressed.add(i + 1)
        elif f"{comment_prefix} check-disable" in stripped:
            disabled = True
        elif f"{comment_prefix} check-enable" in stripped:
            disabled = False
        if disabled:
            suppressed.add(i)
    return suppressed


# ── String/comment stripping ─────────────────────────────────────────────────

def strip_python_strings(line):
    """Replace string contents with empty strings to avoid false positives."""
    line = re.sub(r'""".*?"""', '""""""', line)
    line = re.sub(r"'''.*?'''", "''''''", line)
    line = re.sub(r'"[^"\\]*(?:\\.[^"\\]*)*"', '""', line)
    line = re.sub(r"'[^'\\]*(?:\\.[^'\\]*)*'", "''", line)
    return line


def strip_sql_comments(text):
    """Remove SQL comments (-- and /* */) from text."""
    text = re.sub(r"--.*$", "", text, flags=re.MULTILINE)
    text = re.sub(r"/\*.*?\*/", "", text, flags=re.DOTALL)
    return text


def strip_sql_strings(line):
    """Replace SQL string contents."""
    line = re.sub(r"'[^']*'", "''", line)
    line = re.sub(r'"[^"]*"', '""', line)
    return line


# ── Issue container ──────────────────────────────────────────────────────────

def issue(line, col, severity, message, rule_id):
    """Create an issue tuple."""
    return {
        "line": line,
        "col": col,
        "severity": severity,
        "message": message,
        "rule": rule_id,
        "skill": RULE_SKILLS.get(rule_id, ""),
    }


# ══════════════════════════════════════════════════════════════════════════════
#  SQL CHECKER
# ══════════════════════════════════════════════════════════════════════════════

def check_sql(filepath, content):
    """Check a .sql file for data-sql rule violations."""
    issues = []
    lines = content.splitlines()
    suppressed = build_suppression_set(lines, "--")

    clean_content = strip_sql_comments(content)
    clean_lines = clean_content.splitlines()

    for i, raw_line in enumerate(lines, 1):
        if i in suppressed:
            continue

        clean = strip_sql_strings(clean_lines[i - 1]) if i <= len(clean_lines) else ""
        upper = clean.upper()

        # no-select-star: SELECT * FROM
        if re.search(r"\bSELECT\s+\*\s+FROM\b", upper):
            col = re.search(r"(?i)\bSELECT\s+\*", clean)
            issues.append(issue(
                i, col.start() + 1 if col else 1, ERROR,
                "SELECT * --use explicit column list",
                "no-select-star",
            ))

        # no-function-on-index: WHERE FUNC(col) patterns
        if re.search(r"\bWHERE\b", upper):
            funcs = re.finditer(
                r"\b(YEAR|MONTH|DAY|UPPER|LOWER|CAST|TRIM|COALESCE|DATE|EXTRACT)\s*\(",
                upper,
            )
            for m in funcs:
                issues.append(issue(
                    i, m.start() + 1, WARN,
                    f"Function {m.group(1)} on column in WHERE --may prevent index use",
                    "no-function-on-index",
                ))

        # no-implicit-join: FROM a, b WHERE (handles aliases like FROM users a, orders b)
        if re.search(r"\bFROM\s+\w+(?:\s+\w+)?\s*,\s*\w+", upper):
            if not re.search(r"\bJOIN\b", upper):
                col = re.search(r"(?i)\bFROM\b", clean)
                issues.append(issue(
                    i, col.start() + 1 if col else 1, WARN,
                    "Implicit join (comma-separated FROM) --use explicit JOIN",
                    "no-implicit-join",
                ))

    # Multi-line checks on full content
    upper_content = clean_content.upper()

    # cte-for-complex: 3+ JOINs without WITH
    join_count = len(re.findall(r"\bJOIN\b", upper_content))
    has_cte = bool(re.search(r"\bWITH\b\s+\w+\s+AS\s*\(", upper_content))
    if join_count >= 3 and not has_cte:
        issues.append(issue(
            0, 0, WARN,
            f"Complex query ({join_count} JOINs) without CTEs --use WITH for readability",
            "cte-for-complex",
        ))

    # prefer-window-function: correlated subquery in SELECT
    correlated = re.finditer(
        r"\(\s*SELECT\b[^)]*\bFROM\b[^)]*\bWHERE\b[^)]*\)",
        upper_content,
    )
    for m in correlated:
        line_num = content[:m.start()].count("\n") + 1
        issues.append(issue(
            line_num, 1, WARN,
            "Correlated subquery --consider window function instead",
            "prefer-window-function",
        ))

    # upsert-pattern: INSERT without ON CONFLICT / MERGE
    if re.search(r"\bINSERT\s+INTO\b", upper_content):
        if not re.search(r"\bON\s+CONFLICT\b|\bMERGE\b|\bON\s+DUPLICATE\b", upper_content):
            issues.append(issue(
                0, 0, WARN,
                "INSERT without ON CONFLICT/MERGE --may not be idempotent",
                "upsert-pattern",
            ))

    # explicit-column-types: CREATE TABLE without types
    create_match = re.search(r"\bCREATE\s+TABLE\b[^(]*\(([^)]+)\)", upper_content, re.DOTALL)
    if create_match:
        col_defs = create_match.group(1).strip().split(",")
        for col_def in col_defs:
            col_def = col_def.strip()
            if col_def and not re.search(
                r"\b(INT|INTEGER|BIGINT|SMALLINT|FLOAT|DOUBLE|DECIMAL|NUMERIC|"
                r"VARCHAR|CHAR|TEXT|BOOLEAN|BOOL|DATE|TIME|TIMESTAMP|SERIAL|"
                r"UUID|JSON|JSONB|BYTEA|BLOB|CLOB|REAL|ARRAY|PRIMARY\s+KEY|"
                r"FOREIGN\s+KEY|CONSTRAINT|CHECK|UNIQUE|INDEX)\b",
                col_def.upper(),
            ):
                issues.append(issue(
                    0, 0, WARN,
                    f"Column definition may be missing type: {col_def.strip()[:40]}",
                    "explicit-column-types",
                ))

    return issues


# ══════════════════════════════════════════════════════════════════════════════
#  PYTHON CHECKER
# ══════════════════════════════════════════════════════════════════════════════

SECRET_PATTERNS = [
    (r"""(?:password|passwd|pwd)\s*=\s*['"][^'"]+['"]""", "Hardcoded password"),
    (r"""(?:api_key|apikey|api_secret)\s*=\s*['"][^'"]+['"]""", "Hardcoded API key"),
    (r"""(?:secret|secret_key)\s*=\s*['"][^'"]+['"]""", "Hardcoded secret"),
    (r"""(?:access_key|access_token)\s*=\s*['"][^'"]+['"]""", "Hardcoded access key"),
    (r"""(?:token)\s*=\s*['"][A-Za-z0-9_\-]{20,}['"]""", "Hardcoded token"),
    (r"""sk-live-[A-Za-z0-9]{20,}""", "Stripe live key"),
    (r"""AKIA[A-Z0-9]{16}""", "AWS access key ID"),
]

def check_python(filepath, content):
    """Check a .py file for data-python rule violations."""
    issues = []
    lines = content.splitlines()
    suppressed = build_suppression_set(lines, "#")
    test_file = is_test_file(filepath)
    in_main_block = False
    in_handler = False
    has_pandas_import = False
    has_schema_check = False

    for i, raw_line in enumerate(lines, 1):
        if i in suppressed:
            continue

        stripped = raw_line.strip()
        clean = strip_python_strings(raw_line)

        # Track context
        if re.match(r"""if\s+__name__\s*==\s*['"]__main__['"]\s*:""", stripped):
            in_main_block = True
        elif in_main_block and stripped and not stripped.startswith("#") and not raw_line.startswith((" ", "\t")):
            in_main_block = False

        if re.match(r"def\s+(handler|lambda_handler)\s*\(", stripped):
            in_handler = True
        elif in_handler and re.match(r"def\s+\w+\s*\(", stripped):
            in_handler = False

        if re.search(r"\bimport\s+pandas\b|\bfrom\s+pandas\b", stripped):
            has_pandas_import = True

        if re.search(r"\b(EXPECTED_COLUMNS|REQUIRED_COLUMNS|assert.*columns|validate.*schema|Schema\()", stripped):
            has_schema_check = True

        # no-iterrows: .iterrows() or .itertuples()
        if re.search(r"\.(iterrows|itertuples)\s*\(", clean):
            m = re.search(r"\.(iterrows|itertuples)\s*\(", clean)
            issues.append(issue(
                i, m.start() + 1, ERROR,
                f".{m.group(1)}() --use vectorized operations instead",
                "no-iterrows",
            ))

        # no-chained-indexing: df["a"]["b"]
        if re.search(r'\]\s*\[', clean) and re.search(r'\w+\s*\[', clean):
            if not re.search(r'(def |class |import |from |#)', stripped):
                m = re.search(r'\]\s*\[', clean)
                issues.append(issue(
                    i, m.start() + 1, WARN,
                    "Chained indexing df[a][b] --use .loc/.iloc instead",
                    "no-chained-indexing",
                ))

        # explicit-dtypes: pd.read_*() without dtype
        pd_read = re.search(r"\bpd\.read_(\w+)\s*\(", clean)
        if pd_read and pd_read.group(1) in ("csv", "json", "excel", "fwf", "table"):
            # Look ahead for dtype in the same call (may span lines)
            call_text = raw_line
            if i < len(lines):
                for lookahead in range(1, min(6, len(lines) - i + 1)):
                    call_text += lines[i - 1 + lookahead]
                    if ")" in lines[i - 1 + lookahead]:
                        break
            if "dtype" not in call_text:
                issues.append(issue(
                    i, pd_read.start() + 1, WARN,
                    f"pd.read_{pd_read.group(1)}() without dtype --specify dtypes explicitly",
                    "explicit-dtypes",
                ))

        # boto3-outside-handler: boto3 init inside handler
        if in_handler and re.search(r"\bboto3\.(client|resource)\s*\(", clean):
            m = re.search(r"\bboto3\.", clean)
            issues.append(issue(
                i, m.start() + 1, WARN,
                "boto3 client/resource inside handler --initialize outside for reuse",
                "boto3-outside-handler",
            ))

        # no-hardcoded-dates: date literals not in UPPER_SNAKE constants
        # Match on raw_line — the date is inside a string literal
        date_match = re.search(r"""['"]20\d{2}-\d{2}-\d{2}['"]""", raw_line)
        if date_match:
            # Check if it's a constant assignment (UPPER_SNAKE_CASE =)
            if not re.match(r"\s*[A-Z][A-Z0-9_]*\s*=", raw_line):
                issues.append(issue(
                    i, date_match.start() + 1, WARN,
                    "Hardcoded date --use parameterized execution date",
                    "no-hardcoded-dates",
                ))

        # no-print-logging: print() in production code
        if not test_file and not in_main_block:
            if re.search(r"\bprint\s*\(", clean):
                m = re.search(r"\bprint\s*\(", clean)
                issues.append(issue(
                    i, m.start() + 1, ERROR,
                    "print() --use logging module instead",
                    "no-print-logging",
                ))

        # idempotent-writes: if_exists="append" without DELETE
        # Match on raw_line — the value is inside a string literal
        if re.search(r"""if_exists\s*=\s*['"]append['"]""", raw_line):
            issues.append(issue(
                i, 1, WARN,
                'if_exists="append" --ensure preceding DELETE for idempotency',
                "idempotent-writes",
            ))

        # no-bare-except
        if re.match(r"\s*except\s*:", stripped):
            issues.append(issue(
                i, stripped.index("except") + 1, ERROR,
                "Bare except: --catch specific exception types",
                "no-bare-except",
            ))
        elif re.match(r"\s*except\s+Exception(\s+as\s+\w+)?\s*:", stripped):
            # Check if there's a re-raise in the except block body
            has_raise = False
            except_indent = len(raw_line) - len(raw_line.lstrip())
            for j in range(i, min(i + 10, len(lines))):  # i is 1-based, lines is 0-based
                next_line = lines[j]  # j=i means the line AFTER except (0-based offset)
                next_stripped = next_line.strip()
                if not next_stripped or next_stripped.startswith("#"):
                    continue
                next_indent = len(next_line) - len(next_line.lstrip())
                if next_indent <= except_indent and next_stripped:
                    break  # Dedented past the except block
                if re.search(r"\braise\b", next_stripped):
                    has_raise = True
                    break
            if not has_raise:
                issues.append(issue(
                    i, stripped.index("except") + 1, ERROR,
                    "except Exception: without re-raise --catch specific types or re-raise",
                    "no-bare-except",
                ))

        # no-secrets: hardcoded credentials
        for pattern, desc in SECRET_PATTERNS:
            m = re.search(pattern, raw_line, re.IGNORECASE)
            if m:
                issues.append(issue(
                    i, m.start() + 1, ERROR,
                    f"{desc} --use environment variables or secrets manager",
                    "no-secrets",
                ))
                break

    # File-level: schema-validation
    if has_pandas_import and not has_schema_check and not test_file:
        issues.append(issue(
            0, 0, WARN,
            "Pandas imported but no schema validation found --add column/type checks",
            "schema-validation",
        ))

    return issues


# ══════════════════════════════════════════════════════════════════════════════
#  TERRAFORM CHECKER
# ══════════════════════════════════════════════════════════════════════════════

REQUIRED_TAGS = {"Environment", "Project", "Owner"}

def check_terraform(filepath, content):
    """Check a .tf file for data-iac rule violations."""
    issues = []
    lines = content.splitlines()
    suppressed = build_suppression_set(lines, "#")

    clean = strip_python_strings(content)  # HCL uses similar quoting

    for i, raw_line in enumerate(lines, 1):
        if i in suppressed:
            continue

        stripped = raw_line.strip()
        line_clean = strip_python_strings(raw_line)

        # no-hardcoded-values: ARNs (match raw_line — ARN is inside string literal)
        if re.search(r"arn:aws:", raw_line):
            if not re.match(r"\s*(#|//|variable|data\s)", stripped):
                m = re.search(r"arn:aws:", raw_line)
                issues.append(issue(
                    i, m.start() + 1, WARN,
                    "Hardcoded ARN --use variable or data source",
                    "no-hardcoded-values",
                ))

        # no-hardcoded-values: 12-digit account IDs (match raw_line)
        acct = re.search(r'"\d{12}"', raw_line)
        if acct:
            issues.append(issue(
                i, acct.start() + 1, WARN,
                "Hardcoded AWS account ID --use variable",
                "no-hardcoded-values",
            ))

        # no-secrets in terraform
        for pattern, desc in SECRET_PATTERNS:
            m = re.search(pattern, raw_line, re.IGNORECASE)
            if m:
                issues.append(issue(
                    i, m.start() + 1, ERROR,
                    f"{desc} --use environment variables or secrets manager",
                    "no-secrets",
                ))
                break

    # File-level: remote-state (use raw content — "local" is inside a string)
    if "terraform" in content and "backend" in content:
        if re.search(r'backend\s+"local"', content):
            issues.append(issue(
                0, 0, ERROR,
                'Terraform backend "local" --use remote state (S3, GCS, etc.)',
                "remote-state",
            ))
    elif "terraform" in content and "backend" not in content:
        if re.search(r"terraform\s*\{", content):
            issues.append(issue(
                0, 0, ERROR,
                "Terraform block without backend --configure remote state",
                "remote-state",
            ))

    # File-level: required-tags (use raw content for resource block detection)
    resource_blocks = re.finditer(r'resource\s+"aws_\w+"\s+"(\w+)"', content)
    for rb in resource_blocks:
        # Find the resource block content
        start = rb.end()
        brace_depth = 0
        block_text = ""
        for ch in content[start:]:
            if ch == "{":
                brace_depth += 1
            elif ch == "}":
                brace_depth -= 1
                if brace_depth == 0:
                    break
            block_text += ch

        if "tags" not in block_text.lower():
            line_num = content[:rb.start()].count("\n") + 1
            issues.append(issue(
                line_num, 1, WARN,
                f'Resource "{rb.group(1)}" missing tags --add {", ".join(sorted(REQUIRED_TAGS))}',
                "required-tags",
            ))

    return issues


# ══════════════════════════════════════════════════════════════════════════════
#  GENERAL FILE CHECKS (Python and SQL for cross-cutting concerns)
# ══════════════════════════════════════════════════════════════════════════════

def check_s3_patterns(filepath, content):
    """Check for S3 path patterns in any file."""
    issues = []
    lines = content.splitlines()

    for i, raw_line in enumerate(lines, 1):
        # Most patterns here match content INSIDE strings, so use raw_line
        # (strip_python_strings would remove the content we need to check)

        # s3-hive-partitions: S3 paths without key=value
        s3_match = re.search(r"s3://[\w\-]+/[\w\-/]+", raw_line)
        if s3_match:
            path_part = s3_match.group(0).split("//")[1].split("/", 1)
            if len(path_part) > 1:
                path_segments = path_part[1].split("/")
                # Check if at least some segments have key=value format
                has_partition = any("=" in seg for seg in path_segments if seg)
                if not has_partition and len(path_segments) > 2:
                    issues.append(issue(
                        i, s3_match.start() + 1, WARN,
                        "S3 path without Hive-style partitions (key=value/) --add partition scheme",
                        "s3-hive-partitions",
                    ))

        # config-separation: connection strings in non-config files
        norm_path = filepath.replace("\\", "/")
        if not any(p in norm_path for p in ("/config/", "/settings/", "/conf/", "config/")):
            conn_patterns = [
                (r"postgresql://", "PostgreSQL"),
                (r"mysql://", "MySQL"),
                (r"mongodb://", "MongoDB"),
                (r"redshift://", "Redshift"),
                (r"jdbc:", "JDBC"),
            ]
            for pattern, db_name in conn_patterns:
                if re.search(pattern, raw_line, re.IGNORECASE):
                    issues.append(issue(
                        i, 1, WARN,
                        f"{db_name} connection string outside config --move to config/",
                        "config-separation",
                    ))
                    break

        # parquet-format: non-Parquet writes in staged/curated
        rel_path = filepath.replace("\\", "/")
        if any(layer in rel_path for layer in ("/staged/", "/curated/", "/aggregated/", "staged/", "curated/", "aggregated/")):
            if re.search(r"""(?:format\s*=\s*['"](?:csv|json)['"]|\.to_csv\s*\(|\.to_json\s*\()""", raw_line):
                issues.append(issue(
                    i, 1, WARN,
                    "Non-Parquet format in staged/curated layer --use Parquet for performance",
                    "parquet-format",
                ))

    return issues


# ══════════════════════════════════════════════════════════════════════════════
#  STRUCTURE CHECKER (project-level)
# ══════════════════════════════════════════════════════════════════════════════

def check_structure(root, py_files, sql_files):
    """Check project-level structure rules."""
    issues = []
    all_source = py_files + sql_files

    # data-layer-structure: need raw/staged/curated if 5+ source files
    if len(all_source) >= 5:
        has_layers = False
        layer_names = {"raw", "staged", "curated", "bronze", "silver", "gold"}

        # Check directory names
        for dirpath, dirnames, _ in os.walk(root):
            dirnames[:] = [d for d in dirnames if d not in IGNORE_DIRS]
            for d in dirnames:
                if d.lower() in layer_names:
                    has_layers = True
                    break
            if has_layers:
                break

        # Check S3 path references if no directories found
        if not has_layers:
            for fp in all_source[:20]:  # Sample first 20 files
                try:
                    content = open(fp, encoding="utf-8", errors="replace").read()
                    if any(f"/{layer}/" in content for layer in layer_names):
                        has_layers = True
                        break
                except OSError:
                    pass

        if not has_layers:
            issues.append({
                "file": root,
                "issues": [issue(
                    0, 0, ERROR,
                    "No data layer structure (raw/staged/curated) --organize data by processing stage",
                    "data-layer-structure",
                )],
            })

    # dag-naming: check dags/ directory if it exists
    dags_dir = os.path.join(root, "dags")
    if os.path.isdir(dags_dir):
        for fname in os.listdir(dags_dir):
            if fname.endswith(".py") and not fname.startswith("_"):
                if not re.match(r"^[a-z][a-z0-9_]*\.py$", fname):
                    issues.append({
                        "file": os.path.join(dags_dir, fname),
                        "issues": [issue(
                            0, 0, WARN,
                            f"DAG file '{fname}' --use snake_case naming",
                            "dag-naming",
                        )],
                    })

    # test-presence: source files without tests
    source_basenames = set()
    test_basenames = set()
    for fp in py_files:
        basename = os.path.basename(fp)
        if is_test_file(fp):
            # Extract the module being tested
            name = basename.replace("test_", "").replace("_test.py", ".py")
            test_basenames.add(name)
        elif not basename.startswith("_"):
            source_basenames.add(basename)

    untested = source_basenames - test_basenames
    if untested and source_basenames:
        coverage = 1 - len(untested) / len(source_basenames)
        if coverage < 0.5:  # Only warn if less than 50% coverage
            issues.append({
                "file": root,
                "issues": [issue(
                    0, 0, WARN,
                    f"Test coverage gap: {len(untested)}/{len(source_basenames)} source files have no test",
                    "test-presence",
                )],
            })

    return issues


# ══════════════════════════════════════════════════════════════════════════════
#  REPORT
# ══════════════════════════════════════════════════════════════════════════════

def report(all_results, root, quiet):
    """Print results and return exit code."""
    errors = 0
    warnings = 0

    for entry in all_results:
        file_path = entry["file"]
        file_issues = entry["issues"]
        filtered = [i for i in file_issues if i["severity"] == ERROR] if quiet else file_issues
        if not filtered:
            continue

        rel = os.path.relpath(file_path, root).replace("\\", "/")
        print(f"\n  {_uline(rel)}")

        for iss in filtered:
            loc = f"{iss['line']}:{iss['col']}".ljust(8) if iss["line"] > 0 else "".ljust(8)
            loc = _dim(loc)
            sev = _red(iss["severity"].ljust(6)) if iss["severity"] == ERROR else _yellow(iss["severity"].ljust(6))
            rule = _dim(iss["rule"])
            skill = _dim(f"[{iss['skill']}]") if iss["skill"] else ""
            print(f"    {loc} {sev} {iss['message']}  {rule}  {skill}")

            if iss["severity"] == ERROR:
                errors += 1
            else:
                warnings += 1

    if errors + warnings == 0:
        print(f"\n  {_green('OK')} No issues found\n")
        return 0

    icon = _red("X") if errors > 0 else _yellow("!")
    print(f"\n  {icon} {errors + warnings} problems ({errors} errors, {warnings} warnings)\n")
    return 1 if errors > 0 else 0


# ══════════════════════════════════════════════════════════════════════════════
#  VALIDATE REGISTRY
# ══════════════════════════════════════════════════════════════════════════════

def validate_registry():
    """Verify all rules in RULE_SKILLS are actually checked."""
    print("Validating rule -> skill registry...")
    registered = set(RULE_SKILLS.keys())
    print(f"  {len(registered)} rules registered")

    # Check for skills that don't exist (basic validation)
    known_skills = {
        "data-sql", "data-python", "data-aws", "data-pipelines",
        "data-iac", "code-quality", "security", "architecture",
    }
    for rule, skill in RULE_SKILLS.items():
        if skill and skill not in known_skills:
            print(f"  ! Rule '{rule}' maps to unknown skill '{skill}'")

    print(f"  OK Registry valid ({len(registered)} rules, {len(known_skills)} skills)\n")
    return 0


# ══════════════════════════════════════════════════════════════════════════════
#  MAIN
# ══════════════════════════════════════════════════════════════════════════════

def main():
    parser = argparse.ArgumentParser(
        description="Data project checker --deterministic rule enforcement",
    )
    parser.add_argument("files", nargs="*", help="Specific files to check")
    parser.add_argument("--root", default=os.getcwd(), help="Project root directory")
    parser.add_argument("--quiet", action="store_true", help="Show errors only")
    parser.add_argument(
        "--validate-registry", action="store_true",
        help="Verify rule -> skill links",
    )
    args = parser.parse_args()

    if args.validate_registry:
        sys.exit(validate_registry())

    root = os.path.abspath(args.root)
    results = []

    if args.files:
        # Check specific files
        for fp in args.files:
            fp = os.path.abspath(fp)
            try:
                content = open(fp, encoding="utf-8", errors="replace").read()
            except OSError as e:
                print(f"Error reading {fp}: {e}", file=sys.stderr)
                continue

            file_issues = []
            if fp.endswith(".sql"):
                file_issues.extend(check_sql(fp, content))
            elif fp.endswith(".py"):
                file_issues.extend(check_python(fp, content))
            elif fp.endswith(".tf"):
                file_issues.extend(check_terraform(fp, content))

            file_issues.extend(check_s3_patterns(fp, content))

            if file_issues:
                results.append({"file": fp, "issues": file_issues})
    else:
        # Check all files under root
        py_files = find_files(root, [".py"])
        sql_files = find_files(root, [".sql"])
        tf_files = find_files(root, [".tf"])

        for fp in sql_files:
            try:
                content = open(fp, encoding="utf-8", errors="replace").read()
                file_issues = check_sql(fp, content)
                file_issues.extend(check_s3_patterns(fp, content))
                if file_issues:
                    results.append({"file": fp, "issues": file_issues})
            except OSError:
                pass

        for fp in py_files:
            try:
                content = open(fp, encoding="utf-8", errors="replace").read()
                file_issues = check_python(fp, content)
                file_issues.extend(check_s3_patterns(fp, content))
                if file_issues:
                    results.append({"file": fp, "issues": file_issues})
            except OSError:
                pass

        for fp in tf_files:
            try:
                content = open(fp, encoding="utf-8", errors="replace").read()
                file_issues = check_terraform(fp, content)
                file_issues.extend(check_s3_patterns(fp, content))
                if file_issues:
                    results.append({"file": fp, "issues": file_issues})
            except OSError:
                pass

        # Structure checks (project-level)
        structure_results = check_structure(root, py_files, sql_files)
        results.extend(structure_results)

    exit_code = report(results, root, args.quiet)
    sys.exit(exit_code)


if __name__ == "__main__":
    main()
