# Additional Django Patterns

Use this reference for the common “beyond models and views” patterns that show
up in production Django apps.

## Service Layer

Use a service layer when business logic spans models, side effects, or
transactions.

Good fits:
- order placement or fulfillment
- billing or subscription changes
- multi-model write flows
- logic that should not live in serializers or views

Keep services:
- transaction-aware
- explicit about side effects
- separate from transport concerns

## Caching

Choose the narrowest cache that solves the problem:
- view-level caching for coarse public responses
- template-fragment caching for repeated expensive blocks
- low-level cache access for derived query results or computed data

Rules:
- cache stable, read-heavy data
- name keys predictably
- define invalidation strategy before adding the cache

## Signals

Signals are useful for loose coupling, but easy to overuse.

Good fits:
- profile creation after user creation
- analytics or audit hooks
- cross-app notifications that do not need synchronous return values

Bad fits:
- critical business logic
- hidden write chains
- behavior that must be obvious from the calling code

## Middleware

Use middleware for request/response cross-cutting concerns:
- request timing
- auth or tenant context injection
- correlation IDs
- global access policy enforcement

Keep middleware small and observable. Heavy business logic belongs elsewhere.

## Performance Defaults

Start with:
- `select_related` for foreign keys
- `prefetch_related` for many-to-many or reverse relations
- indexes that match actual filter and ordering patterns
- bulk operations for large batches

Do not add caching or middleware before fixing obvious query-shape problems.

## Selection Guide

| Need | Better pattern |
|---|---|
| multi-model domain logic | service layer |
| repeated read-heavy output | caching |
| loose side-effect hook | signal |
| request-wide cross-cutting concern | middleware |
| slow ORM access | query optimization first |

Use these as routing patterns, then split deeper examples into dedicated refs if
one area grows again.
