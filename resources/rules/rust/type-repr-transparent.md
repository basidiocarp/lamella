# type-repr-transparent

> Use `#[repr(transparent)]` for newtypes in FFI contexts

Use `repr(transparent)` when a wrapper must preserve the layout of its single
non-zero-sized field.

## Prefer

- `repr(transparent)` on newtypes crossing FFI or ABI-sensitive boundaries
- keeping the wrapper semantically meaningful even when layout matters
- documenting why layout compatibility is required

## Avoid

- assuming ordinary newtypes are ABI-equivalent without the attribute
- layout attributes on wrappers that never cross a representation boundary
- mixing additional data into a type that callers assume is transparent

## See Also

- [type-newtype-ids](./type-newtype-ids.md) - Use newtypes for semantic separation
- [mem-assert-type-size](./mem-assert-type-size.md) - Guard layout when it matters
