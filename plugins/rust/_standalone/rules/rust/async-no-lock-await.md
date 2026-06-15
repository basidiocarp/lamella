# async-no-lock-await

> Never hold `Mutex`/`RwLock` across `.await`

Do not suspend while a lock guard is live.

## Prefer

- copy or clone the needed state out of the guard before `.await`
- keep lock scope small and synchronous
- redesign shared state when an async operation seems to require the guard

## Avoid

- awaiting while a `MutexGuard`, `RwLockReadGuard`, or `RwLockWriteGuard` is live
- mixing lock acquisition and I/O in the same critical section
- relying on async mutexes as permission to hold locks for long periods

## See Also

- [async-clone-before-await](./async-clone-before-await.md) - Move or clone what you need before suspension
- [own-mutex-interior](./own-mutex-interior.md) - Choose the right interior mutability tool
