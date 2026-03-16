# Go Concurrency Patterns


## Contents

- [Worker Pool](#worker-pool)
- [Fan-Out/Fan-In Pipeline](#fan-outfan-in-pipeline)
- [Errgroup with Cancellation](#errgroup-with-cancellation)
- [Bounded Concurrency with Semaphore](#bounded-concurrency-with-semaphore)
- [Graceful Shutdown](#graceful-shutdown)
- [Select Patterns](#select-patterns)
- [sync.Map](#syncmap)
- [Race Detection](#race-detection)
- [Rules](#rules)


## Worker Pool

```go
func WorkerPool(ctx context.Context, numWorkers int, jobs <-chan Job) <-chan Result {
    results := make(chan Result, len(jobs))
    var wg sync.WaitGroup

    for i := 0; i < numWorkers; i++ {
// ... (18 lines trimmed)

    return results
}
```

## Fan-Out/Fan-In Pipeline

```go
func generate(ctx context.Context, nums ...int) <-chan int {
    out := make(chan int)
    go func() {
        defer close(out)
        for _, n := range nums {
// ... (28 lines trimmed)
    go func() { wg.Wait(); close(out) }()
    return out
}
```

## Errgroup with Cancellation

```go
func fetchAll(ctx context.Context, urls []string) ([]string, error) {
    g, ctx := errgroup.WithContext(ctx)
    results := make([]string, len(urls))

    for i, url := range urls {
// ... (22 lines trimmed)
// With concurrency limit
g, ctx := errgroup.WithContext(ctx)
g.SetLimit(10)
```

## Bounded Concurrency with Semaphore

```go
// Channel-based semaphore
type Semaphore chan struct{}

func NewSemaphore(n int) Semaphore { return make(chan struct{}, n) }
func (s Semaphore) Acquire()       { s <- struct{}{} }
func (s Semaphore) Release()       { <-s }

// Or use golang.org/x/sync/semaphore for weighted semaphore
```

## Graceful Shutdown

```go
func main() {
    ctx, cancel := context.WithCancel(context.Background())

    sigCh := make(chan os.Signal, 1)
    signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)
// ... (17 lines trimmed)
        fmt.Println("Shutdown timed out")
    }
}
```

## Select Patterns

```go
// Timeout
select {
case v := <-ch:
    fmt.Println("Received:", v)
case <-time.After(time.Second):
    fmt.Println("Timeout")
}

// Non-blocking send/receive
select {
case ch <- 42:
default:
    fmt.Println("Channel full, skipping")
}
```

## sync.Map

Use for concurrent maps with frequent reads and infrequent writes. For write-heavy workloads, use a sharded map with per-shard `sync.RWMutex`.

```go
var cache sync.Map
cache.Store("key", "value")
val, ok := cache.Load("key")
```

## Race Detection

```bash
go test -race ./...
go build -race .
```

## Rules

- Close channels from sender side only. Closing from receiver panics.
- Always provide an exit path for goroutines. Leaked goroutines are memory leaks.
- Buffer channels when you know the count.
- Check `ctx.Done()` in loops inside goroutines.
- Never use `time.Sleep` for synchronization.
- Prefer `errgroup` over manual `WaitGroup` + error collection.
