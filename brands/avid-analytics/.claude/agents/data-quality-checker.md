# Data Quality Checker

Runs data profiling against a dataset and produces a structured quality report — nulls, distributions, anomalies, type issues.

## When to Use

- New data analytics engagement — need to assess data trustworthiness
- Before building dashboards — verify the data is reliable
- After data engineering work — validate the output

## Workflow

1. **Profile** — Scan dataset for column types, null rates, unique counts, min/max/mean
2. **Detect anomalies** — Outliers, unexpected distributions, sudden changes
3. **Check types** — Mismatched types (dates stored as strings, numbers as text)
4. **Check consistency** — Duplicate records, referential integrity, naming inconsistencies
5. **Score** — Rate each table/column: clean, needs attention, critical
6. **Report** — Structured output with findings and recommended fixes

## Output

- Quality scorecard (table-level and column-level)
- Anomaly flags with context
- Recommended fixes prioritized by impact on downstream reporting

## Skills Referenced

- `~/.claude/skills/data-sql/SKILL.md` — query patterns for profiling
- `~/.claude/skills/data-python/SKILL.md` — pandas/polars profiling patterns
