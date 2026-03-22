# Database Dialect Differences

## Auto-Incrementing Primary Keys

```sql
-- PostgreSQL
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,  -- or BIGSERIAL for BIGINT
    name VARCHAR(100)
);
// ... (26 lines trimmed)
    user_id NUMBER DEFAULT user_id_seq.NEXTVAL PRIMARY KEY,
    name VARCHAR2(100)
);
```

## String Concatenation

```sql
-- PostgreSQL (strict - automatic casting)
SELECT first_name || ' ' || last_name AS full_name FROM users;
SELECT CONCAT(first_name, ' ', last_name) AS full_name FROM users;  -- NULL-safe

-- MySQL (automatic type conversion)
SELECT CONCAT(first_name, ' ', last_name) AS full_name FROM users;
SELECT first_name + ' ' + last_name FROM users;  -- ERROR in MySQL

-- SQL Server
SELECT first_name + ' ' + last_name AS full_name FROM users;
SELECT CONCAT(first_name, ' ', last_name) AS full_name FROM users;  -- 2012+

-- Oracle
SELECT first_name || ' ' || last_name AS full_name FROM users;
SELECT CONCAT(first_name, last_name) FROM users;  -- Only 2 arguments!
```

## Date/Time Functions

```sql
-- Current timestamp
-- PostgreSQL
SELECT CURRENT_TIMESTAMP, NOW(), CURRENT_DATE, CURRENT_TIME;

-- MySQL
// ... (39 lines trimmed)

-- Oracle
SELECT TO_CHAR(order_date, 'YYYY-MM-DD') FROM orders;
```

## LIMIT/OFFSET (Pagination)

```sql
-- PostgreSQL & MySQL
SELECT * FROM products
ORDER BY product_id
LIMIT 10 OFFSET 20;

// ... (22 lines trimmed)
    WHERE ROWNUM <= 30
)
WHERE rnum > 20;
```

## Boolean Data Type

```sql
-- PostgreSQL (native BOOLEAN)
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    is_active BOOLEAN DEFAULT true
);
// ... (19 lines trimmed)
    is_active NUMBER(1) DEFAULT 1 CHECK (is_active IN (0, 1))
);
SELECT * FROM users WHERE is_active = 1;
```

## JSON/JSONB Support

```sql
-- PostgreSQL (JSONB - binary, indexable)
CREATE TABLE events (
    event_id SERIAL PRIMARY KEY,
    event_data JSONB NOT NULL
);
// ... (34 lines trimmed)

SELECT JSON_VALUE(event_data, '$.user_id') as user_id FROM events;
SELECT * FROM events WHERE JSON_EXISTS(event_data, '$.action?(@ == "login")');
```

## String Comparison (Case Sensitivity)

```sql
-- PostgreSQL (case-sensitive by default)
SELECT * FROM users WHERE email = 'USER@EXAMPLE.COM';  -- Won't match 'user@example.com'
SELECT * FROM users WHERE LOWER(email) = LOWER('USER@EXAMPLE.COM');
SELECT * FROM users WHERE email ILIKE 'user@example.com';  -- Case-insensitive

// ... (8 lines trimmed)
-- Oracle (case-sensitive by default)
SELECT * FROM users WHERE email = 'USER@EXAMPLE.COM';  -- Won't match 'user@example.com'
SELECT * FROM users WHERE UPPER(email) = UPPER('user@example.com');
```

## Recursive CTEs

```sql
-- PostgreSQL
WITH RECURSIVE subordinates AS (
    SELECT employee_id, name, manager_id, 1 as level
    FROM employees WHERE manager_id IS NULL
    UNION ALL
// ... (30 lines trimmed)
FROM employees
START WITH manager_id IS NULL
CONNECT BY PRIOR employee_id = manager_id;
```

## Window Functions - Frame Specifications

```sql
-- PostgreSQL - Full support
SELECT
    order_date,
    total,
    SUM(total) OVER (
// ... (31 lines trimmed)
        RANGE BETWEEN INTERVAL '7' DAY PRECEDING AND CURRENT ROW
    ) as rolling_7day
FROM orders;
```

## UPSERT (Insert or Update)

```sql
-- PostgreSQL (ON CONFLICT)
INSERT INTO products (product_id, name, price)
VALUES (123, 'Widget', 29.99)
ON CONFLICT (product_id)
DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price;
// ... (27 lines trimmed)
WHEN NOT MATCHED THEN
    INSERT (product_id, name, price)
    VALUES (source.product_id, source.name, source.price);
```

## Data Type Mapping

| Concept | PostgreSQL | MySQL | SQL Server | Oracle |
|---------|-----------|-------|------------|--------|
| Integer | INT, BIGINT | INT, BIGINT | INT, BIGINT | NUMBER(10), NUMBER(19) |
| Decimal | NUMERIC, DECIMAL | DECIMAL | DECIMAL, NUMERIC | NUMBER(p,s) |
| String | VARCHAR, TEXT | VARCHAR, TEXT | VARCHAR, NVARCHAR | VARCHAR2, CLOB |
| Binary | BYTEA | BLOB, BINARY | VARBINARY, IMAGE | BLOB, RAW |
| Boolean | BOOLEAN | BOOLEAN/TINYINT(1) | BIT | NUMBER(1) |
| Date | DATE | DATE | DATE | DATE |
| Timestamp | TIMESTAMP | DATETIME, TIMESTAMP | DATETIME, DATETIME2 | TIMESTAMP |
| UUID | UUID | CHAR(36), BINARY(16) | UNIQUEIDENTIFIER | RAW(16) |
| JSON | JSON, JSONB | JSON | NVARCHAR(MAX) | CLOB |
| Array | ARRAY | JSON | Table variable | VARRAY, nested table |

## Performance Tips by Database

**PostgreSQL:**
- Use EXPLAIN ANALYZE with BUFFERS
- Leverage JSONB with GIN indexes
- Use parallel query settings for large scans
- Vacuum and analyze regularly
- Consider table partitioning for 10M+ rows

**MySQL:**
- Choose InnoDB over MyISAM
- Optimize buffer pool size
- Use covering indexes aggressively
- Be aware of case-insensitive defaults
- Consider read replicas for scaling

**SQL Server:**
- Update statistics regularly
- Use columnstore indexes for warehousing
- Leverage query hints sparingly
- Monitor execution plans
- Use In-Memory OLTP for hot tables

**Oracle:**
- Use EXPLAIN PLAN
- Leverage partitioning features
- Use bind variables to avoid parsing
- Configure SGA/PGA appropriately
- Consider Real Application Clusters (RAC)
