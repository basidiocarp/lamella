# Concurrency and Parallel Programming

Use this page to pick the right concurrency slice. The implementation details are split so the caller can load only the part that matches the synchronization model in play.

## Reference Map

| Need | Load |
|------|------|
| Atomics, memory ordering, and lock-free structures | [atomics-and-lock-free.md](atomics-and-lock-free.md) |
| Thread pools, parallel STL, async, and futures | [thread-pools-and-futures.md](thread-pools-and-futures.md) |
| Mutexes, condition variables, shared locks, and coroutine coordination | [synchronization-and-coroutines.md](synchronization-and-coroutines.md) |

## Selection Guide

- Reach for atomics only when the shared state and ordering guarantees are narrow and well-understood.
- Prefer task queues or thread pools over unmanaged thread-per-request patterns.
- Use coroutines for async composition, not as a replacement for every background job.

## Memory Ordering Quick Reference

| Ordering | Guarantees | Typical Use |
|----------|------------|-------------|
| `relaxed` | No cross-thread synchronization | Counters, statistics |
| `acquire` | Later reads/writes stay after the load | Consumer side |
| `release` | Earlier reads/writes stay before the store | Producer side |
| `acq_rel` | Combined acquire + release | Read-modify-write operations |
| `seq_cst` | Global total order | Default until you can prove a weaker ordering |
