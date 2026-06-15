# Endpoints & Routing

Use this reference for the basic FastAPI routing patterns: routers, dependency
aliases, validation, and response models.

## Router Structure

Use `APIRouter` to group related endpoints by feature or resource.

Typical pieces:
- prefix
- tags
- shared dependencies
- feature-local route definitions

Keep router modules small enough that the resource boundary is still obvious.

## Dependency Aliases

Annotated aliases help keep endpoint signatures readable for:
- database session access
- current user or auth checks
- common query and path validation patterns

Use them when the same dependency shape appears repeatedly.

## Endpoint Design

Common API concerns belong in the route layer:
- request validation
- auth and authorization checks
- status codes
- response models
- HTTP exception mapping

Push persistence and domain logic below the router so handlers stay thin.

## Query and Path Validation

Use `Query(...)` and `Path(...)` constraints when:
- values have bounded ranges
- enums or regex patterns matter
- the endpoint surface should fail fast on bad input

## Router Inclusion

Register feature routers in one place and keep the version prefix consistent.

This makes the API layout predictable and easier to audit.

## Response Models

Use response models to:
- control public output shape
- hide internal fields
- generate accurate API docs

If the response model is doing too much transformation, move that shaping logic
into serializers or mapping helpers.
