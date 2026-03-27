# Fuzz Test Patterns

Use this reference for Go fuzz tests.

```go
func FuzzParseJSON(f *testing.F) {
    f.Add(`{"name":"test"}`)
    f.Fuzz(func(t *testing.T, input string) {
        _ = ParseJSON(input)
    })
}
```

- Seed the corpus with representative valid and invalid inputs.
- Assert invariants, not just absence of panics.
