# type-never-diverge

> Use `!` (never type) for functions that never return

Use the never type when divergence is part of the real contract.

## Prefer

- `!` for aborting, exiting, panicking, or endlessly serving functions that truly never return
- signatures that make unreachable control flow explicit
- normal result or option types when the function may return in practice

## Avoid

- clever `!` usage that obscures control flow
- pretending a function never returns when it only “usually” does not
- using divergence to hide error handling responsibilities

## See Also

- [type-result-fallible](./type-result-fallible.md) - Use `Result` for recoverable failure
- [err-result-over-panic](./err-result-over-panic.md) - Prefer errors for recoverable cases
