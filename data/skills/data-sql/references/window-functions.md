# Window Functions Reference

## Core Concept

Window functions perform calculations across rows related to the current row, without collapsing rows like GROUP BY.

```sql
function() OVER (
    [PARTITION BY column]
    [ORDER BY column]
    [ROWS/RANGE frame]
)
```

---

## Ranking Functions

### ROW_NUMBER

Unique sequential number per partition.

```sql
-- Rank orders by date per customer
SELECT
    customer_id,
    order_id,
    created_at,
    ROW_NUMBER() OVER (
        PARTITION BY customer_id
        ORDER BY created_at
    ) as order_sequence
FROM orders;
```

### RANK

Ranking with gaps on ties.

```sql
-- Sales ranking (ties get same rank, next rank skipped)
SELECT
    salesperson,
    revenue,
    RANK() OVER (ORDER BY revenue DESC) as rank
FROM sales;
-- Result: 1, 2, 2, 4 (rank 3 skipped)
```

### DENSE_RANK

Ranking without gaps on ties.

```sql
SELECT
    salesperson,
    revenue,
    DENSE_RANK() OVER (ORDER BY revenue DESC) as rank
FROM sales;
-- Result: 1, 2, 2, 3 (no gap)
```

### NTILE

Divide into N equal groups.

```sql
-- Divide customers into quartiles by spending
SELECT
    customer_id,
    total_spent,
    NTILE(4) OVER (ORDER BY total_spent DESC) as quartile
FROM customer_summary;
```

---

## Aggregate Window Functions

```sql
SELECT
    date,
    revenue,
    -- Running total
    SUM(revenue) OVER (ORDER BY date) as running_total,

    -- Moving average (last 7 days)
    AVG(revenue) OVER (
        ORDER BY date
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) as moving_avg_7d,

    -- Total for comparison
    SUM(revenue) OVER () as grand_total,

    -- Percent of total
    revenue * 100.0 / SUM(revenue) OVER () as pct_of_total
FROM daily_revenue;
```

---

## Navigation Functions

### LAG / LEAD

Access previous/next row values.

```sql
SELECT
    date,
    revenue,
    -- Previous day's revenue
    LAG(revenue, 1) OVER (ORDER BY date) as prev_day,

    -- Day-over-day change
    revenue - LAG(revenue, 1) OVER (ORDER BY date) as daily_change,

    -- Next day's revenue
    LEAD(revenue, 1) OVER (ORDER BY date) as next_day
FROM daily_revenue;
```

### FIRST_VALUE / LAST_VALUE

```sql
SELECT
    category,
    product,
    price,
    -- Cheapest in category
    FIRST_VALUE(product) OVER (
        PARTITION BY category
        ORDER BY price
    ) as cheapest_product,

    -- Most expensive in category
    LAST_VALUE(product) OVER (
        PARTITION BY category
        ORDER BY price
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) as most_expensive
FROM products;
```

---

## Frame Specifications

### ROWS vs RANGE

```sql
-- ROWS: Physical rows
ROWS BETWEEN 2 PRECEDING AND CURRENT ROW

-- RANGE: Logical range (groups ties together)
RANGE BETWEEN INTERVAL '7 days' PRECEDING AND CURRENT ROW
```

### Frame Options

```sql
-- All rows up to current
ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW

-- Centered window
ROWS BETWEEN 3 PRECEDING AND 3 FOLLOWING

-- All rows in partition
ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING

-- Current row only
ROWS BETWEEN CURRENT ROW AND CURRENT ROW
```

---

## Common Patterns

### Running Total

```sql
SELECT
    date,
    amount,
    SUM(amount) OVER (ORDER BY date) as running_total
FROM transactions;
```

### Year-to-Date

```sql
SELECT
    date,
    revenue,
    SUM(revenue) OVER (
        PARTITION BY EXTRACT(YEAR FROM date)
        ORDER BY date
    ) as ytd_revenue
FROM daily_revenue;
```

### Percent Change

```sql
SELECT
    date,
    value,
    (value - LAG(value) OVER (ORDER BY date))
    / LAG(value) OVER (ORDER BY date) * 100 as pct_change
FROM metrics;
```

### De-duplication (Keep Latest)

```sql
WITH ranked AS (
    SELECT
        *,
        ROW_NUMBER() OVER (
            PARTITION BY email
            ORDER BY updated_at DESC
        ) as rn
    FROM users
)
SELECT * FROM ranked WHERE rn = 1;
```

### Top N Per Group

```sql
WITH ranked AS (
    SELECT
        category,
        product,
        revenue,
        ROW_NUMBER() OVER (
            PARTITION BY category
            ORDER BY revenue DESC
        ) as rank
    FROM products
)
SELECT * FROM ranked WHERE rank <= 3;
```

### Cumulative Distribution

```sql
SELECT
    score,
    CUME_DIST() OVER (ORDER BY score) as percentile,
    PERCENT_RANK() OVER (ORDER BY score) as percent_rank
FROM test_scores;
```

---

## Performance Notes

- Window functions process after WHERE/GROUP BY/HAVING
- Multiple windows with same PARTITION/ORDER can share sorting
- Large partitions with complex frames can be slow
- Consider materializing intermediate results for complex analytics
