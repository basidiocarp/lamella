# Go Error Handling Patterns

Use these patterns for idiomatic, inspectable Go error flows.

## Wrap with Context

```go
func LoadConfig(path string) (*Config, error) {
    data, err := os.ReadFile(path)
    if err != nil {
        return nil, fmt.Errorf("load config %s: %w", path, err)
    }
    return parseConfig(path, data)
}
```

## Typed or Sentinel Errors

```go
var ErrInvalidInput = errors.New("invalid input")
```

## Inspect with `errors.Is` and `errors.As`

```go
if errors.Is(err, sql.ErrNoRows) {
    return nil
}
```

## Rule

Do not ignore returned errors unless the code makes the best-effort behavior explicit.
