# Vectorization Reference

## Core Principle

Vectorized operations process entire arrays at once using optimized C/Fortran code. Row-by-row iteration in Python is 10-100x slower.

---

## The Speed Hierarchy

| Approach | Relative Speed | Use When |
|----------|----------------|----------|
| Vectorized numpy/pandas | 1x (fastest) | Always prefer |
| `.apply()` with numpy funcs | 2-5x slower | Custom logic needed |
| `.apply()` with Python funcs | 10-50x slower | Avoid if possible |
| `itertuples()` | 50-100x slower | Need row context |
| `iterrows()` | 100-500x slower | Never use |

---

## Vectorized Replacements

### Instead of Loops

```python
# ❌ Slow - Python loop
result = []
for i in range(len(df)):
    result.append(df.iloc[i]['a'] + df.iloc[i]['b'])
df['sum'] = result

# ✅ Fast - Vectorized
df['sum'] = df['a'] + df['b']
```

### Instead of Apply

```python
# ❌ Slow - apply with Python function
df['category'] = df['value'].apply(lambda x: 'high' if x > 100 else 'low')

# ✅ Fast - np.where
df['category'] = np.where(df['value'] > 100, 'high', 'low')

# ✅ Fast - np.select for multiple conditions
conditions = [
    df['value'] > 100,
    df['value'] > 50,
    df['value'] > 0
]
choices = ['high', 'medium', 'low']
df['category'] = np.select(conditions, choices, default='none')
```

### Instead of Iteration for Lookups

```python
# ❌ Slow - iterating to lookup
for idx, row in df.iterrows():
    df.loc[idx, 'lookup'] = lookup_dict.get(row['key'], 'default')

# ✅ Fast - map
df['lookup'] = df['key'].map(lookup_dict).fillna('default')
```

---

## String Operations

```python
# ❌ Slow - apply with string methods
df['lower'] = df['name'].apply(lambda x: x.lower())

# ✅ Fast - vectorized string accessor
df['lower'] = df['name'].str.lower()

# Common vectorized string operations
df['name'].str.upper()
df['name'].str.strip()
df['name'].str.contains('pattern')
df['name'].str.replace('old', 'new')
df['name'].str.split('_')
df['name'].str.len()
```

---

## Datetime Operations

```python
# ❌ Slow - apply with datetime
df['year'] = df['date'].apply(lambda x: x.year)

# ✅ Fast - datetime accessor
df['year'] = df['date'].dt.year

# Common vectorized datetime operations
df['date'].dt.month
df['date'].dt.day
df['date'].dt.dayofweek
df['date'].dt.hour
df['date'].dt.date
df['date'].dt.to_period('M')
```

---

## Conditional Logic

### np.where (if-else)

```python
df['status'] = np.where(
    df['score'] >= 70,
    'pass',
    'fail'
)
```

### np.select (multiple conditions)

```python
conditions = [
    df['score'] >= 90,
    df['score'] >= 80,
    df['score'] >= 70,
]
choices = ['A', 'B', 'C']
df['grade'] = np.select(conditions, choices, default='F')
```

### Boolean masking

```python
# Filter rows
high_scores = df[df['score'] > 90]

# Update subset
df.loc[df['score'] > 90, 'status'] = 'excellent'
```

---

## Aggregations

```python
# ❌ Slow - loop to aggregate
totals = {}
for key in df['category'].unique():
    totals[key] = df[df['category'] == key]['value'].sum()

# ✅ Fast - groupby
totals = df.groupby('category')['value'].sum()

# Multiple aggregations
df.groupby('category').agg({
    'value': ['sum', 'mean', 'count'],
    'quantity': 'sum'
})
```

---

## When Apply IS Acceptable

1. **Complex multi-column logic** that can't be expressed vectorially
2. **External API calls** (but consider chunking)
3. **Regex with groups** (though `str.extract` is often better)

```python
# Acceptable: truly complex logic
def complex_calculation(row):
    # Many conditions, external lookups, etc.
    result = external_api_call(row['id'])
    return process_result(result, row['config'])

# Use with raw=True if possible (faster)
df['result'] = df.apply(complex_calculation, axis=1)
```

---

## Profiling Tip

Use `%timeit` to compare approaches:

```python
%timeit df['a'] + df['b']                           # Vectorized
%timeit df.apply(lambda r: r['a'] + r['b'], axis=1) # Apply
%timeit [r['a'] + r['b'] for _, r in df.iterrows()] # Loop
```
