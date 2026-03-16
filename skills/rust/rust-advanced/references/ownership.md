# Ownership, Borrowing, and Lifetimes

## Ownership Patterns

```rust
// Move semantics (ownership transfer)
fn take_ownership(s: String) {
    println!("{}", s);
} // s dropped here

// ... (12 lines trimmed)
borrow(&s);           // OK, immutable borrow
let mut s2 = s;       // Move, s no longer valid
borrow_mut(&mut s2);  // OK, mutable borrow
```

## Lifetime Annotations

```rust
// Explicit lifetime: returned reference lives as long as input
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

// ... (16 lines trimmed)

// Static lifetime (lives for entire program)
const GREETING: &'static str = "Hello, world!";
```

## Smart Pointers

```rust
use std::rc::Rc;
use std::cell::RefCell;
use std::sync::{Arc, Mutex};

// Box: heap allocation, single owner
// ... (26 lines trimmed)
    let mut num = counter_clone.lock().unwrap();
    *num += 1;
});
```

## Interior Mutability

```rust
use std::cell::{Cell, RefCell};

// Cell: Copy types only
let c = Cell::new(5);
c.set(10);
// ... (21 lines trimmed)
        self.messages.borrow().clone()
    }
}
```

## Pin and Self-Referential Types

```rust
use std::pin::Pin;
use std::marker::PhantomPinned;

// Self-referential struct (requires Pin)
struct SelfReferential {
// ... (28 lines trimmed)
    let pinned = Box::pin(fut);
    pinned.await;
}
```

## Cow (Clone on Write)

```rust
use std::borrow::Cow;

fn process_text(input: &str) -> Cow<str> {
    if input.contains("bad") {
        // Need to modify: allocate new String
// ... (10 lines trimmed)

let text2 = "bad word";
let result2 = process_text(text2);  // Owned (allocated)
```

## Drop Trait and RAII

```rust
struct FileGuard {
    name: String,
}

impl FileGuard {
// ... (14 lines trimmed)
    let _file = FileGuard::new("data.txt".to_string());
    // Use file...
} // Drop called automatically here
```

## Common Patterns

```rust
// Builder pattern with ownership
struct Config {
    host: String,
    port: u16,
}
// ... (33 lines trimmed)
    .host("localhost")
    .port(3000)
    .build()?;
```

## Best Practices

- Prefer borrowing (&T) over ownership transfer when possible
- Use &str over String for function parameters
- Use &[T] over Vec<T> for function parameters
- Clone only when necessary (profile first)
- Use Cow<'a, T> for conditional cloning
- Document lifetime relationships in complex cases
- Use Arc<Mutex<T>> for shared mutable state across threads
- Use Rc<RefCell<T>> for shared mutable state in single thread
- Implement Drop for RAII patterns
- Use PhantomData to constrain variance when needed
