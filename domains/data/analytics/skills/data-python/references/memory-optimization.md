# Memory Optimization Reference

## Core Principle

Pandas DataFrames can use 5-10x more memory than necessary with default dtypes. Optimize on read, not after.

---

## Memory Diagnosis

```python
# Check memory usage
df.info(memory_usage='deep')

# Per-column breakdown
df.memory_usage(deep=True)

# Total in MB
df.memory_usage(deep=True).sum() / 1024**2
```

---

## Dtype Optimization

### Numeric Downcasting

| Original | Optimized | Savings |
|----------|-----------|---------|
| int64 | int8 | 87.5% |
| int64 | int16 | 75% |
| int64 | int32 | 50% |
| float64 | float32 | 50% |

```python
def optimize_dtypes(df):
    """Downcast numeric columns to smallest sufficient dtype."""
    for col in df.select_dtypes(include=['int']).columns:
        df[col] = pd.to_numeric(df[col], downcast='integer')

    for col in df.select_dtypes(include=['float']).columns:
        df[col] = pd.to_numeric(df[col], downcast='float')

    return df
```

### Category for Low Cardinality

```python
# Before: object dtype (stores full string per row)
# After: category (stores int codes + lookup table)

# Good candidates: < 50% unique values
df['status'] = df['status'].astype('category')
df['country'] = df['country'].astype('category')

# Check cardinality
df['column'].nunique() / len(df)  # If < 0.5, use category
```

### Specify dtypes on Read

```python
# Best practice: define schema upfront
dtypes = {
    'id': 'int32',
    'name': 'string',        # or 'category' if low cardinality
    'price': 'float32',
    'quantity': 'int16',
    'status': 'category',
}

df = pd.read_csv('data.csv', dtype=dtypes)
```

---

## Chunked Processing

### Read in Chunks

```python
# Process large files without loading entirely
chunks = pd.read_csv('large_file.csv', chunksize=100_000)

results = []
for chunk in chunks:
    processed = process_chunk(chunk)
    results.append(processed)

df = pd.concat(results, ignore_index=True)
```

### Aggregate While Reading

```python
# Example: Calculate totals without loading full file
total = 0
for chunk in pd.read_csv('large.csv', chunksize=100_000):
    total += chunk['value'].sum()
```

---

## Sparse Data

```python
# For columns with many zeros/NaNs
df['sparse_col'] = pd.arrays.SparseArray(df['sparse_col'])

# Check sparsity
(df['col'] == 0).sum() / len(df)  # If > 0.5, consider sparse
```

---

## String Optimization

### Use 'string' dtype (pandas 1.0+)

```python
# 'string' is more memory-efficient than 'object' for strings
df['name'] = df['name'].astype('string')
```

### Use category for repeated strings

```python
# If same strings repeat often
df['city'] = df['city'].astype('category')
```

---

## Memory-Efficient Patterns

### Read Only Needed Columns

```python
# Don't read everything
df = pd.read_csv('data.csv', usecols=['col1', 'col2', 'col3'])
```

### Parse Dates Efficiently

```python
# Let pandas parse dates (faster than apply)
df = pd.read_csv('data.csv', parse_dates=['date_col'])
```

### Delete After Processing

```python
# Free memory explicitly
del df_intermediate
import gc
gc.collect()
```

### Use inplace Operations Carefully

```python
# inplace=True doesn't always save memory (often makes a copy anyway)
# Prefer reassignment for clarity
df = df.dropna()  # Clearer than df.downna(inplace=True)
```

---

## Polars Alternative

For very large data, consider Polars (Rust-based, more memory-efficient):

```python
import polars as pl

# Lazy evaluation - only computes what's needed
df = (
    pl.scan_csv('large.csv')
    .filter(pl.col('status') == 'active')
    .groupby('category')
    .agg(pl.col('value').sum())
    .collect()
)
```

---

## Memory Checklist

- [ ] Check file size before loading
- [ ] Define dtypes on read
- [ ] Use category for low-cardinality strings
- [ ] Downcast integers and floats
- [ ] Read only needed columns
- [ ] Process in chunks if > 1GB
- [ ] Delete intermediate DataFrames
- [ ] Consider Polars for 10GB+ datasets
