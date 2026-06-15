# Async Testing

Use async tests when your FastAPI app relies on async endpoints, async database
access, or dependency overrides that must run in an event loop.

## Core Setup

- use `httpx.AsyncClient` with `ASGITransport(app=app)`
- create a dedicated async test database session or override
- clear `app.dependency_overrides` after each test

## What to Test

- endpoint success and failure paths
- auth-required routes with and without credentials
- service-layer behavior that touches the async database
- dependency overrides and async mocks where integration tests would be too
  heavy

## Rules

- keep fixture scope explicit so app state does not leak between tests
- prefer real request/response tests for route behavior
- reserve `AsyncMock` for external boundaries or expensive dependencies
