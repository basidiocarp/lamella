# own-rc-single-thread

> Use `Rc<T>` for shared ownership in single-threaded contexts

Use `Rc` only when shared ownership stays on one thread.

## Prefer

- `Rc` for single-threaded graphs, trees, and UI state
- `Arc` only when cross-thread sharing is actually required
- plain ownership when sharing is unnecessary

## Avoid

- `Rc` in types that may cross thread boundaries
- defaulting to reference counting before simpler ownership models are considered
- pairing `Rc` with mutation without a deliberate interior mutability story

## See Also

- [own-arc-shared](./own-arc-shared.md) - Use `Arc` for cross-thread ownership
- [own-refcell-interior](./own-refcell-interior.md) - Add single-threaded interior mutability intentionally
