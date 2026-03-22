# Go Memory and Performance Patterns

Optimization patterns for memory-efficient and performant Go code.

## Preallocate Slices When Size is Known

```go
// Bad: Grows slice multiple times
func processItems(items []Item) []Result {
    var results []Result
    for _, item := range items {
        results = append(results, process(item))
// ... (9 lines trimmed)
    }
    return results
}
```

## Use sync.Pool for Frequent Allocations

```go
var bufferPool = sync.Pool{
    New: func() interface{} {
        return new(bytes.Buffer)
    },
}
// ... (9 lines trimmed)
    // Process...
    return buf.Bytes()
}
```

## Avoid String Concatenation in Loops

```go
// Bad: Creates many string allocations
func join(parts []string) string {
    var result string
    for _, p := range parts {
        result += p + ","
// ... (17 lines trimmed)
func join(parts []string) string {
    return strings.Join(parts, ",")
}
```

## Go Tooling Integration

### Essential Commands

```bash
# Build and run
go build ./...
go run ./cmd/myapp

# Testing
// ... (13 lines trimmed)
# Formatting
gofmt -w .
goimports -w .
```

### Recommended Linter Configuration (.golangci.yml)

```yaml
linters:
  enable:
    - errcheck
    - gosimple
    - govet
// ... (14 lines trimmed)

issues:
  exclude-use-default: false
```

## Performance Best Practices

1. **Preallocate slices** - When capacity is known or can be estimated
2. **Use sync.Pool** - For frequently allocated temporary objects
3. **Use strings.Builder** - For building strings in loops
4. **Prefer standard library** - Usually well-optimized
5. **Profile before optimizing** - `go test -bench` and `go tool pprof`
6. **Use -race flag in tests** - Catch data races early
