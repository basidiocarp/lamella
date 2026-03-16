# Query Patterns

## Common Table Expressions (CTEs)

```sql
-- Basic CTE for readability
WITH active_users AS (
    SELECT user_id, username, created_at
    FROM users
    WHERE is_active = true
// ... (37 lines trimmed)
LEFT JOIN monthly_sales previous
    ON current.product_id = previous.product_id
    AND current.month = previous.month + INTERVAL '1 month';
```

## Recursive CTEs

```sql
-- Organizational hierarchy traversal
WITH RECURSIVE org_hierarchy AS (
    -- Anchor member: top-level managers
    SELECT
        employee_id,
// ... (56 lines trimmed)
    MAX(level) as max_depth
FROM parts_explosion
GROUP BY component_id;
```

## Advanced JOIN Patterns

```sql
-- Self-join for finding gaps in sequences
SELECT
    a.order_id as current_id,
    MIN(b.order_id) as next_id,
    MIN(b.order_id) - a.order_id - 1 as gap_size
// ... (31 lines trimmed)
    FROM orders o
    WHERE o.user_id = u.user_id
);
```

## Subquery Optimization

```sql
-- Scalar subquery in SELECT (use sparingly - can cause N+1)
SELECT
    p.product_id,
    p.name,
    (SELECT COUNT(*) FROM reviews r WHERE r.product_id = p.product_id) as review_count,
// ... (42 lines trimmed)
    FROM orders
) x
WHERE total > avg_customer_total;
```

## PIVOT/UNPIVOT Operations

```sql
-- PostgreSQL CROSSTAB (requires tablefunc extension)
CREATE EXTENSION IF NOT EXISTS tablefunc;

SELECT * FROM crosstab(
    'SELECT customer_id, product_category, SUM(amount)
// ... (21 lines trimmed)
UNION ALL
SELECT customer_id, 'food', food
FROM customer_sales WHERE food > 0;
```

## Set Operations

```sql
-- UNION for combining distinct results
SELECT product_id FROM active_products
UNION
SELECT product_id FROM featured_products;

// ... (11 lines trimmed)
SELECT email FROM all_users
EXCEPT
SELECT email FROM unsubscribed_users;
```

## Performance Tips

1. **CTE Materialization**: PostgreSQL 12+ materializes CTEs by default. Use `WITH cte AS MATERIALIZED` or `NOT MATERIALIZED` to control
2. **JOIN Order**: Database optimizers handle this, but put smaller tables first in manual optimization
3. **EXISTS vs IN**: Use EXISTS for correlated checks, IN for small static lists
4. **Subquery vs JOIN**: Prefer JOINs for readability and optimizer friendliness
5. **UNION ALL vs UNION**: Use UNION ALL when duplicates are acceptable (no deduplication cost)
