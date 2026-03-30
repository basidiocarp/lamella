# mem-boxed-slice

> Use `Box<[T]>` instead of `Vec<T>` for fixed-size heap data

Use `Box<[T]>` when the data is heap allocated but will not grow.

## Prefer

- converting `Vec<T>` into `Box<[T]>` after construction if capacity should disappear
- boxed slices for immutable fixed-size payloads
- `Vec<T>` when push, reserve, or capacity management still matters

## Avoid

- keeping `Vec<T>` just because it was easy to build
- boxed slices when mutation-driven resizing is still part of the API
- converting early if the producer still needs growth behavior

## See Also

- [mem-with-capacity](./mem-with-capacity.md) - Build efficiently before freezing size
- [own-slice-over-vec](./own-slice-over-vec.md) - Accept slices when callers do not need vector semantics
