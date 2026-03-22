---
name: golang-testing
description: Go testing patterns including table-driven tests, subtests, benchmarks, fuzzing, and test coverage. Follows TDD methodology with idiomatic Go practices. Use when writing Go tests, adding coverage, creating benchmarks, implementing fuzz tests, or following TDD in Go.
---

# Go Testing Patterns

## Contents

- [When to Use](#when-to-use)
- [TDD Workflow](#tdd-workflow)
- [Table-Driven Tests](#table-driven-tests)
- [Test Coverage](#test-coverage)
- [Testing Commands](#testing-commands)
- [Best Practices](#best-practices)
- [References](#references)

## When to Use

- Writing new Go functions or methods
- Adding test coverage to existing code
- Creating benchmarks for performance-critical code
- Implementing fuzz tests for input validation
- Following TDD workflow in Go projects

## TDD Workflow

### The RED-GREEN-REFACTOR Cycle

```
RED     → Write a failing test first
GREEN   → Write minimal code to pass the test
REFACTOR → Improve code while keeping tests green
REPEAT  → Continue with next requirement
```

### Example

```go
// Step 1: RED - Write failing test
func TestAdd(t *testing.T) {
    got := Add(2, 3)
    want := 5
    if got != want {
        t.Errorf("Add(2, 3) = %d; want %d", got, want)
    }
}

// Step 2: GREEN - Implement minimal code
func Add(a, b int) int {
    return a + b
}

// Step 3: REFACTOR if needed, verify tests still pass
```

## Table-Driven Tests

The standard pattern for Go tests:

```go
func TestAdd(t *testing.T) {
    tests := []struct {
        name     string
        a, b     int
        expected int
// ... (14 lines trimmed)
        })
    }
}
```

## Test Coverage

### Running Coverage

```bash
# Basic coverage
go test -cover ./...

# Generate coverage profile
go test -coverprofile=coverage.out ./...

# View coverage in browser
go tool cover -html=coverage.out

# View coverage by function
go tool cover -func=coverage.out
```

### Coverage Targets

| Code Type | Target |
|-----------|--------|
| Critical business logic | 100% |
| Public APIs | 90%+ |
| General code | 80%+ |
| Generated code | Exclude |

## Testing Commands

```bash
# Run all tests
go test ./...

# Run tests with verbose output
go test -v ./...
// ... (18 lines trimmed)

# Count test runs (for flaky test detection)
go test -count=10 ./...
```

## Best Practices

### DO

- Write tests FIRST (TDD)
- Use table-driven tests for comprehensive coverage
- Test behavior, not implementation
- Use `t.Helper()` in helper functions
- Use `t.Parallel()` for independent tests
- Clean up resources with `t.Cleanup()`
- Use meaningful test names that describe the scenario

### DON'T

- Test private functions directly (test through public API)
- Use `time.Sleep()` in tests (use channels or conditions)
- Ignore flaky tests (fix or remove them)
- Mock everything (prefer integration tests when possible)
- Skip error path testing

## References

- [Test Patterns](references/test-patterns.md) — Table-driven tests, subtests, helpers, golden files
- [Mocking & Benchmarks](references/mocking-benchmarks.md) — Interface mocking, benchmarks, fuzzing
- [HTTP Testing](references/http-testing.md) — HTTP handler testing and CI/CD integration
