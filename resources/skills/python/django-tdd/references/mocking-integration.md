# Mocking and Integration Testing

Use mocking to isolate external boundaries, and use integration tests to verify
that the whole flow still works together.

## Mock at the Boundary

Good mocking targets:
- payment gateways
- email transport
- third-party APIs
- queue or background job adapters

Bad mocking targets:
- your own internal logic
- ORM behavior you actually need to verify
- code paths whose integration is the thing under test

## Integration Tests

Use integration tests for:
- multi-step request flows
- database persistence checks
- auth and permission behavior
- full user-visible outcomes

They are the counterweight to over-mocking.

## Email Testing

Use the local-memory email backend or equivalent test backend so the test can
assert:
- message count
- recipient
- subject or key body content

## Design Rule

Prefer:
- unit tests with mocks for boundary behavior
- integration tests for system behavior

If a test needs many mocks to stand up a normal product flow, it is probably the
wrong test level.
