# mem-thinvec

> Use `ThinVec<T>` for nullable collections with minimal overhead

Use `ThinVec` only when nullable or empty-vector overhead is a real bottleneck.

## Prefer

- `ThinVec` in dense memory-sensitive data structures where many vectors are empty
- measuring layout savings before introducing the type
- plain `Vec` when ecosystem compatibility and simplicity matter more

## Avoid

- swapping in `ThinVec` as a default collection type
- exposing niche container types in public APIs without a strong reason
- dependency churn for marginal memory wins

## See Also

- [mem-smallvec](./mem-smallvec.md) - Inline small collections
- [mem-boxed-slice](./mem-boxed-slice.md) - Freeze fixed-size heap data
