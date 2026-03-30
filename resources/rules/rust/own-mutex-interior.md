# own-mutex-interior

> Use `Mutex<T>` for interior mutability across threads

Use `Mutex` when one mutable value must be shared safely across threads.

## Prefer

- `Mutex` for infrequent short critical sections
- small locked regions with clear ownership
- async-aware mutexes only when the code actually runs in async contexts

## Avoid

- long critical sections or lock-holding across `.await`
- `Mutex` when one owner thread or message passing would be simpler
- nested locks without a clear ordering discipline

## See Also

- [async-no-lock-await](./async-no-lock-await.md) - Never hold locks across `.await`
- [own-rwlock-readers](./own-rwlock-readers.md) - Use `RwLock` only when read-heavy access justifies it
