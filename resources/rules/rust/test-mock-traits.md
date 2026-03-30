# test-mock-traits

> Use traits for dependencies to enable mocking in tests

Hide external collaborators behind traits when unit tests need isolation.

## Prefer

- trait boundaries around databases, HTTP clients, clocks, and other external systems
- simple fakes when they express behavior more clearly than strict mocks
- generic or trait-object injection at the service boundary

## Avoid

- concrete infrastructure types wired directly into business logic
- mocking internal pure logic that does not need a seam
- trait abstractions introduced only for tests when the code does not actually need isolation

## See Also

- [test-mockall-mocking](./test-mockall-mocking.md) - Use `mockall` when strict expectations help
- [test-integration-dir](./test-integration-dir.md) - Prefer real systems in integration tests
