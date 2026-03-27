# Generics and Type Parameters

## Basic Type Parameters

```go
func Max[T constraints.Ordered](a, b T) T {
	if a > b {
		return a
	}
	return b
}

func Map[T any, U any](items []T, fn func(T) U) []U {
	result := make([]U, 0, len(items))
	for _, item := range items {
		result = append(result, fn(item))
	}
	return result
}
```

## Type Constraints

```go
type Number interface {
	constraints.Integer | constraints.Float
}

func Double[T Number](value T) T {
	return value * 2
}
```

## Generic Data Structures

```go
type Stack[T any] struct {
	items []T
}

func (s *Stack[T]) Push(item T) {
	s.items = append(s.items, item)
}

func (s *Stack[T]) Pop() (T, bool) {
	var zero T
	if len(s.items) == 0 {
		return zero, false
	}

	last := s.items[len(s.items)-1]
	s.items = s.items[:len(s.items)-1]
	return last, true
}
```

## Comparable Constraint

```go
func Find[T comparable](slice []T, target T) (int, bool) {
	for i, v := range slice {
		if v == target {
			return i, true
		}
	}
	return -1, false
}

func Unique[T comparable](items []T) []T {
	seen := make(map[T]struct{}, len(items))
	result := make([]T, 0, len(items))
	for _, item := range items {
		if _, ok := seen[item]; ok {
			continue
		}
		seen[item] = struct{}{}
		result = append(result, item)
	}
	return result
}
```

## Generic Channels

```go
func Merge[T any](channels ...<-chan T) <-chan T {
	out := make(chan T)
	var wg sync.WaitGroup

	for _, ch := range channels {
		wg.Add(1)
		go func(ch <-chan T) {
			defer wg.Done()
			for value := range ch {
				out <- value
			}
		}(ch)
	}

	go func() {
		wg.Wait()
		close(out)
	}()

	return out
}
```

## Quick Reference

| Feature | Syntax | Use Case |
| ------- | ------ | -------- |
| Basic generic | `func F[T any]()` | Any type |
| Constraint | `func F[T Constraint]()` | Restricted types |
| Multiple params | `func F[T, U any]()` | Multiple type variables |
| Comparable | `func F[T comparable]()` | Types supporting `==` |
| Union | `T interface{int \| string}` | Either type |
