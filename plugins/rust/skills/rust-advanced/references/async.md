# Async Programming in Rust

## Basic Async / Await

```rust
async fn fetch_data(url: &str) -> Result<String, reqwest::Error> {
    let response = reqwest::get(url).await?;
    response.text().await
}

#[tokio::main]
async fn main() -> Result<(), reqwest::Error> {
    let body = fetch_data("https://example.com").await?;
    println!("{body}");
    Ok(())
}
```

## Concurrent Execution

```rust
async fn concurrent() -> anyhow::Result<()> {
    let (users, posts) = tokio::try_join!(
        fetch_users(),
        fetch_posts(),
    )?;

    println!("users={} posts={}", users.len(), posts.len());
    Ok(())
}
```

## select! for Cancellation and Timeouts

```rust
use tokio::time::{sleep, Duration};

async fn first_to_complete() {
    tokio::select! {
        _ = sleep(Duration::from_secs(1)) => println!("timer fired"),
        result = fetch_users() => println!("users: {:?}", result),
    }
}
```

## Channels

```rust
use tokio::sync::mpsc;

async fn channel_example() {
    let (tx, mut rx) = mpsc::channel::<String>(16);

    tokio::spawn(async move {
        let _ = tx.send("hello".to_string()).await;
    });

    while let Some(message) = rx.recv().await {
        println!("{message}");
    }
}
```

## Shared State

```rust
use std::sync::Arc;
use tokio::sync::Mutex;

async fn shared_counter() {
    let counter = Arc::new(Mutex::new(0usize));
    let cloned = Arc::clone(&counter);

    tokio::spawn(async move {
        let mut value = cloned.lock().await;
        *value += 1;
    }).await.unwrap();
}
```

## Background Tasks and Shutdown

```rust
use tokio::sync::watch;

async fn background_task(mut shutdown: watch::Receiver<bool>) {
    loop {
        tokio::select! {
            _ = shutdown.changed() => break,
            _ = tokio::time::sleep(std::time::Duration::from_secs(5)) => {
                println!("tick");
            }
        }
    }
}
```

## Best Practices

- Use `spawn_blocking` for blocking or CPU-heavy work.
- Prefer channels for coordination before reaching for shared mutable state.
- Avoid holding async locks across `.await`.
- Add timeouts around external I/O.
