# Async SQLAlchemy

Use this reference for the standard FastAPI + SQLAlchemy async stack.

## Engine and Session

Core pieces:
- `create_async_engine(...)`
- `async_sessionmaker(...)`
- `AsyncSession`
- declarative base for models

Keep engine configuration in one place and expose a single session dependency to
the app.

## Session Dependency

The common pattern is:
- open session
- yield it to the request
- commit on success
- rollback on exception

Keep transaction boundaries obvious. Do not spread commit logic across handlers
and helpers arbitrarily.

## Query Patterns

Common async patterns:
- `select(...)` with `await session.execute(...)`
- `scalar_one_or_none()` for single-row fetches
- `scalars().all()` for collections
- `selectinload(...)` for eager loading

Prefer explicit query shapes over hidden lazy loading in request handlers.

## CRUD Guidance

- create: `session.add(...)` plus `flush()` when you need generated IDs before
  commit
- update: load and mutate the object, or use explicit update expressions where
  appropriate
- delete: explicit delete plus affected-row or existence handling

Consistency matters more than which update style you choose.

## Lifespan

Use the app lifespan to initialize and dispose of async database resources.

Only create tables on startup in local or controlled environments. Production
schema changes should go through migrations, not app boot.

## Design Rules

- one session per request by default
- eager load intentionally
- avoid implicit blocking calls inside async routes
- keep migrations separate from runtime setup
- centralize transaction handling

This is the baseline async SQLAlchemy pattern, not a replacement for detailed
query or migration guidance.
