# test-should-panic

> Use `#[should_panic]` to test that code panics as expected

Use `#[should_panic]` only when panic is part of the contract.

## Prefer

- panic tests for explicit programmer-error contracts and invariant violations
- message matching when the panic reason matters
- `Result`-based APIs for recoverable failures

## Avoid

- `#[should_panic]` for normal validation or user-facing errors
- broad panic assertions when the exact failure mode matters
- panic-driven APIs where callers should handle errors explicitly

## See Also

- [err-custom-type](./err-custom-type.md) - Prefer typed errors for recoverable failure
- [test-descriptive-names](./test-descriptive-names.md) - Make panic intent obvious in the name
