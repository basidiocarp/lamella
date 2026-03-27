# Interface Mocks

Use this reference when designing test seams for dependencies.

```go
type UserRepository interface {
    GetUser(id string) (*User, error)
    SaveUser(user *User) error
}
```

- Mock the interface owned by the caller, not a broad external dependency surface.
- Keep mock behavior explicit and minimal.
