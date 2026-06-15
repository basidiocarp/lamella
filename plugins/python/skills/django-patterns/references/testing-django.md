# Testing Django

Use a small set of Django testing patterns consistently instead of mixing every
available style in one suite.

## Common Patterns

- `TestCase` for model and service behavior
- `APITestCase` or the project’s API test stack for endpoint behavior
- fixtures or factories for repeatable setup
- targeted auth tests for JWT or session-protected endpoints

## Rules

- prefer factories over large fixture blobs when tests need variation
- keep API tests focused on status, payload, and permission behavior
- make auth setup explicit so protected endpoints are easy to reason about

## Minimal Matrix

| Layer | Good Tool |
| --- | --- |
| models and validation | `TestCase` |
| API endpoints | `APITestCase` |
| reusable setup | factories or focused fixtures |
| auth behavior | explicit token or login helpers |
