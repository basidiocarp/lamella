# Database Design

## Normalization Levels

```sql
-- 1NF: Atomic values, no repeating groups
-- Bad: Non-atomic phone column
CREATE TABLE customers_bad (
    customer_id INT PRIMARY KEY,
    name VARCHAR(100),
// ... (64 lines trimmed)
    street VARCHAR(200) NOT NULL,
    zip_code VARCHAR(10) NOT NULL REFERENCES zip_codes(zip_code)
);
```

## Primary and Foreign Keys

```sql
-- Natural vs Surrogate keys
-- Natural key (business meaning)
CREATE TABLE countries (
    country_code CHAR(2) PRIMARY KEY,  -- ISO 3166-1 alpha-2
    country_name VARCHAR(100) NOT NULL
// ... (46 lines trimmed)
    FOREIGN KEY (product_id) REFERENCES products(product_id)
        ON DELETE RESTRICT  -- Prevent deleting product if used in orders
);
```

## Constraints and Validation

```sql
-- CHECK constraints
CREATE TABLE employees (
    employee_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
// ... (39 lines trimmed)
        booked_during WITH &&
    )  -- Prevent overlapping bookings for same room
);
```

## Indexing Strategy

```sql
-- Index foreign keys (critical for JOIN performance)
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

// ... (11 lines trimmed)
CREATE UNIQUE INDEX idx_users_active_email ON users(LOWER(email))
WHERE deleted_at IS NULL;
-- Ensures no duplicate emails among active users
```

## Common Design Patterns

```sql
-- Polymorphic associations (flexible but harder to enforce integrity)
CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    commentable_type VARCHAR(50) NOT NULL,  -- 'Post', 'Photo', 'Video'
    commentable_id INT NOT NULL,
// ... (58 lines trimmed)
    (2, 'Computers', 1, 1),
    (3, 'Laptops', 2, 2),
    (4, 'Desktops', 2, 2);
```

## Temporal/Historical Data

```sql
-- Slowly Changing Dimension Type 2 (SCD2) - Full history
CREATE TABLE customer_history (
    customer_history_id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
// ... (23 lines trimmed)
CREATE TRIGGER versioning_trigger
BEFORE INSERT OR UPDATE OR DELETE ON products
FOR EACH ROW EXECUTE FUNCTION versioning('sys_period', 'products_history', true);
```

## Soft Deletes

```sql
-- Soft delete pattern
CREATE TABLE posts (
    post_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
// ... (13 lines trimmed)
SELECT post_id, title, content, author_id, created_at, updated_at
FROM posts
WHERE deleted_at IS NULL;
```

## Audit Trails

```sql
-- Audit table pattern
CREATE TABLE audit_log (
    audit_id BIGSERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id BIGINT NOT NULL,
// ... (30 lines trimmed)
CREATE TRIGGER products_audit
AFTER INSERT OR UPDATE OR DELETE ON products
FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
```

## Schema Design Best Practices

1. **Choose appropriate data types**: Use smallest type that fits (INT vs BIGINT, VARCHAR(50) vs TEXT)
2. **Index foreign keys**: Always index FK columns for JOIN performance
3. **Avoid NULLs when possible**: Use NOT NULL with defaults
4. **Use constraints**: Enforce data integrity at database level
5. **Normalize to 3NF**: Then denormalize strategically for performance
6. **Consider soft deletes**: For auditing and data recovery
7. **Plan for growth**: Use BIGINT for high-volume PKs
8. **Document schema**: Comment tables and complex constraints
9. **Version control**: Track schema changes with migrations
10. **Test with realistic data**: Validate design with production-scale data
