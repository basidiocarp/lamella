# Profiling and Tooling

Use this reference when you need to prove where Go time or memory is going.

## Commands

```bash
go test ./...
go test -bench=. -benchmem ./...
go test -race ./...
go test -cpuprofile=cpu.out -memprofile=mem.out ./...
go tool pprof cpu.out
```

## Tooling Rule

- Start with tests, benchmarks, and profiles.
- Use linter warnings to catch allocation-heavy or error-prone patterns early.
