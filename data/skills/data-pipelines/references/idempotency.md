# Idempotency Reference

## Core Principle

An idempotent operation produces the same result whether executed once or multiple times. This is essential for data pipelines because:

- Tasks retry on failure
- Backfills re-run historical data
- Deployments may trigger re-execution

---

## The Idempotency Test

Ask: "If this task runs twice with the same inputs, will the output be identical?"

| Pattern | Idempotent? | Problem |
|---------|-------------|---------|
| `INSERT INTO` | ❌ No | Duplicates on retry |
| `INSERT ... ON CONFLICT DO UPDATE` | ✅ Yes | Upserts safely |
| `DELETE partition + INSERT` | ✅ Yes | Clean replacement |
| `TRUNCATE + INSERT` | ✅ Yes | Full replacement |
| `UPDATE WHERE` | ✅ Yes | Same update repeated |
| `Append to file` | ❌ No | Duplicates on retry |
| `Overwrite file` | ✅ Yes | Clean replacement |

---

## Idempotent Write Patterns

### Pattern 1: Delete-Then-Insert

```python
def load_partition(df, table, partition_date):
    """Delete partition, then insert. Safe to retry."""
    with engine.begin() as conn:
        conn.execute(f"""
            DELETE FROM {table}
            WHERE partition_date = '{partition_date}'
        """)
        df.to_sql(table, conn, if_exists='append', index=False)
```

### Pattern 2: Upsert

```sql
-- PostgreSQL
INSERT INTO dim_customers (id, name, email, updated_at)
VALUES (%(id)s, %(name)s, %(email)s, %(updated_at)s)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    updated_at = EXCLUDED.updated_at;
```

### Pattern 3: Staging Table + Merge

```sql
-- 1. Load to staging (truncate first)
TRUNCATE staging_orders;
INSERT INTO staging_orders SELECT * FROM source;

-- 2. Merge to target
MERGE INTO orders AS target
USING staging_orders AS source
ON target.order_id = source.order_id
WHEN MATCHED THEN UPDATE SET ...
WHEN NOT MATCHED THEN INSERT ...;
```

### Pattern 4: File Overwrite

```python
def write_output(df, path):
    """Overwrite file, not append. Safe to retry."""
    df.to_parquet(path, mode='overwrite')
```

---

## S3 Idempotent Patterns

### Partition Overwrite

```python
# Each run overwrites its partition
output_path = f"s3://bucket/table/date={execution_date}/"

# Delete existing partition
s3.delete_objects(Bucket='bucket', Prefix=f'table/date={execution_date}/')

# Write new data
df.to_parquet(output_path)
```

### Atomic Writes

```python
# Write to temp location, then rename (atomic)
temp_path = f"s3://bucket/tmp/{uuid4()}"
final_path = f"s3://bucket/table/date={date}/"

df.to_parquet(temp_path)
s3.copy(temp_path, final_path)
s3.delete(temp_path)
```

---

## Non-Idempotent Triggers

Avoid these in idempotent pipelines:

| Trigger | Problem | Fix |
|---------|---------|-----|
| Auto-increment IDs | Different IDs on retry | Use natural keys or UUIDs |
| `NOW()` timestamps | Different time on retry | Pass execution time as parameter |
| Random values | Different output | Use seeded random or deterministic logic |
| External API calls | Side effects | Guard with idempotency keys |
| Email/notification sends | Multiple sends | Use "sent" flag or idempotency service |

---

## Execution Date Pattern

```python
# ❌ Bad: Uses runtime timestamp
def process_data():
    today = datetime.now().date()
    df = extract(today)
    load(df, partition_date=today)

# ✅ Good: Uses parameterized execution date
def process_data(execution_date):
    df = extract(execution_date)
    load(df, partition_date=execution_date)
```

Airflow example:
```python
@task
def process_data(execution_date=None):
    # execution_date is provided by Airflow
    # Same value on retry
    pass
```

---

## Idempotency Keys for APIs

```python
import hashlib

def call_external_api(order_id, amount):
    """Use idempotency key to prevent duplicate charges."""
    idempotency_key = hashlib.sha256(
        f"{order_id}:{amount}".encode()
    ).hexdigest()

    response = requests.post(
        "https://api.payment.com/charge",
        json={"order_id": order_id, "amount": amount},
        headers={"Idempotency-Key": idempotency_key}
    )
    return response
```

---

## Testing Idempotency

```python
def test_load_is_idempotent():
    """Run load twice, verify same result."""
    # First run
    load_data(df, table, partition_date='2024-01-01')
    count_1 = get_row_count(table, partition_date='2024-01-01')

    # Second run (simulating retry)
    load_data(df, table, partition_date='2024-01-01')
    count_2 = get_row_count(table, partition_date='2024-01-01')

    # Same count means no duplicates
    assert count_1 == count_2
```

---

## Checklist

- [ ] All writes use upsert or delete-then-insert
- [ ] No append-only patterns without deduplication
- [ ] Execution date is parameterized, not calculated
- [ ] Timestamps use execution time, not runtime
- [ ] External API calls use idempotency keys
- [ ] Tests verify running twice produces same output
