# Database Design

## Normalization

```sql
CREATE TABLE customers (
    customer_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE customer_phones (
    customer_id BIGINT NOT NULL REFERENCES customers(customer_id),
    phone_number VARCHAR(30) NOT NULL,
    PRIMARY KEY (customer_id, phone_number)
);
```

Normalize repeating values into separate tables before adding denormalized
shortcuts.

## Primary and Foreign Keys

```sql
CREATE TABLE countries (
    country_code CHAR(2) PRIMARY KEY,
    country_name VARCHAR(100) NOT NULL
);

CREATE TABLE orders (
    order_id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL REFERENCES customers(customer_id)
);
```

## Constraints

```sql
CREATE TABLE employees (
    employee_id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    salary NUMERIC(12,2) NOT NULL CHECK (salary >= 0),
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'inactive'))
);
```

## Indexing Strategy

```sql
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

CREATE UNIQUE INDEX idx_users_active_email
ON users (LOWER(email))
WHERE deleted_at IS NULL;
```

## Temporal and Soft Deletes

```sql
CREATE TABLE posts (
    post_id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    deleted_at TIMESTAMPTZ
);

CREATE VIEW active_posts AS
SELECT post_id, title
FROM posts
WHERE deleted_at IS NULL;
```

## Audit Trail

```sql
CREATE TABLE audit_log (
    audit_id BIGSERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id BIGINT NOT NULL,
    action VARCHAR(20) NOT NULL,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## Best Practices

1. Choose the smallest data type that fits realistic growth.
2. Index foreign keys and common filter paths.
3. Use constraints to enforce integrity at the database layer.
4. Normalize first, then denormalize deliberately for performance.
