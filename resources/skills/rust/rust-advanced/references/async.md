# Async Programming in Rust

## Basic Async/Await

```rust
use tokio;

// Async function returns a Future
async fn fetch_data(url: &str) -> Result<String, reqwest::Error> {
    let response = reqwest::get(url).await?;
// ... (16 lines trimmed)
        println!("Hello from async context");
    });
}
```

## Concurrent Execution

```rust
use tokio;

// Sequential execution
async fn sequential() {
    let result1 = async_operation1().await;
// ... (32 lines trimmed)
    let result1 = handle1.await.unwrap();
    let result2 = handle2.await.unwrap();
}
```

## Select and Race Conditions

```rust
use tokio::time::{sleep, Duration};

// select! - wait for first to complete
async fn first_to_complete() {
    tokio::select! {
// ... (29 lines trimmed)
        }
    }
}
```

## Streams

```rust
use tokio_stream::{self as stream, StreamExt};

// Creating streams
async fn stream_example() {
    let mut stream = stream::iter(vec![1, 2, 3, 4, 5]);
// ... (27 lines trimmed)
        println!("Processed: {}", x);
    }).await;
}
```

## Channels for Communication

```rust
use tokio::sync::{mpsc, oneshot, broadcast, watch};

// mpsc: multiple producer, single consumer
async fn mpsc_example() {
    let (tx, mut rx) = mpsc::channel(32);
// ... (46 lines trimmed)

    tx.send("updated").unwrap();
}
```

## Shared State

```rust
use std::sync::Arc;
use tokio::sync::{Mutex, RwLock};

// Mutex for exclusive access
async fn mutex_example() {
// ... (39 lines trimmed)
    let mut write = data.write().await;
    write.push(4);
}
```

## Async Traits (with async-trait)

```rust
use async_trait::async_trait;

#[async_trait]
trait AsyncRepository {
    async fn find_by_id(&self, id: u64) -> Result<User, Error>;
// ... (23 lines trimmed)
        Ok(())
    }
}
```

## Pin and Futures

```rust
use std::pin::Pin;
use std::future::Future;
use std::task::{Context, Poll};

// Manual Future implementation
// ... (23 lines trimmed)
    let result = future.await;
    println!("Result: {}", result);
}
```

## Background Tasks and Graceful Shutdown

```rust
use tokio::signal;

async fn background_task(mut shutdown: tokio::sync::watch::Receiver<bool>) {
    loop {
        tokio::select! {
// ... (24 lines trimmed)
    // Wait for task to complete
    task.await.unwrap();
}
```

## Error Handling in Async

```rust
use thiserror::Error;

#[derive(Error, Debug)]
enum AsyncError {
    #[error("Network error: {0}")]
// ... (20 lines trimmed)

    Ok(result)
}
```

## Runtime Configuration

```rust
// Custom runtime configuration
fn main() {
    let runtime = tokio::runtime::Builder::new_multi_thread()
        .worker_threads(4)
        .thread_name("my-worker")
// ... (18 lines trimmed)
        println!("Single-threaded async");
    });
}
```

## Best Practices

- Use tokio::spawn for CPU-bound tasks on multi-threaded runtime
- Use spawn_blocking for blocking operations (file I/O, sync code)
- Prefer tokio::sync primitives over std::sync in async code
- Use channels for task communication instead of shared state when possible
- Always handle JoinHandle results (tasks can panic)
- Use select! for cancellation patterns
- Avoid holding locks across .await points
- Use timeout for all external I/O operations
- Implement graceful shutdown with channels
- Use async-trait for trait-based async code
- Prefer try_join! over manual error handling
- Use Arc<Mutex<T>> sparingly (channels often better)
- Test async code with tokio::test macro
- Monitor task spawning to prevent unbounded growth
