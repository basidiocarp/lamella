# doc-panics-section

> Use `# Panics` sections when public APIs may panic

If a public API can panic, document when and why.

## Prefer

- `# Panics` sections on APIs with real panic conditions
- explaining caller actions or invariants that avoid the panic
- separating panic docs from recoverable error docs

## Avoid

- undocumented panic behavior on public APIs
- panic docs for functions that never panic
- using panic sections to justify recoverable failures that should be `Result`

## See Also

- [err-result-over-panic](./err-result-over-panic.md) - Prefer recoverable errors
- [doc-errors-section](./doc-errors-section.md) - Document normal error paths separately
