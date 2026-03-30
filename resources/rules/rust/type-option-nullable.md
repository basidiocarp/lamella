# type-option-nullable

> Use `Option<T>` for values that might not exist

Use `Option` to model absence explicitly.

## Prefer

- `Option<T>` when there may be no value
- pattern matching or combinators that force callers to handle absence
- richer enums when “missing” is only one of several states

## Avoid

- sentinel values like empty strings, `0`, or `-1` for absence
- nested options that hide a more meaningful state model
- `Option` on fields that are required after construction but never enforced

## See Also

- [type-enum-states](./type-enum-states.md) - Use enums for multiple distinct states
- [type-result-fallible](./type-result-fallible.md) - Use `Result` when absence is an error
