# doc-errors-section

> Use `# Errors` sections on fallible public APIs

Document failure modes that matter to callers.

## Prefer

- `# Errors` sections on public functions that return `Result`
- describing when the error happens and what inputs or conditions trigger it
- naming important categories or variants when callers may branch on them

## Avoid

- omitting error docs on APIs callers must reason about
- boilerplate `# Errors` sections that add no meaning
- listing every internal source error when callers only need the contract

## See Also

- [err-custom-type](./err-custom-type.md) - Name error categories callers can reason about
- [doc-panics-section](./doc-panics-section.md) - Separate panic contracts from recoverable errors
