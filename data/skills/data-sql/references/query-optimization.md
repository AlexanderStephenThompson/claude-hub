# Query Optimization Reference

## Core Principle

The database query optimizer makes decisions based on statistics, indexes, and query structure. Write queries that help the optimizer make good choices.

---

## EXPLAIN Plans

### Reading EXPLAIN Output

```sql
EXPLAIN ANALYZE
SELECT * FROM orders WHERE customer_id = 123;
```

Key metrics to watch:
- **Seq Scan** — Full table scan (usually bad for large tables)
- **Index Scan** — Using index (usually good)
- **Rows** — Estimated vs actual (large differences = stale statistics)
- **Loops** — Nested loop count (high = potential problem)
- **Cost** — Relative cost (lower is better)

---

## Index Usage

### Indexes ARE Used

```sql
-- Direct equality
WHERE customer_id = 123

-- Range on leading column
WHERE created_at > '2024-01-01'

-- IN with small list
WHERE status IN ('active', 'pending')

-- LIKE with prefix
WHERE name LIKE 'John%'
```

### Indexes ARE NOT Used

```sql
-- Function on indexed column
WHERE YEAR(created_at) = 2024      -- ❌ Use range instead
WHERE created_at >= '2024-01-01'   -- ✅

-- LIKE with leading wildcard
WHERE name LIKE '%Smith'           -- ❌ Full scan

-- OR across different columns
WHERE a = 1 OR b = 2               -- ❌ Often full scan

-- NOT conditions
WHERE status != 'deleted'          -- ❌ Often full scan

-- Implicit type conversion
WHERE string_id = 123              -- ❌ Cast prevents index
WHERE string_id = '123'            -- ✅
```

---

## Composite Index Usage

For index on `(a, b, c)`:

| Query | Index Used? |
|-------|-------------|
| `WHERE a = 1` | ✅ Yes |
| `WHERE a = 1 AND b = 2` | ✅ Yes |
| `WHERE a = 1 AND b = 2 AND c = 3` | ✅ Yes (full) |
| `WHERE b = 2` | ❌ No (missing leading column) |
| `WHERE a = 1 AND c = 3` | ⚠️ Partial (only `a`) |
| `WHERE a = 1 ORDER BY b` | ✅ Yes (index covers sort) |

**Rule:** Index columns are used left-to-right until a gap or range condition.

---

## JOIN Optimization

### Join Order Matters

```sql
-- Start with the most filtered table
-- Bad: Large table first
SELECT * FROM orders o
JOIN order_items oi ON o.id = oi.order_id
WHERE o.status = 'pending';

-- Better: Let optimizer choose (usually correct)
-- Or use hints if needed
```

### Index JOIN Columns

```sql
-- Ensure foreign keys are indexed
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Covering index for common joins
CREATE INDEX idx_orders_status_customer
ON orders(status, customer_id);
```

### Avoid Implicit Cross Joins

```sql
-- ❌ Accidental cross join
SELECT * FROM a, b WHERE a.x = b.x;

-- ✅ Explicit join
SELECT * FROM a JOIN b ON a.x = b.x;
```

---

## Subquery vs JOIN

### Correlated Subquery (Often Slow)

```sql
-- ❌ Runs subquery for each row
SELECT *
FROM orders o
WHERE customer_id IN (
    SELECT customer_id
    FROM customers
    WHERE status = 'premium'
);
```

### JOIN (Usually Faster)

```sql
-- ✅ Single join operation
SELECT o.*
FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE c.status = 'premium';
```

### EXISTS (Good for Existence Checks)

```sql
-- ✅ Stops at first match
SELECT *
FROM orders o
WHERE EXISTS (
    SELECT 1
    FROM order_items oi
    WHERE oi.order_id = o.id
    AND oi.quantity > 10
);
```

---

## Aggregation Optimization

### Filter Before Aggregating

```sql
-- ❌ Aggregates everything, then filters
SELECT customer_id, SUM(total)
FROM orders
GROUP BY customer_id
HAVING SUM(total) > 1000;

-- ✅ Filter first when possible
SELECT customer_id, SUM(total)
FROM orders
WHERE status = 'completed'  -- Reduces rows before aggregation
GROUP BY customer_id
HAVING SUM(total) > 1000;
```

### Partial Aggregation with Index

```sql
-- Index on (category, created_at) enables efficient:
SELECT category, DATE(created_at), COUNT(*)
FROM products
WHERE created_at > '2024-01-01'
GROUP BY category, DATE(created_at);
```

---

## LIMIT Optimization

### Use with ORDER BY

```sql
-- With index on created_at, very fast
SELECT * FROM orders
ORDER BY created_at DESC
LIMIT 10;

-- Without index, must sort all rows first (slow)
```

### Pagination Pitfall

```sql
-- ❌ Gets slower with higher offsets
SELECT * FROM orders ORDER BY id LIMIT 10 OFFSET 10000;

-- ✅ Keyset pagination (consistent performance)
SELECT * FROM orders
WHERE id > 10000
ORDER BY id
LIMIT 10;
```

---

## Statistics and Maintenance

```sql
-- Update table statistics (PostgreSQL)
ANALYZE table_name;

-- Update all tables
ANALYZE;

-- Reclaim space and update stats
VACUUM ANALYZE table_name;
```

---

## Common Slow Patterns

| Pattern | Problem | Fix |
|---------|---------|-----|
| `SELECT *` | Fetches unused columns | Select needed columns |
| `DISTINCT` on large sets | Full sort | Check if really needed |
| `ORDER BY RAND()` | Full table sort | Use sampling technique |
| `COUNT(*)` without filter | Scans all rows | Cache count if needed |
| Multiple subqueries | Each executes separately | Combine with JOINs or CTEs |
| `UNION` vs `UNION ALL` | UNION deduplicates (slow) | Use UNION ALL if no dupes |
