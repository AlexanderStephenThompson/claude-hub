# Pandas Cheatsheet

## Reading Data

```python
# CSV
df = pd.read_csv('file.csv', dtype={'col': 'int32'}, parse_dates=['date'])

# Parquet (preferred for large data)
df = pd.read_parquet('file.parquet')

# SQL
df = pd.read_sql('SELECT * FROM table', connection)

# Excel
df = pd.read_excel('file.xlsx', sheet_name='Sheet1')

# JSON
df = pd.read_json('file.json')
```

---

## Writing Data

```python
# CSV
df.to_csv('out.csv', index=False)

# Parquet (compressed, typed)
df.to_parquet('out.parquet', index=False)

# SQL
df.to_sql('table', connection, if_exists='replace', index=False)
```

---

## Selection

```python
# Single column
df['col']               # Series
df[['col']]             # DataFrame

# Multiple columns
df[['col1', 'col2']]

# Rows by condition
df[df['col'] > 10]
df[df['col'].isin(['a', 'b'])]
df[df['col'].str.contains('pattern')]

# Rows and columns
df.loc[df['col'] > 10, ['col1', 'col2']]
df.iloc[0:10, 0:3]      # By position
```

---

## Filtering

```python
# Single condition
df[df['col'] > 10]

# Multiple conditions (use & | ~, with parentheses)
df[(df['a'] > 10) & (df['b'] < 20)]
df[(df['a'] > 10) | (df['b'] < 20)]
df[~df['col'].isna()]

# Query method (cleaner for complex)
df.query('a > 10 and b < 20')
df.query('status == "active"')
```

---

## Transformations

```python
# New column
df['new'] = df['a'] + df['b']

# Conditional column
df['cat'] = np.where(df['val'] > 100, 'high', 'low')

# Apply function
df['result'] = df['col'].apply(func)

# Multiple columns
df['sum'] = df[['a', 'b', 'c']].sum(axis=1)

# Rename columns
df = df.rename(columns={'old': 'new'})
df.columns = ['a', 'b', 'c']
```

---

## Aggregation

```python
# Basic aggregations
df['col'].sum()
df['col'].mean()
df['col'].count()
df['col'].min() / max()
df['col'].nunique()

# GroupBy
df.groupby('category')['value'].sum()
df.groupby(['cat1', 'cat2']).agg({
    'value': ['sum', 'mean'],
    'count': 'count'
})

# Pivot table
df.pivot_table(
    values='value',
    index='row_cat',
    columns='col_cat',
    aggfunc='sum'
)
```

---

## Joins

```python
# Merge (SQL-style join)
pd.merge(df1, df2, on='key')
pd.merge(df1, df2, left_on='a', right_on='b')
pd.merge(df1, df2, on='key', how='left')  # left, right, inner, outer

# Concat (stack DataFrames)
pd.concat([df1, df2])               # Vertical (rows)
pd.concat([df1, df2], axis=1)       # Horizontal (columns)
```

---

## Reshaping

```python
# Melt (wide to long)
pd.melt(df, id_vars=['id'], value_vars=['col1', 'col2'])

# Pivot (long to wide)
df.pivot(index='date', columns='category', values='value')

# Stack/Unstack
df.stack()
df.unstack()
```

---

## Missing Data

```python
# Check for nulls
df.isna().sum()
df['col'].isna()

# Drop nulls
df.dropna()
df.dropna(subset=['col1', 'col2'])

# Fill nulls
df.fillna(0)
df['col'].fillna(df['col'].mean())
df.fillna(method='ffill')  # Forward fill
```

---

## Sorting

```python
df.sort_values('col')
df.sort_values('col', ascending=False)
df.sort_values(['col1', 'col2'], ascending=[True, False])
df.sort_index()
```

---

## String Operations

```python
df['col'].str.lower()
df['col'].str.upper()
df['col'].str.strip()
df['col'].str.replace('old', 'new')
df['col'].str.contains('pattern')
df['col'].str.split('_')
df['col'].str.extract(r'(\d+)')
df['col'].str.len()
```

---

## Datetime Operations

```python
df['date'].dt.year
df['date'].dt.month
df['date'].dt.day
df['date'].dt.dayofweek
df['date'].dt.date
df['date'].dt.to_period('M')
df['date'] + pd.Timedelta(days=7)
```

---

## Common Patterns

### Method Chaining

```python
result = (
    df
    .query('status == "active"')
    .assign(total=lambda x: x['qty'] * x['price'])
    .groupby('category')
    .agg({'total': 'sum'})
    .sort_values('total', ascending=False)
    .head(10)
)
```

### Value Counts

```python
df['col'].value_counts()
df['col'].value_counts(normalize=True)  # Percentages
```

### Duplicates

```python
df.duplicated()
df.duplicated(subset=['col1', 'col2'])
df.drop_duplicates()
df.drop_duplicates(subset=['col1'], keep='last')
```
