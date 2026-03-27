# Query Pattern Fixes

Use this reference when the problem is query shape rather than raw hardware or server configuration.

## N+1 Repair

```python
users = db.query("SELECT * FROM users LIMIT 10")
orders = db.query("SELECT * FROM orders WHERE user_id IN (?)", [u.id for u in users])
```

## Cursor Pagination

```sql
SELECT *
FROM users
WHERE (created_at, id) < ($1, $2)
ORDER BY created_at DESC, id DESC
LIMIT 20;
```

## Aggregation Guardrail

- Push filters before large joins or group-by work when possible.
- Avoid `SELECT *` in hot paths that only need a small projection.
