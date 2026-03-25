# clean-data

A 4-agent pipeline for cleaning data/ETL projects.

```
data-restructure -> sql-improver -> python-improver -> pipeline-improver
```

## Usage

```
/clean-data:clean              Clean entire project
/clean-data:clean etl/         Scoped to a directory
```

## Pipeline

| Step | Agent | What It Does |
|------|-------|-------------|
| 1 | **data-restructure** | Organizes into layer structure (raw/staged/curated), framework-aware (Airflow/dbt/custom), config separation |
| 2 | **sql-improver** | SELECT * elimination, CTE refactoring, join optimization, idempotent writes, formatting |
| 3 | **python-improver** | Vectorization (no iterrows), schema validation, explicit dtypes, AWS patterns, error handling |
| 4 | **pipeline-improver** | Idempotency, data quality gates, parameterization, Terraform patterns, S3 partitions |

## Deterministic Enforcement

**check_data.py** -- 26 rules across 4 categories:

| Category | Rules | Examples |
|----------|-------|---------|
| SQL (7) | no-select-star, cte-for-complex, no-implicit-join, upsert-pattern, ... | SELECT *, implicit joins, missing CTEs |
| Python (10) | no-iterrows, explicit-dtypes, no-bare-except, no-print-logging, ... | iterrows, missing dtypes, bare excepts |
| Pipeline/IaC (6) | remote-state, required-tags, no-hardcoded-values, s3-hive-partitions, ... | local TF state, missing tags, flat S3 paths |
| Structure (3) | data-layer-structure, dag-naming, test-presence | missing layers, naming, test coverage |

**Pre-fix scripts** (run before agents):
- `strip_print.py` -- removes print() from production code
- `fix_sql_keywords.py` -- uppercases SQL keywords

## Architecture

Same as clean-web: deterministic scan -> mechanical pre-fixes -> sequential specialist agents -> verification gate per agent -> post-pipeline verification.

Agents receive check_data.py findings as their primary issue list (Phase 1b), do supplementary scanning for judgment calls (Phase 1c), and re-run check_data.py before reporting to verify their work.
