---
name: golang-testing
description: "Implements idiomatic Go testing patterns."
origin: lamella
---

# Go Testing Patterns

Use this skill when writing or improving Go tests.

## Core Rules

1. use table-driven tests for behavior matrices
2. keep the red, green, refactor loop tight
3. test behavior through public APIs
4. use benchmarks and fuzzing where inputs or performance matter

## Quick Commands

```shell
go test ./...
go test -v ./...
go test -cover ./...
go test -run TestAdd ./...
```

## References

- [references/test-patterns.md](references/test-patterns.md)
- [references/mocking-benchmarks.md](references/mocking-benchmarks.md)
- [references/http-testing.md](references/http-testing.md)
- [references/benchmark-patterns.md](references/benchmark-patterns.md)
- [references/fuzz-test-patterns.md](references/fuzz-test-patterns.md)
- [references/interface-mocks.md](references/interface-mocks.md)
