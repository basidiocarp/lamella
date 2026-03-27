# Go Concurrency Patterns

Use these patterns when coordinating goroutines, cancellation, and bounded work.

## Worker Pool

```go
func WorkerPool(ctx context.Context, jobs <-chan Job, workers int) <-chan Result {
    results := make(chan Result)
    var wg sync.WaitGroup
    for i := 0; i < workers; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            for job := range jobs {
                select {
                case <-ctx.Done():
                    return
                case results <- process(job):
                }
            }
        }()
    }
    go func() { wg.Wait(); close(results) }()
    return results
}
```

## Errgroup with Cancellation

```go
g, ctx := errgroup.WithContext(ctx)
g.SetLimit(10)
```

## Guardrails

- Prefer context cancellation over custom shutdown flags.
- Bound concurrency when external services or memory are involved.
- Run `go test -race` on concurrency-heavy code.
