# Go Struct Design Patterns

Use these patterns when shaping API-facing structs and constructors.

## Functional Options

```go
type Server struct {
    addr    string
    timeout time.Duration
    logger  *log.Logger
}

type Option func(*Server)

func WithTimeout(d time.Duration) Option {
    return func(s *Server) { s.timeout = d }
}
```

## Embedding for Composition

```go
type Logger struct{ prefix string }

func (l *Logger) Log(msg string) {}

type Server struct {
    *Logger
}
```

## Zero Value Safety

```go
type Counter struct {
    mu    sync.Mutex
    count int
}
```

## Builder Alternative

```go
type ServerBuilder struct {
    addr    string
    timeout time.Duration
}

func (b ServerBuilder) Build() *Server {
    return &Server{addr: b.addr, timeout: b.timeout}
}
```
