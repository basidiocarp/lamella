# api-impl-asref

> Use `AsRef<T>` when you only need to borrow the inner data

Accept `impl AsRef<T>` when the callee only needs a borrowed view.

## Prefer

- `AsRef<str>` or `AsRef<Path>` for read-only string and path inputs
- borrowing without forcing callers to allocate or clone
- signatures that still make the expected borrowed type obvious

## Avoid

- `AsRef` when ownership transfer is required
- overly generic signatures that make type inference or error messages worse
- mixing `AsRef` and `Into` without a clear ownership boundary

## See Also

- [api-impl-into](./api-impl-into.md) - Take ownership flexibly
- [api-from-not-into](./api-from-not-into.md) - Implement conversions on the destination type
