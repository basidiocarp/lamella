# Generics and Type Parameters

## Basic Type Parameters

```go
package main

// Generic function with type parameter
func Max[T constraints.Ordered](a, b T) T {
    if a > b {
// ... (21 lines trimmed)
    doubled := Map(nums, func(n int) int { return n * 2 })
    strings := Map(nums, func(n int) string { return fmt.Sprintf("%d", n) })
}
```

## Type Constraints

```go
import "constraints"

// Built-in constraints
type Number interface {
    constraints.Integer | constraints.Float
// ... (34 lines trimmed)
    fmt.Println(Double(5))          // int
    fmt.Println(Double(MyInt(5)))   // MyInt
}
```

## Generic Data Structures

```go
// Generic Stack
type Stack[T any] struct {
    items []T
}

// ... (29 lines trimmed)
stringStack := NewStack[string]()
stringStack.Push("hello")
stringStack.Push("world")
```

## Generic Map Operations

```go
// Filter with generics
func Filter[T any](slice []T, predicate func(T) bool) []T {
    result := make([]T, 0, len(slice))
    for _, v := range slice {
        if predicate(v) {
// ... (39 lines trimmed)
m := map[string]int{"a": 1, "b": 2}
keys := Keys(m)     // []string{"a", "b"}
values := Values(m) // []int{1, 2}
```

## Generic Pairs and Tuples

```go
// Generic Pair
type Pair[T, U any] struct {
    First  T
    Second U
}
// ... (38 lines trimmed)
    }
    return r.value
}
```

## Comparable Constraint

```go
// Find using comparable
func Find[T comparable](slice []T, target T) (int, bool) {
    for i, v := range slice {
        if v == target {
            return i, true
// ... (28 lines trimmed)
unique := Unique(nums) // []int{1, 2, 3, 4}

idx, found := Find([]string{"a", "b", "c"}, "b") // 1, true
```

## Generic Interfaces

```go
// Generic interface
type Container[T any] interface {
    Add(item T)
    Remove() (T, bool)
    Size() int
// ... (27 lines trimmed)
    c.Add(item)
    fmt.Printf("Container size: %d\n", c.Size())
}
```

## Type Inference

```go
// Type inference works in most cases
func Identity[T any](x T) T {
    return x
}

// ... (17 lines trimmed)
result := Map[int, string]([]int{1, 2}, func(n int) string {
    return fmt.Sprintf("%d", n)
})
```

## Generic Channels

```go
// Generic channel operations
func Merge[T any](channels ...<-chan T) <-chan T {
    out := make(chan T)
    var wg sync.WaitGroup

// ... (36 lines trimmed)
numbers := make(chan int)
doubled := Stage(numbers, func(n int) int { return n * 2 })
strings := Stage(doubled, func(n int) string { return fmt.Sprintf("%d", n) })
```

## Union Constraints

```go
// Union of types
type StringOrInt interface {
    string | int
}

// ... (30 lines trimmed)
        panic("unreachable")
    }
}
```

## Quick Reference

| Feature | Syntax | Use Case |
|---------|--------|----------|
| Basic generic | `func F[T any]()` | Any type |
| Constraint | `func F[T Constraint]()` | Restricted types |
| Multiple params | `func F[T, U any]()` | Multiple type variables |
| Comparable | `func F[T comparable]()` | Types supporting == and != |
| Ordered | `func F[T constraints.Ordered]()` | Types supporting <, >, <=, >= |
| Union | `T interface{int \| string}` | Either type |
| Approximate | `~int` | Include type aliases |
