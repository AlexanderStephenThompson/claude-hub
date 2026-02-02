# SQL Query Patterns

## CTE Template

```sql
WITH
-- Step 1: Filter to relevant data
filtered_data AS (
    SELECT *
    FROM source_table
    WHERE condition = 'value'
),

-- Step 2: Aggregate or transform
aggregated AS (
    SELECT
        group_key,
        SUM(value) as total,
        COUNT(*) as count
    FROM filtered_data
    GROUP BY group_key
),

-- Step 3: Enrich with additional data
enriched AS (
    SELECT
        a.*,
        l.lookup_value
    FROM aggregated a
    LEFT JOIN lookup_table l ON a.group_key = l.key
)

-- Final output
SELECT * FROM enriched
ORDER BY total DESC;
```

---

## Upsert Patterns

### PostgreSQL

```sql
INSERT INTO inventory (sku, quantity, updated_at)
VALUES ('ABC123', 100, NOW())
ON CONFLICT (sku) DO UPDATE SET
    quantity = EXCLUDED.quantity,
    updated_at = EXCLUDED.updated_at;
```

### MySQL

```sql
INSERT INTO inventory (sku, quantity, updated_at)
VALUES ('ABC123', 100, NOW())
ON DUPLICATE KEY UPDATE
    quantity = VALUES(quantity),
    updated_at = VALUES(updated_at);
```

### SQL Server (MERGE)

```sql
MERGE INTO inventory AS target
USING (VALUES ('ABC123', 100, GETDATE())) AS source (sku, quantity, updated_at)
ON target.sku = source.sku
WHEN MATCHED THEN
    UPDATE SET quantity = source.quantity, updated_at = source.updated_at
WHEN NOT MATCHED THEN
    INSERT (sku, quantity, updated_at)
    VALUES (source.sku, source.quantity, source.updated_at);
```

---

## Date Range Queries

### Daily Summary

```sql
SELECT
    DATE(created_at) as date,
    COUNT(*) as count,
    SUM(amount) as total
FROM orders
WHERE created_at >= '2024-01-01'
  AND created_at < '2024-02-01'
GROUP BY DATE(created_at)
ORDER BY date;
```

### Fill Missing Dates

```sql
WITH date_series AS (
    SELECT generate_series(
        '2024-01-01'::date,
        '2024-01-31'::date,
        '1 day'
    )::date as date
),
daily_totals AS (
    SELECT DATE(created_at) as date, SUM(amount) as total
    FROM orders
    WHERE created_at >= '2024-01-01'
    GROUP BY DATE(created_at)
)
SELECT
    d.date,
    COALESCE(t.total, 0) as total
FROM date_series d
LEFT JOIN daily_totals t ON d.date = t.date
ORDER BY d.date;
```

---

## Hierarchy / Tree Queries

### Recursive CTE (Org Chart)

```sql
WITH RECURSIVE org_tree AS (
    -- Base case: top-level managers
    SELECT id, name, manager_id, 1 as level
    FROM employees
    WHERE manager_id IS NULL

    UNION ALL

    -- Recursive case: employees under managers
    SELECT e.id, e.name, e.manager_id, t.level + 1
    FROM employees e
    JOIN org_tree t ON e.manager_id = t.id
)
SELECT * FROM org_tree ORDER BY level, name;
```

---

## Pivot / Unpivot

### Pivot (Rows to Columns)

```sql
SELECT
    product_id,
    SUM(CASE WHEN month = 1 THEN revenue END) as jan,
    SUM(CASE WHEN month = 2 THEN revenue END) as feb,
    SUM(CASE WHEN month = 3 THEN revenue END) as mar
FROM monthly_sales
GROUP BY product_id;
```

### Unpivot (Columns to Rows)

```sql
SELECT product_id, 'jan' as month, jan as revenue FROM sales WHERE jan IS NOT NULL
UNION ALL
SELECT product_id, 'feb' as month, feb as revenue FROM sales WHERE feb IS NOT NULL
UNION ALL
SELECT product_id, 'mar' as month, mar as revenue FROM sales WHERE mar IS NOT NULL;
```

---

## Deduplication

### Keep First/Last

```sql
-- Keep most recent per email
DELETE FROM users
WHERE id NOT IN (
    SELECT DISTINCT ON (email) id
    FROM users
    ORDER BY email, created_at DESC
);
```

### Identify Duplicates

```sql
SELECT email, COUNT(*) as count
FROM users
GROUP BY email
HAVING COUNT(*) > 1;
```

---

## Gap and Island Detection

### Find Gaps in Sequences

```sql
WITH seq AS (
    SELECT id, LEAD(id) OVER (ORDER BY id) as next_id
    FROM records
)
SELECT id + 1 as gap_start, next_id - 1 as gap_end
FROM seq
WHERE next_id - id > 1;
```

### Group Consecutive Records (Islands)

```sql
WITH grouped AS (
    SELECT
        *,
        ROW_NUMBER() OVER (ORDER BY date)
        - ROW_NUMBER() OVER (PARTITION BY status ORDER BY date) as grp
    FROM status_log
)
SELECT
    status,
    MIN(date) as start_date,
    MAX(date) as end_date,
    COUNT(*) as days
FROM grouped
GROUP BY status, grp
ORDER BY start_date;
```

---

## Safe Division

```sql
-- Avoid division by zero
SELECT
    numerator / NULLIF(denominator, 0) as ratio,
    COALESCE(numerator / NULLIF(denominator, 0), 0) as ratio_or_zero
FROM data;
```

---

## Conditional Aggregation

```sql
SELECT
    customer_id,
    COUNT(*) as total_orders,
    COUNT(*) FILTER (WHERE status = 'completed') as completed,
    COUNT(*) FILTER (WHERE status = 'pending') as pending,
    SUM(amount) FILTER (WHERE status = 'completed') as completed_revenue
FROM orders
GROUP BY customer_id;
```
