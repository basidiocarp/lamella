# Mocking and Benchmarks

Interface-based mocking, benchmarks, and fuzzing patterns.

## Interface-Based Mocking

```go
// Define interface for dependencies
type UserRepository interface {
    GetUser(id string) (*User, error)
    SaveUser(user *User) error
}
// ... (42 lines trimmed)
        t.Errorf("got name %q; want %q", user.Name, "Alice")
    }
}
```

## Benchmarks

### Basic Benchmarks

```go
func BenchmarkProcess(b *testing.B) {
    data := generateTestData(1000)
    b.ResetTimer() // Don't count setup time

    for i := 0; i < b.N; i++ {
        Process(data)
    }
}

// Run: go test -bench=BenchmarkProcess -benchmem
// Output: BenchmarkProcess-8   10000   105234 ns/op   4096 B/op   10 allocs/op
```

### Benchmark with Different Sizes

```go
func BenchmarkSort(b *testing.B) {
    sizes := []int{100, 1000, 10000, 100000}

    for _, size := range sizes {
        b.Run(fmt.Sprintf("size=%d", size), func(b *testing.B) {
// ... (9 lines trimmed)
        })
    }
}
```

### Memory Allocation Benchmarks

```go
func BenchmarkStringConcat(b *testing.B) {
    parts := []string{"hello", "world", "foo", "bar", "baz"}

    b.Run("plus", func(b *testing.B) {
        for i := 0; i < b.N; i++ {
// ... (21 lines trimmed)
        }
    })
}
```

## Fuzzing (Go 1.18+)

### Basic Fuzz Test

```go
func FuzzParseJSON(f *testing.F) {
    // Add seed corpus
    f.Add(`{"name": "test"}`)
    f.Add(`{"count": 123}`)
    f.Add(`[]`)
// ... (17 lines trimmed)
}

// Run: go test -fuzz=FuzzParseJSON -fuzztime=30s
```

### Fuzz Test with Multiple Inputs

```go
func FuzzCompare(f *testing.F) {
    f.Add("hello", "world")
    f.Add("", "")
    f.Add("abc", "abc")

// ... (15 lines trimmed)
        }
    })
}
```
