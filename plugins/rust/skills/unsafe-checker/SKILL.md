---
name: unsafe-checker
description: "Reviews unsafe Rust and FFI code for soundness risks."
allowed-tools: Read Grep Glob
metadata:
  globs: "**/*.rs"
origin: lamella
---

# Unsafe Code & FFI Review

Every `unsafe` block must have a `// SAFETY:` comment explaining the invariant.

## When Unsafe is Valid

1. Dereferencing raw pointers (after verifying validity)
2. Calling unsafe functions (after satisfying their preconditions)
3. Implementing unsafe traits (after guaranteeing invariants)
4. Accessing mutable statics (after ensuring no data races)
5. FFI (after ensuring ABI compatibility)

## Required Documentation

```rust
// SAFETY: `ptr` was allocated by `Box::into_raw` in `new()`,
// and we have exclusive access via `&mut self`.
unsafe { Box::from_raw(self.ptr) }
```

## Quick Reference

| Rule | Description |
|------|-------------|
| ffi-01 | Never pass Rust String/Vec directly to C. Use CString/CStr. |
| ffi-02 | Document every FFI function's safety requirements. |
| ffi-03 | Implement Drop for C-allocated pointers. |
| ffi-04 | Never let panics cross FFI boundary. Use catch_unwind. |
| ffi-05 | Use portable types (c_int, c_char) not Rust primitives for FFI. |
| mem-01 | Use repr(C) for types shared across FFI boundary. |
| mem-02 | Never assume memory layout without repr attribute. |
| ptr-01 | Prefer NonNull over raw pointers when null is invalid. |
| ptr-02 | Use PhantomData for ownership/lifetime of raw pointers. |
| ptr-03 | Check alignment before casting pointers. |
| safety-01 | Unsafe block must not panic if it would leave data inconsistent. |
| safety-02 | Verify all invariants before entering unsafe block. |
| safety-03 | Never expose uninitialized memory in public API. |
| safety-04 | Prevent double-free with ManuallyDrop or forget. |
| safety-05 | Audit Send/Sync impls manually — compiler can't verify. |

## FFI Pattern

```rust
// Safe wrapper around C library
mod ffi {
    extern "C" {
        fn c_create() -> *mut c_void;
        fn c_destroy(ptr: *mut c_void);
        fn c_process(ptr: *mut c_void, input: *const c_char) -> c_int;
    }
}

pub struct SafeWrapper {
    ptr: NonNull<c_void>,
}

impl SafeWrapper {
    pub fn new() -> Result<Self, Error> {
        // SAFETY: c_create returns null on failure, non-null on success
        let ptr = unsafe { ffi::c_create() };
        NonNull::new(ptr).map(|ptr| Self { ptr }).ok_or(Error::CreateFailed)
    }

    pub fn process(&mut self, input: &str) -> Result<(), Error> {
        let c_input = CString::new(input)?;
        // SAFETY: self.ptr is valid (created in new, not yet destroyed),
        // c_input is a valid null-terminated string
        let result = unsafe { ffi::c_process(self.ptr.as_ptr(), c_input.as_ptr()) };
        if result == 0 { Ok(()) } else { Err(Error::ProcessFailed(result)) }
    }
}

impl Drop for SafeWrapper {
    fn drop(&mut self) {
        // SAFETY: self.ptr was created by c_create and hasn't been destroyed
        unsafe { ffi::c_destroy(self.ptr.as_ptr()); }
    }
}
```

## Common Mistakes

| Bad | Better |
|-----|--------|
| No SAFETY comment | Always document the invariant |
| Large unsafe blocks | Minimize unsafe surface area |
| `transmute` for type conversion | Use `as` casts or `from_raw_parts` |
| Ignoring alignment | Check with `align_of` before casting |
| Raw pointer without PhantomData | Add PhantomData for lifetime tracking |
