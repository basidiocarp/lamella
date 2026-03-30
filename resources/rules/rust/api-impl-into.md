# api-impl-into

> Accept `impl Into<T>` for flexible APIs, implement `From<T>` for conversions

Accept `impl Into<T>` when the callee needs ownership and callers may have
several source types.

## Prefer

- `impl Into<T>` at API boundaries that consume the value
- `From` impls on the destination type so conversions stay discoverable
- narrower concrete types when flexibility is not buying anything

## Avoid

- `impl Into<T>` when borrowing with `AsRef` is enough
- generic signatures so broad that diagnostics become poor
- duplicate overloads for every source type when `Into` is the actual intent

## See Also

- [api-from-not-into](./api-from-not-into.md) - Implement `From`, not `Into`
- [api-impl-asref](./api-impl-asref.md) - Borrow instead of taking ownership
