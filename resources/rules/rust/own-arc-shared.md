# own-arc-shared

> Use `Arc<T>` for thread-safe shared ownership

Use `Arc` when multiple threads or tasks truly need shared ownership.

## Prefer

- `Arc` for cross-thread shared read-mostly state
- pairing `Arc` with interior mutability only when mutation is required
- plain ownership or borrowing when sharing is not necessary

## Avoid

- `Arc` as a default ownership strategy
- nested `Arc<Mutex<...>>` stacks without a clear concurrency model
- using `Arc` only to dodge borrow design

## See Also

- [own-rc-single-thread](./own-rc-single-thread.md) - Use `Rc` in single-threaded code
- [own-mutex-interior](./own-mutex-interior.md) - Add thread-safe interior mutability intentionally
