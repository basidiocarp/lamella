---
name: concurrency
description: "Analyzes Rust concurrency and async issues."
origin: lamella
---

# Concurrency & Async

## Core Question

Is this data shared, and across what boundary?

## Send & Sync

| Marker | Meaning | Example |
|--------|---------|---------|
| `Send` | Safe to transfer between threads | Most types |
| `Sync` | Safe to share references between threads | `Arc<T>` where T: Send |
| `!Send` | Cannot leave its thread | `Rc<T>`, raw pointers |
| `!Sync` | Cannot be referenced from other threads | `RefCell<T>`, `Cell<T>` |

## Concurrency Primitives

| Need | Use |
|------|-----|
| Share immutable data | `Arc<T>` |
| Share mutable data | `Arc<Mutex<T>>` or `Arc<RwLock<T>>` |
| One-way data flow | `mpsc::channel` |
| Broadcast to many | `broadcast::channel` |
| Single value response | `oneshot::channel` |
| Latest value only | `watch::channel` |
| CPU-bound parallelism | `rayon` or `std::thread` |
| I/O-bound concurrency | `tokio` async/await |

## Async Rules

- Never use `std::thread::sleep` in async code. Use `tokio::time::sleep`.
- Never hold a `MutexGuard` across an `.await`. Causes deadlocks.
- Never spawn unboundedly. Use semaphores or `buffer_unordered`.
- Spawned futures must be `Send`.
- Prefer channels over shared state when data flows one direction.

## Domain Detection (Trace UP)

When concurrency errors occur, check the domain:

| Domain | Why Multi-Threaded | Pattern |
|--------|--------------------|---------|
| Web (axum/actix) | Handlers run on thread pool | `Arc<T>` state, Send bounds |
| CLI | Background tasks | `tokio::spawn` + channels |
| Embedded | Interrupt handlers | Critical sections, no threads |
| Cloud-native | gRPC handlers | `Arc<T>` + `tonic` extractors |

## Error-to-Question Mapping

| Error | Question to Ask |
|-------|-----------------|
| E0277 (Send not satisfied) | Does this data cross thread boundaries? Use Arc instead of Rc? |
| E0277 (Sync not satisfied) | Is shared access needed? Use Mutex/RwLock? |
| Deadlock at runtime | Is lock ordering consistent? Consider channels. |

## Quick Reference

```rust
// Shared state in async
let state = Arc::new(RwLock::new(HashMap::new()));
let state_clone = state.clone();
tokio::spawn(async move {
    state_clone.write().await.insert("key", "value");
});

// Channel for one-way flow
let (tx, mut rx) = tokio::sync::mpsc::channel(100);
tokio::spawn(async move { tx.send(data).await.unwrap(); });
while let Some(msg) = rx.recv().await { process(msg); }

// Bounded concurrency
use futures::stream::{self, StreamExt};
stream::iter(urls)
    .map(|url| async move { fetch(&url).await })
    .buffer_unordered(10)
    .collect::<Vec<_>>()
    .await;

// Graceful shutdown
let token = CancellationToken::new();
tokio::select! {
    _ = token.cancelled() => { /* cleanup */ }
    _ = do_work() => {}
}
```

## Anti-Patterns

| Bad | Better |
|-----|--------|
| `Rc<T>` in async handlers | `Arc<T>` |
| Holding MutexGuard across await | Clone data, release lock, then await |
| `std::sync::Mutex` in async | `tokio::sync::Mutex` |
| Unbounded spawning | Semaphore or buffer_unordered |
| Blocking in async context | `tokio::task::spawn_blocking` |
