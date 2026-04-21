---
name: postgresql
description: "Designs PostgreSQL schemas and database patterns."
origin: lamella
---

# PostgreSQL Table Design


## Contents

- [Core Rules](#core-rules)
- [PostgreSQL Gotchas](#postgresql-gotchas)
- [Data Types](#data-types)
- [Table Types](#table-types)
- [Row-Level Security](#row-level-security)
- [Constraints](#constraints)
- [Indexing](#indexing)
- [Partitioning](#partitioning)
- [Special Considerations](#special-considerations)
- [Generated Columns](#generated-columns)
- [Extensions](#extensions)
- [JSONB Guidance](#jsonb-guidance)
- [Examples](#examples)

## Core Rules

Use `database-schema-designer` first when the main problem is entity modeling,
migration sequencing, or ERD design from requirements. Use this skill when the
schema already exists and the next step is PostgreSQL-specific design.

- Define a PRIMARY KEY for reference tables. Not always needed for time-series/event/log data. Prefer `BIGINT GENERATED ALWAYS AS IDENTITY`; use `UUID` only when global uniqueness/opacity is needed.
- Normalize first (to 3NF); denormalize only for measured, high-ROI reads where join performance is proven problematic.
- Add NOT NULL everywhere it's semantically required; use DEFAULTs for common values.
- Create indexes for access paths you actually query: PK/unique (auto), FK columns (manual!), frequent filters/sorts, and join keys.
- Prefer TIMESTAMPTZ for event time; NUMERIC for money; TEXT for strings; BIGINT for integers; DOUBLE PRECISION for floats (or NUMERIC for exact decimal).

## PostgreSQL Gotchas

- Unquoted identifiers are lowercased. Use `snake_case`, avoid quoted/mixed-case names.
- UNIQUE allows multiple NULLs. Use `NULLS NOT DISTINCT` (PG15+) to restrict to one NULL.
- PostgreSQL does not auto-index FK columns. Add them manually.
- Length/precision overflows error out (no silent truncation).
- Sequences/identity have gaps from rollbacks and concurrency. This is normal -- don't try to make IDs consecutive.
- No clustered PK by default (unlike SQL Server/InnoDB). `CLUSTER` is a one-off reorganization.
- MVCC updates/deletes leave dead tuples; vacuum handles them. Avoid hot wide-row churn.

## Data Types

- IDs: `BIGINT GENERATED ALWAYS AS IDENTITY` preferred. `UUID` for distributed/federated systems. Generate with `uuidv7()` (PG18+) or `gen_random_uuid()`.
- Integers: prefer BIGINT unless storage is critical.
- Floats: DOUBLE PRECISION over REAL. Use NUMERIC for exact decimal.
- Strings: TEXT always. Length limits via `CHECK (LENGTH(col) <= n)` not `VARCHAR(n)`. BYTEA for binary. Case-insensitive: expression index on `LOWER(col)` (preferred) or CITEXT.
- Money: `NUMERIC(p,s)` -- never float.
- Time: TIMESTAMPTZ for timestamps, DATE for date-only, INTERVAL for durations. `now()` = transaction start; `clock_timestamp()` = wall-clock.
- Booleans: BOOLEAN with NOT NULL unless tri-state needed.
- Enums: `CREATE TYPE ... AS ENUM` for small stable sets (US states). For evolving business values (order statuses) use TEXT + CHECK or lookup table.
- Arrays: `TEXT[]`, `INTEGER[]`, etc. Index with GIN for containment/overlap. Good for tags; avoid for relations -- use junction tables.
- Ranges: `daterange`, `numrange`, `tstzrange`. Index with GiST. Prefer `[)` bounds consistently.
- Network: INET for IPs, CIDR for network ranges, MACADDR.
- Text search: TSVECTOR + GIN index. Always specify language: `to_tsvector('english', col)`.
- Domain types: `CREATE DOMAIN email AS TEXT CHECK (VALUE ~ '^[^@]+@[^@]+$')` for reusable validated types.
- Composite types: `CREATE TYPE address AS (street TEXT, city TEXT, zip TEXT)`. Access with `(col).field`.
- JSONB: preferred over JSON; index with GIN. Use only for optional/semi-structured attrs.
- Vector: `vector` type via pgvector for embedding similarity search.

### Do Not Use

- `timestamp` (without tz) -- use `timestamptz`
- `char(n)` or `varchar(n)` -- use `text`
- `money` type -- use `numeric`
- `timetz` -- use `timestamptz`
- `timestamptz(0)` or any precision -- use `timestamptz`
- `serial` -- use `generated always as identity`

## Table Types

- Regular: default, fully durable, logged.
- TEMPORARY: session-scoped, auto-dropped, not logged. Faster for scratch work.
- UNLOGGED: persistent but not crash-safe. Faster writes; good for caches/staging.

## Row-Level Security

`ALTER TABLE tbl ENABLE ROW LEVEL SECURITY` then `CREATE POLICY user_access ON orders FOR SELECT TO app_users USING (user_id = current_user_id())`.

## Constraints

- PK: implicit UNIQUE + NOT NULL; creates B-tree index.
- FK: specify `ON DELETE/UPDATE` action. Add explicit index on referencing column. Use `DEFERRABLE INITIALLY DEFERRED` for circular dependencies.
- UNIQUE: creates B-tree; allows multiple NULLs unless `NULLS NOT DISTINCT` (PG15+).
- CHECK: row-local; NULL values pass (three-valued logic). Combine with NOT NULL to enforce.
- EXCLUDE: prevents overlapping values. `EXCLUDE USING gist (room_id WITH =, booking_period WITH &&)` prevents double-booking.

## Indexing

- B-tree: default for equality/range (`=`, `<`, `>`, `BETWEEN`, `ORDER BY`).
- Composite: leftmost prefix required. `WHERE a = ? AND b > ?` uses `(a,b)`, but `WHERE b = ?` does not.
- Covering: `CREATE INDEX ON tbl (id) INCLUDE (name, email)` for index-only scans.
- Partial: `CREATE INDEX ON tbl (user_id) WHERE status = 'active'` for hot subsets.
- Expression: `CREATE INDEX ON tbl (LOWER(email))`. Expression must match exactly in WHERE.
- GIN: JSONB containment/existence, arrays, full-text search.
- GiST: ranges, geometry, exclusion constraints.
- BRIN: very large naturally ordered data (time-series). Minimal storage.

## Partitioning

Use for very large tables (>100M rows) or periodic data maintenance (bulk prune/replace).

- RANGE: common for time-series. `PARTITION BY RANGE (created_at)`.
- LIST: for discrete values. `PARTITION BY LIST (region)`.
- HASH: for even distribution. `PARTITION BY HASH (user_id)`.
- Prefer declarative partitioning or TimescaleDB hypertables. Do NOT use table inheritance.
- No global UNIQUE constraints -- include partition key in PK/UNIQUE.

## Special Considerations

### Update-Heavy Tables
- Separate hot/cold columns to minimize bloat.
- Use `fillfactor=90` to leave space for HOT updates.
- Avoid updating indexed columns (prevents HOT updates).

### Insert-Heavy Workloads
- Minimize indexes -- only create what you query.
- Use COPY or multi-row INSERT, not single-row inserts.
- UNLOGGED tables for rebuildable staging data.
- Defer index creation for bulk loads.
- Natural keys (timestamp, device_id) often better than surrogates for insert-heavy tables.

### Upsert-Friendly Design
- Requires UNIQUE index on conflict target columns.
- Use `EXCLUDED.column` to reference would-be-inserted values.
- `DO NOTHING` faster than `DO UPDATE` when no update needed.

### Safe Schema Evolution
- Transactional DDL: most DDL can run in transactions and be rolled back.
- `CREATE INDEX CONCURRENTLY` avoids blocking writes but cannot run in transactions.
- Adding NOT NULL columns with volatile defaults (e.g., `now()`) rewrites the entire table.
- `CREATE OR REPLACE FUNCTION` with different arguments creates overloads, not replacements.

## Generated Columns

`... GENERATED ALWAYS AS (<expr>) STORED` for computed, indexable fields. PG18+ adds VIRTUAL columns.

## Extensions

- pg_trgm: fuzzy text search with GIN for `LIKE '%pattern%'`.
- timescaledb: automated partitioning, retention, compression, continuous aggregates for time-series.
- postgis: geospatial beyond basic geometric types.
- pgvector: vector similarity search for embeddings.
- pgcrypto: `crypt()` for password hashing.
- btree_gin/btree_gist: mixed-type indexes (e.g., GIN on both JSONB and text).
- pgaudit: audit logging.

## JSONB Guidance

- Default GIN index: `CREATE INDEX ON tbl USING GIN (jsonb_col);` -- accelerates containment (`@>`), key existence (`?`, `?|`, `?&`).
- Heavy containment workloads: `jsonb_path_ops` opclass for smaller/faster containment-only indexes (loses key existence support).
- Scalar field equality/range: extract to generated column + B-tree index.
- Keep core relations in tables; use JSONB for optional/variable attributes.
- Constrain structure: `config JSONB NOT NULL CHECK(jsonb_typeof(config) = 'object')`.

## Examples

### Users

```sql
CREATE TABLE users (
  user_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX ON users (LOWER(email));
CREATE INDEX ON users (created_at);
```

### Orders

```sql
CREATE TABLE orders (
  order_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(user_id),
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','PAID','CANCELED')),
  total NUMERIC(10,2) NOT NULL CHECK (total > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ON orders (user_id);
CREATE INDEX ON orders (created_at);
```

### JSONB

```sql
CREATE TABLE profiles (
  user_id BIGINT PRIMARY KEY REFERENCES users(user_id),
  attrs JSONB NOT NULL DEFAULT '{}',
  theme TEXT GENERATED ALWAYS AS (attrs->>'theme') STORED
);
CREATE INDEX profiles_attrs_gin ON profiles USING GIN (attrs);
```
