---
name: golang-patterns
description: "Applies idiomatic Go development patterns."
origin: lamella
---

# Go Development Patterns


## Contents

- [When to Use](#when-to-use)
- [Core Principles](#core-principles)
- [Quick Reference](#quick-reference)
- [Anti-Patterns](#anti-patterns)
- [Tooling](#tooling)
- [References](#references)


Idiomatic Go patterns for building robust, efficient, and maintainable applications.

## When to Use

- Writing new Go code
- Reviewing Go code
- Refactoring existing Go code
- Designing Go packages/modules
- Using Go generics (type parameters, constraints)
- Structuring Go projects (module layout, internal packages)

## Core Principles

### 1. Simplicity and Clarity

Go favors simplicity over cleverness. Code should be obvious and easy to read.

```go
// Good: Clear and direct
func GetUser(id string) (*User, error) {
    user, err := db.FindUser(id)
    if err != nil {
        return nil, fmt.Errorf("get user %s: %w", id, err)
    }
    return user, nil
}
```

### 2. Make the Zero Value Useful

Design types so their zero value is immediately usable.

```go
// Good: Zero value is useful
type Counter struct {
    mu    sync.Mutex
    count int // zero value is 0, ready to use
}

// Good: bytes.Buffer works with zero value
var buf bytes.Buffer
buf.WriteString("hello")
```

### 3. Accept Interfaces, Return Structs

```go
// Good: Accepts interface, returns concrete type
func ProcessData(r io.Reader) (*Result, error) {
    data, err := io.ReadAll(r)
    if err != nil {
        return nil, err
    }
    return &Result{Data: data}, nil
}
```

## Quick Reference

| Idiom | Description |
|-------|-------------|
| Accept interfaces, return structs | Functions accept interface params, return concrete types |
| Errors are values | Treat errors as first-class values, not exceptions |
| Don't communicate by sharing memory | Use channels for coordination |
| Make the zero value useful | Types should work without explicit initialization |
| A little copying > a little dependency | Avoid unnecessary external dependencies |
| Clear is better than clever | Prioritize readability |
| gofmt is law | Always format with gofmt/goimports |
| Return early | Handle errors first, keep happy path unindented |

## Anti-Patterns

```go
// Bad: Naked returns in long functions
func process() (result int, err error) {
    // ... 50 lines ...
    return // What is being returned?
}

// Better: explicit return values
func process() (int, error) {
    result := 42
    return result, nil
}

// Bad: mixed receiver semantics on one type
type Counter struct{ n int }
func (c Counter) Value() int     // Value receiver
func (c *Counter) Increment()    // Pointer receiver - be consistent
```

## Tooling

### Essential Commands

```bash
go build ./...          # Build
go test ./...           # Test
go test -race ./...     # Test with race detection
go vet ./...            # Static analysis
golangci-lint run       # Comprehensive linting
go mod tidy             # Clean dependencies
gofmt -w .              # Format
```

### Recommended .golangci.yml

```yaml
linters:
  enable:
    - errcheck
    - gosimple
    - govet
    - staticcheck
    - gofmt
    - goimports

linters-settings:
  errcheck:
    check-type-assertions: true
  govet:
    check-shadowing: true
```

## References

Detailed patterns with code examples:

- [references/error-handling.md](references/error-handling.md) - Error wrapping, custom types, checking
- [references/concurrency.md](references/concurrency.md) - Worker pools, context, graceful shutdown, errgroup
- [references/interfaces.md](references/interfaces.md) - Small interfaces, composition, type assertions
- [references/packages.md](references/packages.md) - Project layout, naming, avoiding global state
- [references/structs.md](references/structs.md) - Functional options, embedding, zero values
- [references/performance.md](references/performance.md) - Slice preallocation, sync.Pool, string building
- [references/generics.md](references/generics.md) - Type parameters, constraints, generic patterns (Go 1.18+)
- [references/project-structure.md](references/project-structure.md) - Module layout, internal packages, go.mod organization

**Remember**: Go code should be boring in the best way - predictable, consistent, and easy to understand. When in doubt, keep it simple.
