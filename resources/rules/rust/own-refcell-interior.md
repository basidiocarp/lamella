# own-refcell-interior

> Use `RefCell<T>` for interior mutability in single-threaded code

Use `RefCell` when borrow rules must be checked at runtime in one thread.

## Prefer

- `RefCell` for single-threaded graphs, test doubles, and localized interior mutation
- narrow runtime-borrow scopes to avoid panics
- `Mutex` or `RwLock` when thread safety is needed

## Avoid

- `RefCell` as a blanket workaround for borrow design
- runtime borrow panics hidden deep in normal control flow
- multi-threaded use through the wrong abstraction

## See Also

- [own-rc-single-thread](./own-rc-single-thread.md) - Pair `Rc` with single-thread sharing
- [own-mutex-interior](./own-mutex-interior.md) - Use thread-safe interior mutability across threads
