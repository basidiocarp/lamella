# api-from-not-into

> Implement `From<T>`, not `Into<U>` - `From` gives you `Into` for free

Implement `From` on destination types and let Rust derive `Into`.

## Prefer

- `impl From<Source> for Target`
- infallible, obvious conversions only
- named methods such as `try_from`, `parse`, or domain-specific constructors when conversion can fail

## Avoid

- hand-writing `Into` impls
- `From` for lossy or surprising conversions
- overlapping conversion APIs that make call sites ambiguous

## See Also

- [api-impl-into](./api-impl-into.md) - Accept `impl Into<T>` at call boundaries
- [api-parse-dont-validate](./api-parse-dont-validate.md) - Parse invalid input into validated types
