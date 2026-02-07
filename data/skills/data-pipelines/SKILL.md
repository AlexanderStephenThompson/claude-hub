---
name: data-pipelines
description: ETL patterns, orchestration, and data pipeline architecture
user-invocable: false
---

# Data Pipelines Skill

**Version:** 1.0
**Stack:** Airflow, Step Functions, dbt, general ETL

Pipelines fail silently. A non-idempotent task appends duplicate rows every time it retries. A task without validation passes bad data downstream, and you discover it three stages later when a dashboard shows impossible numbers. A pipeline without parameterized dates can't be backfilled, which means when something goes wrong on Tuesday, you manually reprocess every day since the last known good state.

Idempotent tasks, quality checks between stages, and parameterized execution mean failures are recoverable and errors are caught where they happen, not downstream.

---

## Scope and Boundaries

**This skill covers:**
- ETL/ELT architecture decisions
- Orchestration patterns (DAGs, dependencies)
- Idempotency and retry strategies
- Data quality checks
- Incremental vs. full refresh
- Backfill patterns

**Defers to other skills:**
- `data-python`: Python code within tasks
- `data-sql`: Query patterns within transforms
- `data-aws`: AWS-specific service patterns

**Use this skill when:** Designing or building data pipelines.

---

## Core Principles

1. **Idempotent Tasks** — Running twice produces the same result.
2. **Atomic Operations** — All-or-nothing; no partial writes.
3. **Data Contracts** — Define schema expectations between stages.
4. **Observable Pipelines** — Log, metric, alert at every stage.
5. **Incremental When Possible** — Process only changed data.

---

## Patterns

### Idempotent Writes

```python
# Bad - appends duplicate data on retry
def load_data(df, table):
    df.to_sql(table, engine, if_exists="append")

# Good - replace partition, safe to retry
def load_data(df, table, partition_date):
    with engine.begin() as conn:
        conn.execute(f"DELETE FROM {table} WHERE date = '{partition_date}'")
        df.to_sql(table, conn, if_exists="append", index=False)
```

### Stage Pattern

```
raw/           # Exact copy of source, immutable
├── source_a/
└── source_b/

staged/        # Cleaned, typed, validated
├── source_a/
└── source_b/

curated/       # Business logic applied, joined
├── dim_users/
├── dim_products/
└── fact_orders/

aggregated/    # Pre-computed metrics
├── daily_revenue/
└── user_cohorts/
```

### Data Quality Checks

```python
def validate_output(df: pd.DataFrame) -> None:
    """Run after transform, before load."""
    assert not df.empty, "Output is empty"
    assert df["id"].is_unique, "Duplicate IDs found"
    assert df["amount"].notna().all(), "NULL amounts found"
    assert (df["amount"] >= 0).all(), "Negative amounts found"
```

---

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|--------------|---------|-----|
| Non-idempotent tasks | Duplicates on retry | DELETE then INSERT, or use upserts |
| Monolithic DAGs | Hard to debug, long recovery | Break into smaller, focused DAGs |
| No data validation | Bad data propagates silently | Add checks between stages |
| Hardcoded dates | Can't backfill | Parameterize execution date |
| Silent failures | Issues discovered too late | Alert on anomalies, not just errors |

---

## Checklist

- [ ] All tasks are idempotent
- [ ] Data quality checks between stages
- [ ] Execution date is parameterized
- [ ] Backfill tested and documented
- [ ] Alerting on failures AND anomalies
- [ ] Clear data lineage documented

---

## References

- `references/idempotency.md` — Idempotent write patterns and testing

## Assets

- `assets/pipeline-checklist.md` — Comprehensive pipeline design checklist
