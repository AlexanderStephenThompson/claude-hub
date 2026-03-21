---
name: data-python
description: Python patterns for data processing - pandas, polars, pyspark
user-invocable: false
---

# Data Python Skill

**Version:** 1.0
**Stack:** Python (pandas, polars, pyspark)

Python makes it easy to write data processing code that works on sample data and fails on real data. `iterrows()` takes 30 seconds on 10K rows and 30 minutes on 10M. A DataFrame without explicit dtypes uses 8x the memory it needs. Chained indexing creates silent copies that lose your changes. These aren't edge cases — they're the default behavior of pandas when you write it like regular Python.

Vectorized operations, explicit schemas, and proper dtypes mean your code scales from prototype to production without rewriting.

---

## Scope and Boundaries

**This skill covers:**
- DataFrame patterns (pandas, polars, pyspark)
- Data type handling and validation
- Memory-efficient processing
- Vectorized operations over loops
- Method chaining patterns
- Error handling for data pipelines

**Defers to other skills:**
- `code-quality`: General code structure, testing, naming
- `data-sql`: Query patterns when using SQL interfaces
- `data-pipelines`: Orchestration and ETL architecture

**Use this skill when:** Writing Python code that processes data.

---

## Core Principles

1. **Vectorize, Don't Loop** — Use DataFrame operations, not row iteration.
2. **Fail Fast on Bad Data** — Validate early, reject invalid data at boundaries.
3. **Memory Awareness** — Know your data size, use appropriate dtypes.
4. **Immutable Transforms** — Chain operations, don't mutate in place.
5. **Explicit Schemas** — Define expected columns and types upfront.

---

## Patterns

### Method Chaining

```python
# Good - readable pipeline
result = (
    df
    .query("status == 'active'")
    .assign(total=lambda x: x["quantity"] * x["price"])
    .groupby("category")
    .agg({"total": "sum"})
    .sort_values("total", ascending=False)
)

# Bad - intermediate variables obscure flow
filtered = df[df["status"] == "active"]
filtered["total"] = filtered["quantity"] * filtered["price"]
grouped = filtered.groupby("category")
result = grouped.agg({"total": "sum"})
result = result.sort_values("total", ascending=False)
```

### Schema Validation

```python
EXPECTED_COLUMNS = {"id", "name", "value", "timestamp"}
REQUIRED_COLUMNS = {"id", "value"}

def validate_schema(df: pd.DataFrame) -> pd.DataFrame:
    missing = REQUIRED_COLUMNS - set(df.columns)
    if missing:
        raise ValueError(f"Missing required columns: {missing}")
    return df[list(EXPECTED_COLUMNS & set(df.columns))]
```

### Type Optimization

```python
def optimize_dtypes(df: pd.DataFrame) -> pd.DataFrame:
    """Downcast numeric types to reduce memory."""
    for col in df.select_dtypes(include=["int"]).columns:
        df[col] = pd.to_numeric(df[col], downcast="integer")
    for col in df.select_dtypes(include=["float"]).columns:
        df[col] = pd.to_numeric(df[col], downcast="float")
    return df
```

---

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|--------------|---------|-----|
| `for row in df.iterrows()` | Slow, defeats vectorization | Use vectorized operations |
| `df["col"] = df.apply(...)` | Usually slower than vectorized | Use `np.where` or `df.assign` |
| Chained indexing `df["a"]["b"]` | SettingWithCopyWarning | Use `df.loc[:, "a"]` |
| Loading entire file to check schema | Wastes memory | Use `nrows=100` or chunking |
| Ignoring dtypes on read | Memory bloat | Specify `dtype=` parameter |

---

## Checklist

- [ ] No `iterrows()` or `itertuples()` for computation
- [ ] Explicit dtypes on file reads
- [ ] Schema validation at boundaries
- [ ] Method chaining for transforms
- [ ] Memory profiled for large datasets

---

## References

- `references/vectorization.md` — Vectorized operations and performance
- `references/memory-optimization.md` — Memory optimization techniques

## Assets

- `assets/pandas-cheatsheet.md` — Quick reference for pandas operations
