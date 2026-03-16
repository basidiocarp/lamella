# Go Error Handling Patterns

Comprehensive error handling patterns for idiomatic Go code.

## Error Wrapping with Context

```go
// Good: Wrap errors with context
func LoadConfig(path string) (*Config, error) {
    data, err := os.ReadFile(path)
    if err != nil {
        return nil, fmt.Errorf("load config %s: %w", path, err)
    }

    var cfg Config
    if err := json.Unmarshal(data, &cfg); err != nil {
        return nil, fmt.Errorf("parse config %s: %w", path, err)
    }

    return &cfg, nil
}
```

## Custom Error Types

```go
// Define domain-specific errors
type ValidationError struct {
    Field   string
    Message string
}
// ... (8 lines trimmed)
    ErrUnauthorized = errors.New("unauthorized")
    ErrInvalidInput = errors.New("invalid input")
)
```

## Error Checking with errors.Is and errors.As

```go
func HandleError(err error) {
    // Check for specific error
    if errors.Is(err, sql.ErrNoRows) {
        log.Println("No records found")
        return
// ... (10 lines trimmed)
    // Unknown error
    log.Printf("Unexpected error: %v", err)
}
```

## Never Ignore Errors

```go
// Bad: Ignoring error with blank identifier
result, _ := doSomething()

// Good: Handle or explicitly document why it's safe to ignore
result, err := doSomething()
if err != nil {
    return err
}

// Acceptable: When error truly doesn't matter (rare)
_ = writer.Close() // Best-effort cleanup, error logged elsewhere
```

## Error Handling Anti-Patterns

```go
// Bad: Using panic for control flow
func GetUser(id string) *User {
    user, err := db.Find(id)
    if err != nil {
        panic(err) // Don't do this
// ... (9 lines trimmed)
    }
    return user, nil
}
```

## Best Practices

1. **Always wrap errors with context** - Use `fmt.Errorf` with `%w` verb
2. **Define sentinel errors for known cases** - Use `var ErrXxx = errors.New(...)`
3. **Use custom error types for structured errors** - Include relevant fields
4. **Check errors with errors.Is and errors.As** - Don't compare strings
5. **Never ignore errors silently** - Handle or document why safe to ignore
6. **Return errors, don't panic** - Panic only for truly unrecoverable situations
