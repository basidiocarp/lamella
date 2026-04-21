---
name: memory-safety-patterns
description: "Applies memory-safety patterns across Rust, C++, and C."
origin: lamella
---

# Memory Safety Patterns

Use this skill to choose the safest practical ownership and cleanup pattern for C, C++, or Rust code.

## Safety Spectrum

```text
Manual (C) -> Smart Pointers (C++) -> Ownership (Rust) -> GC languages
More control                                              More safety
```

## Routing Guide

- C++ resource lifetime and rollback: use RAII and scope-bound objects.
- Shared or transferred ownership in C++: use `unique_ptr`, `shared_ptr`, or custom deleters.
- Rust ownership, borrowing, or shared state: default to moves and borrowing, escalate to `Rc`, `Arc`, `Mutex`, or `RwLock` only when needed.
- C code: use explicit cleanup blocks and single-exit patterns.
- FFI and unsafe Rust: use the dedicated unsafe audit reference.

## Quick Patterns

```cpp
// C++ RAII
auto file = std::ifstream(path);
if (!file.is_open()) throw std::runtime_error("open failed");
```

```rust
// Rust ownership
let shared = std::sync::Arc::new(vec![1, 2, 3]);
let clone = std::sync::Arc::clone(&shared);
```

```c
// C cleanup block
FILE *file = fopen(path, "rb");
if (!file) goto cleanup;
/* ... */
cleanup:
if (file) fclose(file);
```

## References

- [references/rust-unsafe-ffi-audit.md](references/rust-unsafe-ffi-audit.md)
