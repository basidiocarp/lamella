# Error Handling in Rust

## Result and Option Basics

```rust
// Result: operation that can fail
fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Err("Division by zero".to_string())
    } else {
// ... (16 lines trimmed)
    let y = divide(x, c)?;
    Ok(y)
}
```

## Custom Error Types

```rust
use std::fmt;

// Manual error type
#[derive(Debug)]
enum AppError {
// ... (22 lines trimmed)
    // ... fetch user
    Err(AppError::NotFound(format!("User {} not found", id)))
}
```

## Using thiserror

```rust
use thiserror::Error;

#[derive(Error, Debug)]
enum DataError {
    #[error("Data not found: {0}")]
// ... (18 lines trimmed)
    let port: u16 = content.parse()?;  // Auto-converts ParseIntError
    Ok(Config { port })
}
```

## Using anyhow for Applications

```rust
use anyhow::{Result, Context, bail, ensure};

// Simple error handling for applications
fn process_file(path: &str) -> Result<()> {
    let content = std::fs::read_to_string(path)
// ... (15 lines trimmed)
        .context("Failed to process configuration")?;
    Ok(())
}
```

## Option Combinators

```rust
// map: transform Option<T> to Option<U>
let num: Option<i32> = Some(5);
let doubled = num.map(|n| n * 2);  // Some(10)

// and_then: chain operations
// ... (23 lines trimmed)
if let Some(user) = find_user(1) {
    println!("Found: {}", user.name);
}
```

## Result Combinators

```rust
// map: transform Ok value
let result: Result<i32, String> = Ok(5);
let doubled = result.map(|n| n * 2);  // Ok(10)

// map_err: transform error
// ... (20 lines trimmed)
    Ok(result) => println!("Result: {}", result),
    Err(e) => eprintln!("Error: {}", e),
}
```

## Error Conversion and From Trait

```rust
use std::io;
use std::num::ParseIntError;

#[derive(Debug)]
enum MyError {
// ... (19 lines trimmed)
    let number = content.trim().parse()?;  // ParseIntError -> MyError
    Ok(number)
}
```

## Advanced Error Patterns

```rust
// Multiple error sources with Box<dyn Error>
use std::error::Error;

fn complex_operation() -> Result<String, Box<dyn Error>> {
    let file = std::fs::read_to_string("data.txt")?;
// ... (27 lines trimmed)
        Ok(value * 2)
    }
}
```

## Try Blocks (Nightly)

```rust
#![feature(try_blocks)]

// Try block for localized error handling
let result: Result<i32, Box<dyn Error>> = try {
    let file = std::fs::read_to_string("config.txt")?;
    let num: i32 = file.trim().parse()?;
    num * 2
};
```

## Error Context Pattern

```rust
use thiserror::Error;

#[derive(Error, Debug)]
#[error("{message}")]
struct ContextError {
// ... (26 lines trimmed)
        self.map_err(|e| ContextError::new(message).with_source(e))
    }
}
```

## Best Practices

- Use Result for recoverable errors, panic! for unrecoverable bugs
- Prefer ? operator over unwrap() in production code
- Use expect() with descriptive messages instead of unwrap()
- Use thiserror for libraries (structured errors)
- Use anyhow for applications (simple error handling)
- Implement std::error::Error trait for custom error types
- Add context to errors as they propagate up the stack
- Use #[from] in thiserror for automatic conversions
- Document error conditions in function documentation
- Use Option::ok_or() to convert Option to Result
- Use Result::ok() to convert Result to Option (discarding error)
- Avoid String as error type (use custom types instead)
- Use ensure! and bail! from anyhow for cleaner checks
- Log errors at boundaries, return them in library code
