# ViewSets & Views

Use this reference to choose between DRF viewsets, generic views, and async
views.

## `ModelViewSet`

Use `ModelViewSet` when the resource fits the standard CRUD shape and the custom
behavior is still small.

Typical extension points:
- `get_queryset()`
- `get_serializer_class()`
- `perform_create()` / `perform_update()`
- `@action()` for a small number of extra endpoints

If the custom actions start to dominate the resource, the viewset is probably
too broad.

## Generic Views

Use DRF generic views when the endpoint is simple and you do not need the full
viewset surface.

Good fits:
- list/create
- retrieve/update/destroy
- narrow resource endpoints with one serializer and one queryset

They are often clearer than a large viewset for small APIs.

## Async Views

Use Django async views only when the stack is actually async-aware:
- async ORM or async-safe access paths
- async clients or external I/O
- request handlers that benefit from non-blocking waits

Do not wrap sync-heavy code in async syntax and assume it is automatically
better.

## URL Shape

Use routers for conventional resource APIs. Use explicit URLs when:
- the route is unusual
- the endpoint is not really CRUD
- readability matters more than automatic wiring

## Pagination

Set a project-level default, then override only for endpoints with different
payload or usage patterns.

Pagination policy should be consistent across similar list endpoints.

## Selection Guide

| Need | Better default |
|---|---|
| standard CRUD resource | `ModelViewSet` |
| simple narrow endpoint | generic view |
| custom async request path | async view |
| one-off business action | explicit endpoint or small `@action()` |

Use the smallest view abstraction that still keeps the API readable.
