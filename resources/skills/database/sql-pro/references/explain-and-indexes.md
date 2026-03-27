# EXPLAIN and Indexes

Use this reference when the task starts with a slow query plan.

## Plan Reading

```sql
EXPLAIN (ANALYZE, BUFFERS, VERBOSE)
SELECT u.*, o.total
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE u.created_at > NOW() - INTERVAL '30 days';
```

## What to Look For

- Sequential scans on large tables
- Large estimate versus actual row-count gaps
- Nested loops on large joins
- Opportunities for index-only scans

## Index Examples

```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
CREATE INDEX idx_active_users ON users(email) WHERE status = 'active';
CREATE INDEX idx_users_lower_email ON users(LOWER(email));
```
