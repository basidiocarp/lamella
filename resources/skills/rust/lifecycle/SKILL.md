---
name: lifecycle
description: "Designs Rust resource lifecycle patterns."
origin: lamella
---

# Resource Lifecycle & RAII

## Core Question

When should this resource be acquired, and when released?

## RAII Pattern

Resources are tied to object lifetime. Acquisition in `new()`, release in `Drop`.

```rust
pub struct DatabaseConn { inner: Connection }

impl DatabaseConn {
    pub fn new(url: &str) -> Result<Self> {
        Ok(Self { inner: Connection::connect(url)? })
    }
}

impl Drop for DatabaseConn {
    fn drop(&mut self) {
        self.inner.close(); // Automatic cleanup
    }
}
```

## Lifecycle Patterns

| Pattern | Use When |
|---------|----------|
| RAII (Drop) | Resource needs deterministic cleanup |
| Guard (MutexGuard) | Scoped access to shared resource |
| Pool | Expensive resources reused across requests |
| Lazy (OnceLock) | One-time initialization on first use |
| Transaction | Multi-step operation that must be atomic |

## Guard Pattern

```rust
pub struct Transaction<'a> {
    conn: &'a mut Connection,
    committed: bool,
}

impl<'a> Transaction<'a> {
    pub fn begin(conn: &'a mut Connection) -> Result<Self> {
        conn.execute("BEGIN")?;
        Ok(Self { conn, committed: false })
    }
    pub fn commit(mut self) -> Result<()> {
        self.conn.execute("COMMIT")?;
        self.committed = true;
        Ok(())
    }
}

impl Drop for Transaction<'_> {
    fn drop(&mut self) {
        if !self.committed {
            let _ = self.conn.execute("ROLLBACK");
        }
    }
}
```

## Lazy Initialization

```rust
use std::sync::OnceLock;

static CONFIG: OnceLock<Config> = OnceLock::new();

fn get_config() -> &'static Config {
    CONFIG.get_or_init(|| Config::load().expect("config required"))
}
```

## Anti-Patterns

| Bad | Better |
|-----|--------|
| Manual cleanup calls | RAII with Drop |
| Forgetting to close resources | Guard pattern |
| Creating expensive resources per request | Connection pool |
| Global mutable state | OnceLock or dependency injection |
