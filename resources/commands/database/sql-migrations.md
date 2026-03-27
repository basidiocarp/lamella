---
description: SQL database migrations with zero-downtime strategies for PostgreSQL, MySQL, SQL Server
version: "1.0.0"
tags:
  [
    database,
    sql,
    migrations,
    postgresql,
    mysql,
    flyway,
    liquibase,
    alembic,
    zero-downtime,
  ]
tool_access: [Read, Write, Edit, Bash, Grep, Glob]
---

# SQL Database Migration Strategy and Implementation

## Context

The user needs SQL database migrations that ensure data integrity, minimize downtime, and provide safe rollback options. Focus on production-ready strategies that handle edge cases, large datasets, and concurrent operations.

## Requirements

$ARGUMENTS

## Instructions

### 1. Zero-Downtime Migration Strategies

**Expand-Contract Pattern**

```sql
-- Phase 1: EXPAND (backward compatible)
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
CREATE INDEX CONCURRENTLY idx_users_email_verified ON users(email_verified);

-- Phase 2: MIGRATE DATA (in batches)
DO $$
DECLARE batch_size INT := 1000;
BEGIN
  LOOP
    WITH moved AS (
      INSERT INTO user_emails (user_id, email)
      SELECT id, email FROM users
      WHERE email IS NOT NULL
      LIMIT batch_size
      RETURNING user_id
    )
    EXIT WHEN NOT EXISTS (SELECT 1 FROM moved);
  END LOOP;
END $$;
-- Phase 3: CONTRACT (after code deployment)
ALTER TABLE users DROP COLUMN email_confirmation_token;
```

**Blue-Green Schema Migration**

```sql
-- Step 1: Create new schema version
CREATE TABLE v2_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DO $$
BEGIN
  FOR i IN 1..10 LOOP
    INSERT INTO orders (id, customer_id, total_amount, status)
    VALUES (gen_random_uuid(), gen_random_uuid(), 100.00 + i, 'pending');
  END LOOP;
    END LOOP;
END $$;
```

**Online Schema Change**

```sql
-- PostgreSQL: Add NOT NULL safely
-- Step 1: Add column as nullable
ALTER TABLE large_table ADD COLUMN new_field VARCHAR(100);

-- Step 2: Backfill data
UPDATE large_table
SET new_field = 'default_value'
WHERE new_field IS NULL;

-- Step 3: Add constraint (PostgreSQL 12+)
ALTER TABLE large_table
    ADD CONSTRAINT chk_new_field_not_null
    CHECK (new_field IS NOT NULL) NOT VALID;

ALTER TABLE large_table
    VALIDATE CONSTRAINT chk_new_field_not_null;
```

### 2. Migration Scripts

**Flyway Migration**

```sql
-- V001__add_user_preferences.sql
BEGIN;

CREATE TABLE IF NOT EXISTS user_preferences (
    user_id UUID PRIMARY KEY,
    theme VARCHAR(20) DEFAULT 'light' NOT NULL,
    email_notifications BOOLEAN DEFAULT true NOT NULL,
    timezone VARCHAR(64) DEFAULT 'UTC' NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMIT;
```

**Alembic Migration (Python)**

```python
"""add_user_preferences

Revision ID: 001_user_prefs
"""
from alembic import op
import sqlalchemy as sa
def upgrade():
    op.create_table(
        'user_preferences',
        sa.Column('user_id', sa.Uuid(), primary_key=True),
        sa.Column('theme', sa.String(length=20), nullable=False, server_default='light'),
        sa.Column('email_notifications', sa.Boolean(), nullable=False, server_default=sa.true()),
    )

def downgrade():
    op.drop_table('user_preferences')
```

### 3. Data Integrity Validation

```python
def validate_pre_migration(db_connection):
    checks = []

    # Check 1: NULL values in critical columns
    null_check = db_connection.execute("""
        SELECT table_name, COUNT(*) as null_count
        FROM some_validation_view
        GROUP BY table_name
    """)

    validations["null_checks"] = list(null_check)
    validations["status"] = "pass" if not validations["null_checks"] else "review"

    return validations
```

### 4. Rollback Procedures

```python
import psycopg2
from contextlib import contextmanager

class MigrationRunner:
    def __init__(self, db_config):
        self.db_config = db_config
        self.conn = None

    def run(self, sql_file):
        try:
            self.conn = self.connect()
            self.apply(sql_file)
            self.verify()
        except Exception:
            self.rollback_from_snapshot()
            raise
```

**Rollback Script**

```bash
#!/bin/bash
# rollback_migration.sh

set -e

MIGRATION_VERSION=$1
if [[ -z "${MIGRATION_VERSION:-}" ]]; then
  echo "Usage: $0 <migration-version>"
  exit 1
fi

echo "Running migration ${MIGRATION_VERSION}"
python3 scripts/run_migration.py "$MIGRATION_VERSION"
    exit 1
fi
```

### 5. Performance Optimization

**Batch Processing**

```python
class BatchMigrator:
    def __init__(self, db_connection, batch_size=10000):
        self.db = db_connection
        self.batch_size = batch_size

    def migrate_large_table(self, source_query, target_query, cursor_column='id'):
        cursor = None
        batch_number = 0
        while True:
            rows = self.fetch_batch(source_query, cursor, cursor_column)
            if not rows:
                break
            self.write_batch(target_query, rows)
            cursor = rows[-1][cursor_column]
            batch_number += 1
            print(f"Batch {batch_number}: {len(rows)} rows")
            time.sleep(0.1)
```

**Parallel Migration**

```python
from concurrent.futures import ThreadPoolExecutor

class ParallelMigrator:
    def __init__(self, db_config, num_workers=4):
        self.db_config = db_config
        self.num_workers = num_workers
        self.pool = ThreadPoolExecutor(max_workers=num_workers)

    def run_parallel(self, tasks):
        futures = [self.pool.submit(task) for task in tasks]
        for future in futures:
            future.result()

        conn.close()
```

### 6. Index Management

```sql
-- Drop indexes before bulk insert, recreate after
CREATE TEMP TABLE migration_indexes AS
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'large_table'
  AND indexname NOT LIKE '%pkey%';
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename = 'large_table'
      AND indexname = 'idx_large_table_created_at'
  ) THEN
    CREATE INDEX CONCURRENTLY idx_large_table_created_at
      ON large_table (created_at);
  END IF;
    END LOOP;
END $$;
```

## Output Format

1. **Migration Analysis Report**: Detailed breakdown of changes
2. **Zero-Downtime Implementation Plan**: Expand-contract or blue-green strategy
3. **Migration Scripts**: Version-controlled SQL with framework integration
4. **Validation Suite**: Pre and post-migration checks
5. **Rollback Procedures**: Automated and manual rollback scripts
6. **Performance Optimization**: Batch processing, parallel execution
7. **Monitoring Integration**: Progress tracking and alerting

Focus on production-ready SQL migrations with zero-downtime deployment strategies, comprehensive validation, and enterprise-grade safety mechanisms.

## Related Plugins

- **nosql-migrations**: Migration strategies for MongoDB, DynamoDB, Cassandra
- **migration-observability**: Real-time monitoring and alerting
- **migration-integration**: CI/CD integration and automated testing
