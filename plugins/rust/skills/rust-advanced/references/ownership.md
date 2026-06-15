# Ownership, Borrowing, and Lifetimes

## Ownership Patterns

```rust
fn take_ownership(s: String) {
    println!("{s}");
}

fn borrow(s: &str) {
    println!("{s}");
}

fn borrow_mut(s: &mut String) {
    s.push('!');
}

let s = String::from("hello");
borrow(&s);

let mut s2 = s;
borrow_mut(&mut s2);
take_ownership(s2);
```

## Lifetime Annotations

```rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

const GREETING: &'static str = "Hello, world!";
```

## Smart Pointers

```rust
use std::cell::RefCell;
use std::rc::Rc;
use std::sync::{Arc, Mutex};

let boxed = Box::new(42);

let shared = Rc::new(RefCell::new(vec![1, 2, 3]));
shared.borrow_mut().push(4);

let counter = Arc::new(Mutex::new(0usize));
```

## Interior Mutability

```rust
use std::cell::{Cell, RefCell};

let c = Cell::new(5);
c.set(10);

let log = RefCell::new(Vec::new());
log.borrow_mut().push("started");
```

## Cow

```rust
use std::borrow::Cow;

fn process_text(input: &str) -> Cow<'_, str> {
    if input.contains("bad") {
        Cow::Owned(input.replace("bad", "good"))
    } else {
        Cow::Borrowed(input)
    }
}
```

## RAII and Drop

```rust
struct FileGuard {
    name: String,
}

impl Drop for FileGuard {
    fn drop(&mut self) {
        println!("closing {}", self.name);
    }
}
```

## Best Practices

- Borrow by default and move only when ownership transfer is intended.
- Use `&str` and slices for read-only APIs when possible.
- Reach for `Rc<RefCell<T>>` only in single-threaded shared-mutation cases.
- Use `Arc<Mutex<T>>` only when you truly need cross-thread shared mutation.
