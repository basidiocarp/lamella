# Go Sharp Edges

## Silent Integer Overflow

```go
var x int32 = math.MaxInt32
x = x + 1
```

Go wraps silently. That matters in:

- allocation sizes
- loop bounds
- financial or quota calculations

## Slice Aliasing

```go
original := []int{1, 2, 3, 4, 5}
left := original[1:3]
right := original[2:4]

left[1] = 999
```

Slices share backing storage. Copy before handing mutable slices across trust boundaries.

## Interface Nil Confusion

```go
var p *MyError = nil
var err error = p
```

The interface is non-nil even though the concrete pointer is nil. That is a classic auth and validation footgun when `nil` means success.

## JSON Decoder Pitfalls

- case-insensitive field matching
- duplicate keys are last-write-wins
- unknown fields are ignored unless you reject them

```go
decoder := json.NewDecoder(r.Body)
decoder.DisallowUnknownFields()
```

## Defer in Loops

`defer` runs at function exit, not loop iteration end. A loop that opens many files or sockets can exhaust resources before any close happens.

## Goroutine and Map Hazards

- goroutines can leak on blocked sends or receives
- ordinary maps are not safe for concurrent access
- closures in range loops can capture the wrong variable on older Go versions

See also [native-languages.md](native-languages.md) for the grouped cross-language review view.
