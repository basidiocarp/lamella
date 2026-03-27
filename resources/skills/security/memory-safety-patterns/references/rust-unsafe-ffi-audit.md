# Unsafe Code & FFI Review (Rust)

> Absorbed from standalone unsafe-checker skill.

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
        fn c_process(ptr: *mut c_void, input: *const u8, len: usize) -> c_int;
    }
}

pub struct Handle {
    ptr: NonNull<c_void>,
}

impl Handle {
    pub fn new() -> Option<Self> {
        let ptr = unsafe { ffi::c_create() };
        NonNull::new(ptr).map(|ptr| Self { ptr })
    }

    pub fn process(&mut self, input: &[u8]) -> Result<(), i32> {
        let rc = unsafe { ffi::c_process(self.ptr.as_ptr(), input.as_ptr(), input.len()) };
        if rc == 0 { Ok(()) } else { Err(rc) }
    }
}

impl Drop for Handle {
    fn drop(&mut self) {
        // SAFETY: `self.ptr` came from `c_create` and is owned by this wrapper.
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
