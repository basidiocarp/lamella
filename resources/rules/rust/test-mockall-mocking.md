# test-mockall-mocking

> Use mockall for trait mocking

Prefer `mockall` when unit tests need to isolate a trait boundary from an
external collaborator.

## Prefer

- mock trait boundaries, not concrete implementations
- use mocks for external systems and side-effecting collaborators
- assert the behavior that matters: arguments, call count, ordering, or returned values
- keep expectations tight enough to catch regressions but not so specific that harmless refactors fail tests
- prefer real implementations or fakes in integration tests

## Avoid

- mocking pure functions or simple value objects
- using mocks where an in-memory fake is simpler
- asserting incidental sequencing unless order is part of the contract
- turning unit tests into `mockall` API demos

## Notes

- accept dependencies behind traits at construction boundaries
- use predicates or sequences only when the test actually depends on them
- keep mock configuration focused on the behavior under test

## See Also

- [test-mock-traits](./test-mock-traits.md) - Design traits for mocking
- [test-integration-dir](./test-integration-dir.md) - Prefer real systems in integration tests
