# Query Patterns

## Common Table Expressions (CTEs)

```sql
WITH active_users AS (
    SELECT user_id, username, created_at
    FROM users
    WHERE is_active = true
),
monthly_sales AS (
    SELECT product_id, date_trunc('month', sold_at) AS month, SUM(amount) AS total
    FROM sales
    GROUP BY product_id, date_trunc('month', sold_at)
)
SELECT current.product_id, current.month, current.total, previous.total AS prior_total
FROM monthly_sales current
LEFT JOIN monthly_sales previous
    ON current.product_id = previous.product_id
   AND current.month = previous.month + INTERVAL '1 month';
```

## Recursive CTEs

```sql
WITH RECURSIVE org_hierarchy AS (
    SELECT employee_id, manager_id, name, 1 AS level
    FROM employees
    WHERE manager_id IS NULL

    UNION ALL

    SELECT e.employee_id, e.manager_id, e.name, oh.level + 1
    FROM employees e
    JOIN org_hierarchy oh ON e.manager_id = oh.employee_id
)
SELECT employee_id, name, level
FROM org_hierarchy
ORDER BY level, name;
```

## Advanced JOIN Patterns

```sql
SELECT
    a.order_id AS current_id,
    MIN(b.order_id) AS next_id,
    MIN(b.order_id) - a.order_id - 1 AS gap_size
FROM orders a
LEFT JOIN orders b ON b.order_id > a.order_id
GROUP BY a.order_id
HAVING MIN(b.order_id) - a.order_id > 1;
```

## Subquery Optimization

```sql
SELECT
    p.product_id,
    p.name,
    review_counts.review_count
FROM products p
LEFT JOIN (
    SELECT product_id, COUNT(*) AS review_count
    FROM reviews
    GROUP BY product_id
) review_counts ON review_counts.product_id = p.product_id;
```

## Set Operations

```sql
SELECT product_id FROM active_products
UNION
SELECT product_id FROM featured_products;

SELECT email FROM all_users
EXCEPT
SELECT email FROM unsubscribed_users;
```

## Performance Tips

1. Use `UNION ALL` instead of `UNION` when you do not need deduplication.
2. Prefer joins or pre-aggregated subqueries over repeated scalar subqueries.
3. Use recursive CTEs for trees and hierarchies, but cap depth if cycles are possible.
4. Check execution plans when a readable CTE turns into an unexpected full scan.
