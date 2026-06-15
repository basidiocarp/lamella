# Rust Sharp Edges

## Overflow Differs by Build

```rust
let x: u8 = 255;
let y = x + 1;
```

Debug builds panic. Release builds wrap. If overflow behavior matters, pick `checked_*`, `wrapping_*`, or `saturating_*` explicitly.

## Unsafe Blocks

Every `unsafe` block is a manual contract. Review for:

- raw pointer assumptions
- aliasing assumptions
- FFI invariants
- Send or Sync correctness

## Destructor-Skipping Patterns

```rust
let guard = mutex.lock().unwrap();
std::mem::forget(guard);
```

`mem::forget` is safe to call but dangerous to depend on. It can leak locks, file handles, and cleanup of sensitive buffers.

## Panics at FFI Boundaries

Panics crossing `extern "C"` boundaries are undefined behavior unless the boundary catches them.

## Unwrap and Interior Mutability

- `unwrap()` and `expect()` convert recoverable failures into crashes
- `RefCell` borrow violations fail at runtime, not compile time

Those are not always wrong, but they are sharp edges in libraries, plugins, and security-sensitive flows.

## Thread-Safety Markers

`unsafe impl Send` and `unsafe impl Sync` deserve the same scrutiny as raw pointer code. One incorrect marker can turn logical mistakes into data races.

See also [native-languages.md](native-languages.md) for the grouped cross-language review view.
