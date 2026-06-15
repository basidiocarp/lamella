# Allocation Patterns

Use this reference for the common allocation fixes that actually move Go performance.

## Slice Preallocation

```go
results := make([]Result, 0, len(items))
for _, item := range items {
    results = append(results, process(item))
}
```

## String Building

```go
var b strings.Builder
for _, part := range parts {
    b.WriteString(part)
}
```

## `sync.Pool`

Use `sync.Pool` only for high-churn temporary objects that are proven hotspots.
