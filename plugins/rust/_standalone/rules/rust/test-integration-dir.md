# test-integration-dir

> Put integration tests in the `tests/` directory

Use `tests/` for public-API and crate-boundary behavior.

## Prefer

- integration tests that exercise the crate the way downstream callers use it
- one file or module per major scenario or feature area
- helper modules only when they reduce repetition without hiding intent

## Avoid

- reaching into private implementation details from integration tests
- moving unit tests into `tests/` just to make them compile
- huge end-to-end suites when a narrower integration test proves the contract

## See Also

- [test-cfg-test-module](./test-cfg-test-module.md) - Keep unit tests near the implementation
- [test-doctest-examples](./test-doctest-examples.md) - Keep docs executable too
