# test-fixture-raii

> Use RAII pattern (`Drop`) for automatic test cleanup

Prefer fixtures that clean themselves up automatically when the test scope ends.

## Prefer

- `Drop`-based cleanup for temp dirs, env overrides, servers, and other scoped resources
- fixtures that make teardown hard to forget
- explicit setup APIs with predictable cleanup semantics

## Avoid

- cleanup that depends on every test remembering a final manual call
- hidden global mutation without scoped restoration
- RAII wrappers that panic on drop for normal cleanup paths

## See Also

- [test-cfg-test-module](./test-cfg-test-module.md) - Keep local test helpers close to the code
- [test-tokio-async](./test-tokio-async.md) - Async tests often need scoped cleanup
