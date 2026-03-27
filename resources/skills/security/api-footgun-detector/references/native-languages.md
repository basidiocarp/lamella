# Native Languages

This group covers C/C++, Go, and Rust.

## C / C++

### Integer Overflow

```c
int x = INT_MAX;
if (x + 1 > x) {
    // Compiler may optimize this based on undefined behavior assumptions.
}

size_t size = user_count * sizeof(struct User);
void *buf = malloc(size);
```

Signed overflow is undefined behavior. Size calculations and bounds checks built on it are not trustworthy.

### Buffer and Format Hazards

```c
char buf[64];
strcpy(buf, user_input);
sprintf(buf, "Hello %s", name);
printf(user_input);
```

Review for:

- no bounds check
- missing null terminator handling
- user-controlled format strings

### Cleanup of Secrets

```c
memset(password, 0, sizeof(password));
```

Compilers can optimize this away. Prefer `explicit_bzero` or another non-elidable cleanup primitive.

## Go

### Silent Overflow

```go
var x int32 = math.MaxInt32
x = x + 1
```

Overflow wraps silently, which is especially dangerous in allocation and loop-bound calculations.

### Slice Aliasing

```go
original := []int{1, 2, 3, 4, 5}
left := original[1:3]
right := original[2:4]

left[1] = 999
```

Both slices share the same backing array. This becomes a footgun when one caller assumes an isolated copy.

### Typed Nil in Interfaces

```go
var p *MyError = nil
var err error = p

if err != nil {
    // True, even though the underlying pointer is nil.
}
```

That pattern frequently leaks into auth, validation, or policy code where `nil` means success.

### JSON Surprises

Go’s JSON decoding is case-insensitive and duplicate keys are last-write-wins. That can turn lax decoding into privilege-escalation or override bugs.

## Rust

### Debug vs Release Overflow

```rust
let x: u8 = 255;
let y = x + 1;
```

Debug builds panic. Release builds wrap. If overflow behavior matters, make it explicit with `checked_*`, `wrapping_*`, or `saturating_*`.

### Unsafe Blocks

Every `unsafe` block is a trust boundary. Treat it like an API surface, not an implementation detail.

### Destructor-Skipping Patterns

```rust
let guard = mutex.lock().unwrap();
std::mem::forget(guard);
```

`mem::forget` can leak locks, file handles, and key material cleanup.

### Panic-Oriented APIs

`unwrap()` and `expect()` are acceptable for invariants in binaries, but they become sharp edges in libraries and security-sensitive flows where failure should stay explicit.
