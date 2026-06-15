# ORM and Query Migration

Treat persistence migration as its own track.

## Typical Moves

- Django ORM models -> SQLAlchemy models or another explicit persistence layer
- serializer-side validation -> Pydantic validation
- `select_related` or `prefetch_related` patterns -> explicit eager-loading
  equivalents

## Rule

Keep query semantics and transaction boundaries visible during the migration so
performance regressions are easier to spot.
