# Benchmark Patterns

Use this reference for stable, comparable Go benchmarks.

```go
func BenchmarkSort(b *testing.B) {
    for _, size := range []int{100, 1000, 10000} {
        b.Run(fmt.Sprintf("size=%d", size), func(b *testing.B) {
            for i := 0; i < b.N; i++ {
                runSort(size)
            }
        })
    }
}
```

- Reset timers after setup.
- Track allocations with `-benchmem`.
- Benchmark multiple sizes when asymptotic behavior matters.
