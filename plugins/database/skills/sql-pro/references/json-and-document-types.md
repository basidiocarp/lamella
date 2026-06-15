# JSON and Document Types Across Dialects

Use this reference when moving JSON queries between engines.

## Key Differences

- PostgreSQL `JSONB` is binary, indexable, and feature-rich
- MySQL JSON support uses different function names and path behavior
- SQL Server uses JSON functions over text storage
- Oracle JSON support varies by version and storage model

## Guardrail

Do not port JSON filters mechanically. Re-check path syntax, indexing support, and operator semantics for each target engine.
