---
description: "Go development commands — build, test, review"
argument-hint: "<subcommand> [args] — subcommands: build, test, review"
---

# Go Command

Go-specific development workflow commands.

## Subcommands

| Subcommand | Purpose |
|------------|---------|
| `build` | Fix build errors, vet warnings, linter issues |
| `test` | TDD workflow with table-driven tests |
| `review` | Code review for idioms, concurrency, security |

## Routing

```
subcommand = first_word($ARGUMENTS)
remaining_args = rest($ARGUMENTS)
```

---

## /go build

Fix Go build errors incrementally with minimal changes.

**Workflow:**
1. Run diagnostics: `go build`, `go vet`, `staticcheck`
2. Parse and group errors by file, sort by severity
3. Fix one error at a time
4. Re-run build after each fix
5. Report what was fixed and what remains

**When to use:** When `go build ./...` fails

---

## /go test

TDD workflow with idiomatic Go testing patterns.

**Workflow:**
1. Define types/interfaces first
2. Write table-driven tests (RED)
3. Verify tests fail for right reason
4. Implement minimal code (GREEN)
5. Refactor while keeping tests green
6. Verify 80%+ coverage with `go test -cover`

**Table-Driven Pattern:**
```go
tests := []struct {
    name     string
    input    InputType
    expected OutputType
    wantErr  bool
}{
    {"happy path", validInput, expectedOutput, false},
    {"empty input", emptyInput, zeroValue, true},
}
for _, tt := range tests {
    t.Run(tt.name, func(t *testing.T) {
        // test logic
    })
}
```

---

## /go review

Comprehensive Go-specific code review.

**Checks:**
1. Static analysis: `go vet`, `staticcheck`, `golangci-lint`
2. Security: SQL injection, command injection, race conditions
3. Concurrency: goroutine safety, channel usage, mutex patterns
4. Idioms: Go conventions and best practices

**Categories:**
- Error handling patterns
- Interface design
- Package organization
- Naming conventions

---

## Usage Examples

```bash
# Fix build errors
/go build ./cmd/server

# TDD for new feature
/go test user authentication handler

# Review recent changes
/go review src/api/handlers
```
