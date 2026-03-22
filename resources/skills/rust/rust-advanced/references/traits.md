# Traits, Generics, and Type System

## Basic Trait Definition

```rust
// Simple trait
trait Drawable {
    fn draw(&self);
}

// ... (20 lines trimmed)
        format!("A circle with radius {}", self.radius)
    }
}
```

## Associated Types

```rust
// Associated types vs generic parameters
trait Container {
    type Item;

    fn add(&mut self, item: Self::Item);
// ... (18 lines trimmed)

    fn next(&mut self) -> Option<Self::Item>;
}
```

## Generic Traits and Bounds

```rust
// Generic trait with multiple bounds
fn print_info<T>(item: &T)
where
    T: std::fmt::Display + std::fmt::Debug,
{
// ... (31 lines trimmed)
        println!("Value: {}", self);
    }
}
```

## Trait Objects (Dynamic Dispatch)

```rust
// Static dispatch (monomorphization)
fn static_dispatch<T: Drawable>(item: &T) {
    item.draw();
}

// ... (32 lines trimmed)
    fn generic<T>(&self);  // NOT OK: generic method
    fn by_value(self);     // NOT OK: takes self by value
}
```

## Derive Macros

```rust
// Standard derive macros
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
struct User {
    id: u64,
    name: String,
// ... (14 lines trimmed)
    host: String,
    port: u16,
}
```

## Advanced Trait Patterns

```rust
// Extension trait pattern
trait StringExt {
    fn truncate_to(&self, max_len: usize) -> String;
}

// ... (34 lines trimmed)
        self.print();  // Can call supertrait methods
    }
}
```

## Associated Constants

```rust
trait Config {
    const MAX_SIZE: usize;
    const DEFAULT_TIMEOUT: u64;
}

struct ServerConfig;

impl Config for ServerConfig {
    const MAX_SIZE: usize = 1024;
    const DEFAULT_TIMEOUT: u64 = 30;
}

fn use_config<T: Config>() {
    println!("Max size: {}", T::MAX_SIZE);
}
```

## Generic Associated Types (GATs)

```rust
// GATs allow generics in associated types
trait LendingIterator {
    type Item<'a> where Self: 'a;

    fn next<'a>(&'a mut self) -> Option<Self::Item<'a>>;
// ... (18 lines trimmed)
        Some(&mut self.data[start..start.min(self.data.len())])
    }
}
```

## Marker Traits

```rust
use std::marker::{PhantomData, Send, Sync};

// Send: type can be transferred across thread boundaries
// Sync: type can be shared between threads (&T is Send)

// ... (13 lines trimmed)
        }
    }
}
```

## Operator Overloading

```rust
use std::ops::{Add, Mul};

#[derive(Debug, Clone, Copy)]
struct Vector2D {
    x: f64,
// ... (27 lines trimmed)
let v2 = Vector2D { x: 3.0, y: 4.0 };
let v3 = v1 + v2;
let v4 = v1 * 2.5;
```

## From/Into Conversion Traits

```rust
struct UserId(u64);

impl From<u64> for UserId {
    fn from(id: u64) -> Self {
        UserId(id)
// ... (20 lines trimmed)
        }
    }
}
```

## Const Traits (Nightly)

```rust
// Const trait implementations (requires nightly)
#![feature(const_trait_impl)]

#[const_trait]
trait ConstAdd {
// ... (9 lines trimmed)
const fn compute() -> i32 {
    5.add(10)  // Can use in const context
}
```

## Best Practices

- Prefer associated types when there's one clear type per implementation
- Use generic parameters when multiple types might be used simultaneously
- Keep traits small and focused (single responsibility)
- Use extension traits to add functionality to existing types
- Document trait requirements and invariants
- Use marker traits for compile-time guarantees
- Prefer static dispatch for performance, dynamic dispatch for flexibility
- Use #[derive] when possible instead of manual implementations
- Implement standard traits (Debug, Clone, etc.) for better ecosystem integration
- Use sealed traits to prevent external implementations when needed
