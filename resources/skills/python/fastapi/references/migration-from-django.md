# Django to FastAPI Migration

Use this page as the routing layer for Django or DRF migrations into FastAPI.

## Load Order

| Need | Reference |
| --- | --- |
| serializer, router, and request-shape migration | `schema-and-routing-migration.md` |
| ORM model, query, and persistence migration | `orm-and-query-migration.md` |
| authentication, testing, and rollout strategy | `auth-testing-and-rollout.md` |

## Core Rules

- migrate one boundary at a time instead of rewriting the whole service
- separate schema migration from persistence migration
- keep a strangler or coexistence plan until the new endpoints are proven
