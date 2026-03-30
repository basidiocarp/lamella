# own-rwlock-readers

> Use `RwLock<T>` when reads significantly outnumber writes

Choose `RwLock` only when read-heavy contention makes it worth the complexity.

## Prefer

- `RwLock` for shared state with frequent concurrent reads and relatively rare writes
- measuring contention before upgrading from `Mutex`
- simple read and write critical sections

## Avoid

- `RwLock` by default
- long-lived read guards that starve writers
- assuming `RwLock` is faster without measuring workload characteristics

## See Also

- [own-mutex-interior](./own-mutex-interior.md) - Prefer `Mutex` when read-heavy contention is not proven
- [async-no-lock-await](./async-no-lock-await.md) - Never hold guards across `.await`
