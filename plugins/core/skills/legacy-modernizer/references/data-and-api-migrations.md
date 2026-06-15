# Data and API Migrations

Use incremental compatibility patterns first.

## Common Approaches

- dual write during data-store migration
- expand and contract for schema evolution
- versioned APIs with clear deprecation windows

## Guardrails

- monitor drift between old and new representations
- keep rollback paths available until reads are fully cut over
- communicate API sunset timelines before removal
