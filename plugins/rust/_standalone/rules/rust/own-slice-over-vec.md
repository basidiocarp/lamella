# own-slice-over-vec

> Accept `&[T]` not `&Vec<T>`, `&str` not `&String`

Accept borrowed views instead of concrete owned containers when ownership is not
needed.

## Prefer

- `&[T]` for read-only sequence inputs
- `&str` for read-only string inputs
- `impl AsRef<str>` or similar borrowed abstractions when broader input flexibility helps
- container-specific types only when the callee needs ownership or capacity semantics

## Avoid

- `&Vec<T>` and `&String` in public APIs that only read
- forcing callers into one backing container unnecessarily
- signatures that imply more ownership than the function needs

## See Also

- [api-impl-asref](./api-impl-asref.md) - Borrow flexibly
