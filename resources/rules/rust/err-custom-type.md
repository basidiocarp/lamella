# err-custom-type

> Use custom error types for library and domain boundaries

Define custom error types when callers need to handle failures by kind.

## Prefer

- domain-specific enums for library or subsystem boundaries
- variants that encode actionable categories instead of only strings
- `thiserror` derives when they keep the type readable

## Avoid

- collapsing everything into strings where callers need structured handling
- giant kitchen-sink error enums that erase subsystem boundaries
- custom types in apps when `anyhow` is enough

## See Also

- [err-thiserror-lib](./err-thiserror-lib.md) - Derive library errors with `thiserror`
- [err-result-over-panic](./err-result-over-panic.md) - Prefer recoverable errors over panics
