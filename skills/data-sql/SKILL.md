---
name: data-sql
description: SQL patterns for query optimization, schema design, and data modeling
user-invocable: false
---

# Data SQL Skill

**Version:** 1.0
**Stack:** SQL (PostgreSQL, Redshift, Athena, Spark SQL)

> Patterns for writing performant, maintainable SQL.

---

## Scope and Boundaries

**This skill covers:**
- Query optimization patterns
- Schema design and normalization
- Data modeling (star schema, slowly changing dimensions)
- CTEs and query organization
- Index strategy
- Window functions

**Defers to other skills:**
- `security`: SQL injection prevention, parameterized queries
- `data-pipelines`: When to use SQL vs. application code

**Use this skill when:** Writing SQL queries or designing schemas.

---

## Core Principles

1. **CTEs for Readability** — Break complex queries into named steps.
2. **Filter Early** — Push WHERE clauses as close to source as possible.
3. **Explicit Columns** — Never `SELECT *` in production code.
4. **Index-Aware Queries** — Know what's indexed, write queries that use them.
5. **Idempotent Operations** — INSERT/UPDATE should be safe to retry.

---

## Patterns

### CTE Organization

```sql
-- Good - logical steps, easy to debug
WITH active_users AS (
    SELECT user_id, email
    FROM users
    WHERE status = 'active'
),
recent_orders AS (
    SELECT user_id, COUNT(*) as order_count
    FROM orders
    WHERE created_at > CURRENT_DATE - INTERVAL '30 days'
    GROUP BY user_id
)
SELECT
    u.email,
    COALESCE(o.order_count, 0) as recent_orders
FROM active_users u
LEFT JOIN recent_orders o USING (user_id);
```

### Upsert Pattern (PostgreSQL)

```sql
INSERT INTO inventory (sku, quantity, updated_at)
VALUES ('ABC123', 100, NOW())
ON CONFLICT (sku) DO UPDATE SET
    quantity = EXCLUDED.quantity,
    updated_at = EXCLUDED.updated_at;
```

### Window Functions

```sql
-- Running total and row number
SELECT
    date,
    revenue,
    SUM(revenue) OVER (ORDER BY date) as running_total,
    ROW_NUMBER() OVER (PARTITION BY category ORDER BY revenue DESC) as rank
FROM daily_sales;
```

---

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|--------------|---------|-----|
| `SELECT *` | Breaks on schema changes, wastes bandwidth | List explicit columns |
| Correlated subqueries | N+1 query behavior | Use JOINs or window functions |
| `OR` in JOIN conditions | Prevents index use | Restructure or use UNION |
| Functions on indexed columns | `WHERE YEAR(date) = 2024` | Use range: `date >= '2024-01-01'` |
| Missing `GROUP BY` columns | Undefined behavior | Include all non-aggregated columns |

---

## Checklist

- [ ] No `SELECT *` in production queries
- [ ] CTEs used for complex queries
- [ ] WHERE clauses filter early
- [ ] JOINs prefer indexed columns
- [ ] Upserts are idempotent
- [ ] Large queries tested with EXPLAIN

---

## References

- `references/query-optimization.md` — Index usage, join optimization, performance
- `references/window-functions.md` — Window function patterns and examples

## Assets

- `assets/query-patterns.md` — Common SQL patterns and templates
