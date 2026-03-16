# SQL Optimization Patterns

# SQL Optimization Patterns


## Contents

- [When to Use](#when-to-use)
- [EXPLAIN Analysis](#explain-analysis)
- [Index Strategies](#index-strategies)
- [Optimization Patterns](#optimization-patterns)
- [Monitoring](#monitoring)
- [Maintenance](#maintenance)
- [Guidelines](#guidelines)

## When to Use

- Debugging slow-running queries
- Designing indexes for specific query patterns
- Analyzing EXPLAIN output
- Resolving N+1 query problems
- Optimizing pagination or aggregation

## EXPLAIN Analysis

```sql
EXPLAIN (ANALYZE, BUFFERS, VERBOSE)
SELECT u.*, o.total
FROM users u JOIN orders o ON u.id = o.user_id
WHERE u.created_at > NOW() - INTERVAL '30 days';
```

Key things to look for:
- Seq Scan on large tables (usually needs an index)
- Nested Loop on large datasets (hash or merge join may be better)
- Index Only Scan (best case -- no table access needed)
- Large gap between estimated and actual rows (stale statistics)

## Index Strategies

```sql
CREATE INDEX idx_users_email ON users(email);                        -- B-tree equality
CREATE INDEX idx_orders_user_status ON orders(user_id, status);      -- Composite (order matters)
CREATE INDEX idx_active_users ON users(email) WHERE status = 'active'; -- Partial
CREATE INDEX idx_users_lower_email ON users(LOWER(email));           -- Expression
CREATE INDEX idx_users_covering ON users(email) INCLUDE (name);      -- Covering (index-only scan)
CREATE INDEX idx_posts_search ON posts USING GIN(to_tsvector('english', title || ' ' || body)); -- Full-text
CREATE INDEX idx_metadata ON events USING GIN(metadata);             -- JSONB
```

## Optimization Patterns

### N+1 Queries

```python
# Bad: N+1
users = db.query("SELECT * FROM users LIMIT 10")
for user in users:
    orders = db.query("SELECT * FROM orders WHERE user_id = ?", user.id)

# Good: batch load
users = db.query("SELECT * FROM users LIMIT 10")
orders = db.query("SELECT * FROM orders WHERE user_id IN (?)", [u.id for u in users])
```

### Cursor-Based Pagination

```sql
-- Bad: OFFSET on large tables
SELECT * FROM users ORDER BY created_at DESC LIMIT 20 OFFSET 100000;

-- Good: cursor-based
SELECT * FROM users
WHERE (created_at, id) < ('2024-01-15 10:30:00', 12345)
ORDER BY created_at DESC, id DESC LIMIT 20;

CREATE INDEX idx_users_cursor ON users(created_at DESC, id DESC);
```

### Subquery to JOIN

```sql
-- Bad: correlated subquery (runs per row)
SELECT u.name, (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) as order_count
FROM users u;

-- Good: JOIN with aggregation
SELECT u.name, COUNT(o.id) as order_count
FROM users u LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.id, u.name;
```

### Batch Operations

```sql
-- Batch insert (not individual statements)
INSERT INTO users (name, email) VALUES
    ('Alice', 'alice@example.com'),
    ('Bob', 'bob@example.com');

-- Bulk update via temp table
CREATE TEMP TABLE temp_updates (id INT, new_status TEXT);
INSERT INTO temp_updates VALUES (1, 'active'), (2, 'active');
UPDATE users u SET status = t.new_status FROM temp_updates t WHERE u.id = t.id;
```

### Materialized Views

```sql
CREATE MATERIALIZED VIEW user_order_summary AS
SELECT u.id, u.name, COUNT(o.id) as total_orders, SUM(o.total) as total_spent
FROM users u LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name;

CREATE INDEX ON user_order_summary(total_spent DESC);
REFRESH MATERIALIZED VIEW CONCURRENTLY user_order_summary;
```

## Monitoring

```sql
-- Slow queries (requires pg_stat_statements)
SELECT query, calls, mean_time FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;

-- Tables needing indexes (high seq_scan, low idx_scan)
SELECT tablename, seq_scan, idx_scan FROM pg_stat_user_tables WHERE seq_scan > 100 ORDER BY seq_scan DESC;

-- Unused indexes (wasting write performance)
SELECT indexname, idx_scan FROM pg_stat_user_indexes WHERE idx_scan = 0;
```

## Maintenance

```sql
ANALYZE users;          -- Update statistics
VACUUM ANALYZE orders;  -- Reclaim dead tuples + update stats
REINDEX INDEX idx_users_email; -- Rebuild bloated index
```

## Guidelines

- Too many indexes slow down writes. Index selectively.
- Keep statistics updated with ANALYZE.
- Use appropriate data types (smaller = better scan performance).
- Use connection pooling; reuse database connections.
- Functions in WHERE prevent index usage unless you have a matching expression index.
- `LIKE '%prefix'` (leading wildcard) cannot use a standard B-tree index.

---

# Query Optimization

## EXPLAIN Plan Analysis

```sql
-- PostgreSQL EXPLAIN ANALYZE
EXPLAIN (ANALYZE, BUFFERS, VERBOSE)
SELECT
    c.customer_id,
    c.name,
// ... (31 lines trimmed)

-- Check actual vs estimated rows
SELECT * FROM sys.dm_exec_query_stats;
```

## Index Design and Optimization

```sql
-- Covering index (all columns in index)
CREATE INDEX idx_orders_covering ON orders (
    customer_id,
    order_date
) INCLUDE (total, status);
// ... (32 lines trimmed)

CREATE INDEX idx_orders_metadata ON orders USING GIN (metadata jsonb_path_ops);
SELECT * FROM orders WHERE metadata @> '{"priority": "high"}';
```

## Index Maintenance

```sql
-- PostgreSQL: Find missing indexes
SELECT
    schemaname,
    tablename,
    seq_scan,
// ... (41 lines trimmed)
-- Update statistics
ANALYZE orders;
ANALYZE VERBOSE;  -- Show progress
```

## Query Rewriting Patterns

```sql
-- Avoid SELECT DISTINCT when possible
-- Bad: Forces sort/dedup
SELECT DISTINCT customer_id FROM orders WHERE status = 'active';

-- Good: Use EXISTS
// ... (53 lines trimmed)
FROM products p
LEFT JOIN reviews r ON p.product_id = r.product_id
GROUP BY p.product_id, p.name;
```

## Partitioning Strategies

```sql
-- Range partitioning by date (PostgreSQL)
CREATE TABLE orders (
    order_id SERIAL,
    customer_id INT,
    order_date DATE NOT NULL,
// ... (33 lines trimmed)
    FOR VALUES WITH (MODULUS 4, REMAINDER 0);
CREATE TABLE users_p1 PARTITION OF users
    FOR VALUES WITH (MODULUS 4, REMAINDER 1);
```

## Materialized Views

```sql
-- Create materialized view for expensive aggregations
CREATE MATERIALIZED VIEW daily_sales_summary AS
SELECT
    DATE_TRUNC('day', order_date) as day,
    COUNT(*) as order_count,
// ... (21 lines trimmed)
AFTER INSERT OR UPDATE OR DELETE ON orders
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_daily_sales();
```

## Query Hints and Optimization

```sql
-- PostgreSQL: Force index usage (use sparingly)
SET enable_seqscan = OFF;
SELECT /*+ IndexScan(orders idx_orders_customer) */ * FROM orders WHERE customer_id = 123;
SET enable_seqscan = ON;

// ... (15 lines trimmed)
-- PostgreSQL: Parallel query tuning
SET max_parallel_workers_per_gather = 4;
ALTER TABLE large_table SET (parallel_workers = 4);
```

## Performance Monitoring Queries

```sql
-- PostgreSQL: Find slow queries
SELECT
    query,
    calls,
    total_exec_time,
// ... (40 lines trimmed)
FROM pg_stat_user_tables
WHERE n_dead_tup > 1000
ORDER BY n_dead_tup DESC;
```

## Best Practices Checklist

1. Always run EXPLAIN ANALYZE before optimizing
2. Create indexes on foreign keys and WHERE/JOIN columns
3. Use covering indexes for frequent queries
4. Keep statistics up to date (ANALYZE regularly)
5. Avoid SELECT *, specify needed columns
6. Use EXISTS instead of IN for subqueries
7. Filter early, aggregate late
8. Consider partitioning for large tables (>10M rows)
9. Use materialized views for expensive aggregations
10. Monitor slow query log and pg_stat_statements

