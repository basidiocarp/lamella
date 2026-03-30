# test-tokio-async

> Use `#[tokio::test]` for async tests

Use `#[tokio::test]` for async behavior that actually needs the runtime.

## Prefer

- async tests only when the code under test is async
- runtime flavor and options that match the behavior being exercised
- paused time or explicit time control for timer-heavy tests when available

## Avoid

- wrapping synchronous tests in Tokio just because the crate already depends on it
- hidden background tasks that outlive the test
- sleeping real wall-clock time when a deterministic approach exists

## See Also

- [async-tokio-runtime](./async-tokio-runtime.md) - Runtime choices matter in tests too
- [test-fixture-raii](./test-fixture-raii.md) - Clean up scoped async resources
