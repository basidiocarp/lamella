# Testing in Rust

## Unit Tests

```rust
// Tests in same file
#[cfg(test)]
mod tests {
    use super::*;

// ... (37 lines trimmed)
    assert!(value > 0, "Value must be positive, got {}", value);
    assert_eq!(result, expected, "Calculation failed");
}
```

## Doctests

```rust
/// Adds two numbers together.
///
/// # Examples
///
/// ```
// ... (16 lines trimmed)
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}
```

## Integration Tests

```rust
// tests/integration_test.rs
use mylib;

#[test]
fn test_full_workflow() {
// ... (17 lines trimmed)
    let ctx = common::setup();
    // Use ctx...
}
```

## Test Organization

```rust
// Nested test modules
#[cfg(test)]
mod tests {
    use super::*;

// ... (20 lines trimmed)
        }
    }
}
```

## Test Fixtures and Setup

```rust
struct TestContext {
    temp_dir: std::path::PathBuf,
    db: Database,
}

// ... (23 lines trimmed)
    // Test uses ctx...
    // Automatic cleanup via Drop
}
```

## Async Tests

```rust
use tokio;

#[tokio::test]
async fn test_async_function() {
    let result = async_operation().await;
// ... (13 lines trimmed)
    let result = tokio::time::timeout(timeout, slow_operation()).await;
    assert!(result.is_ok());
}
```

## Property-Based Testing (proptest)

```rust
use proptest::prelude::*;

// Simple property test
proptest! {
    #[test]
// ... (36 lines trimmed)
        assert_eq!(user, deserialized);
    }
}
```

## Mocking

```rust
// Using mockall
use mockall::*;
use mockall::predicate::*;

#[automock]
// ... (19 lines trimmed)
    let user = mock.get_user(1);
    assert!(user.is_some());
}
```

## Benchmarks (Criterion)

```rust
// benches/my_benchmark.rs
use criterion::{black_box, criterion_group, criterion_main, Criterion};

fn fibonacci(n: u64) -> u64 {
    match n {
// ... (17 lines trimmed)
// [[bench]]
// name = "my_benchmark"
// harness = false
```

## Advanced Benchmarking

```rust
use criterion::{BenchmarkId, Criterion, criterion_group, criterion_main};

fn bench_multiple_sizes(c: &mut Criterion) {
    let mut group = c.benchmark_group("sorting");

// ... (27 lines trimmed)

criterion_group!(benches, bench_multiple_sizes, bench_comparison);
criterion_main!(benches);
```

## Testing with External Resources

```rust
// Testing file I/O
#[test]
fn test_file_operations() {
    use std::io::Write;

// ... (27 lines trimmed)
    assert_eq!(count.0, 1);
    Ok(())
}
```

## Snapshot Testing

```rust
// Using insta crate
use insta::assert_snapshot;

#[test]
fn test_output_format() {
// ... (9 lines trimmed)

// Run with: cargo insta test
// Review snapshots: cargo insta review
```

## Code Coverage

```rust
// Using tarpaulin
// cargo install cargo-tarpaulin
// cargo tarpaulin --out Html --output-dir coverage

// Using llvm-cov
// cargo install cargo-llvm-cov
// cargo llvm-cov --html
```

## Fuzzing

```rust
// Using cargo-fuzz
// cargo install cargo-fuzz
// cargo fuzz init

// fuzz/fuzz_targets/fuzz_target_1.rs
#![no_main]
use libfuzzer_sys::fuzz_target;

fuzz_target!(|data: &[u8]| {
    if let Ok(s) = std::str::from_utf8(data) {
        let _ = mylib::parse_input(s);
    }
});

// Run with: cargo fuzz run fuzz_target_1
```

## Best Practices

- Write tests alongside production code in #[cfg(test)] modules
- Use integration tests in tests/ directory for end-to-end testing
- Include doctests in documentation for examples that must work
- Use descriptive test names that explain what is being tested
- Test edge cases (empty inputs, max values, etc.)
- Use property-based testing for algorithmic code
- Benchmark performance-critical code with criterion
- Run tests in CI with cargo test --all-features
- Use cargo test -- --nocapture to see println! output
- Test error conditions with #[should_panic] or Result
- Mock external dependencies for unit tests
- Use test fixtures for complex setup/teardown
- Run clippy on test code too
- Measure code coverage and aim for high coverage
- Use fuzzing for security-critical parsers
- Test async code with tokio::test
- Use snapshot testing for complex output validation
