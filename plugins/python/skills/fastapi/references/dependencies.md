# Dependency Injection

Use FastAPI dependencies for shared request-time logic, resource lifecycle, and
sub-dependency wiring.

## Good Uses

- auth and permission checks
- database sessions and other managed resources
- request-derived values such as headers, tenants, or pagination
- reusable validation that does not belong in a Pydantic model

## Yield Dependencies

- use `yield` when setup and cleanup must be paired
- keep the default request scope unless cleanup must run before the response is
  sent
- keep teardown predictable and side-effect free

## Class Guidance

- prefer plain function dependencies that return configured objects
- use class instances only when stateful behavior is genuinely needed
- avoid turning dependency injection into a framework inside the framework
