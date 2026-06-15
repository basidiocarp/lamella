# Go Interface Design

Use these rules when deciding whether an abstraction should be an interface.

## Prefer Small Interfaces

```go
type Reader interface {
    Read(p []byte) (int, error)
}
```

## Define Interfaces Where They Are Consumed

```go
type UserStore interface {
    GetUser(id string) (*User, error)
    SaveUser(user *User) error
}
```

## Accept Interfaces, Return Structs

```go
func ProcessData(r io.Reader) (*Result, error) {
    data, err := io.ReadAll(r)
    if err != nil {
        return nil, err
    }
    return &Result{Data: data}, nil
}
```

## Rule

If the interface exists only to mirror one concrete implementation, wait to introduce it.
