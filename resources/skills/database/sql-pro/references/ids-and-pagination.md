# IDs and Pagination Across Dialects

Use this reference for identity columns and row-limiting differences.

## Auto-Increment Variants

```sql
-- PostgreSQL
user_id BIGSERIAL PRIMARY KEY

-- MySQL
user_id BIGINT AUTO_INCREMENT PRIMARY KEY

-- SQL Server
user_id BIGINT IDENTITY(1,1) PRIMARY KEY
```

## Pagination Differences

```sql
-- PostgreSQL / MySQL
LIMIT 10 OFFSET 20

-- SQL Server
OFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY
```
