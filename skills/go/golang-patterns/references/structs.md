# Go Struct Design Patterns

Patterns for designing and configuring Go struct types.

## Functional Options Pattern

```go
type Server struct {
    addr    string
    timeout time.Duration
    logger  *log.Logger
}
// ... (29 lines trimmed)
    WithTimeout(60*time.Second),
    WithLogger(customLogger),
)
```

## Embedding for Composition

```go
type Logger struct {
    prefix string
}

func (l *Logger) Log(msg string) {
// ... (15 lines trimmed)
// Usage
s := NewServer(":8080")
s.Log("Starting...") // Calls embedded Logger.Log
```

## Make the Zero Value Useful

```go
// Good: Zero value is useful
type Counter struct {
    mu    sync.Mutex
    count int // zero value is 0, ready to use
}
// ... (12 lines trimmed)
type BadCounter struct {
    counts map[string]int // nil map will panic
}
```

## Builder Pattern (Alternative to Functional Options)

```go
type ServerBuilder struct {
    addr    string
    timeout time.Duration
    logger  *log.Logger
}
// ... (29 lines trimmed)
    WithTimeout(60 * time.Second).
    WithLogger(customLogger).
    Build()
```

## Best Practices

1. **Make zero values useful** - No nil map panics, no required initialization
2. **Use functional options for optional config** - Clean API, extensible
3. **Use embedding for composition** - Not inheritance
4. **Prefer composition over complex hierarchies** - Go doesn't have inheritance
