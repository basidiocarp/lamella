---
name: memory-safety-patterns
description: Applies memory-safe programming patterns such as RAII, ownership, smart pointers, and bounds checking across Rust, C++, and C. Use when managing resources, preventing memory bugs, or choosing safety strategies.
---

# Memory Safety Patterns


## Contents

- [Safety Spectrum](#safety-spectrum)
- [RAII in C++](#raii-in-c)
- [Smart Pointers in C++](#smart-pointers-in-c)
- [Ownership in Rust](#ownership-in-rust)
- [Safe Resource Management in C](#safe-resource-management-in-c)
- [Bounds Checking](#bounds-checking)
- [Preventing Data Races](#preventing-data-races)
- [Debugging Tools](#debugging-tools)

## Safety Spectrum

```
Manual (C) -> Smart Pointers (C++) -> Ownership (Rust) -> GC (Go, Java)
More control                                              More safety
```

## RAII in C++

Resource lifetime tied to object lifetime. Destructor runs on scope exit.

```cpp
class FileHandle {
public:
    explicit FileHandle(const std::string& path) : file_(path) {
        if (!file_.is_open()) throw std::runtime_error("Failed to open");
    }
// ... (18 lines trimmed)
    ~Transaction() { if (!committed_) target_ = backup_; }
    void commit() { committed_ = true; }
};
```

## Smart Pointers in C++

```cpp
// unique_ptr: single ownership, zero overhead
auto engine = std::make_unique<Engine>();
auto transferred = std::move(engine);

// shared_ptr: reference counted shared ownership
// ... (8 lines trimmed)
    new int(fd), &close_socket);

// Always use make_unique/make_shared (exception-safe, single allocation)
```

## Ownership in Rust

```rust
// Move semantics (default)
let s1 = String::from("hello");
let s2 = s1;  // s1 is moved, no longer valid

// Borrowing: multiple immutable OR one mutable
// ... (15 lines trimmed)
// Rc (single-threaded), Arc (multi-threaded) for shared ownership
let shared = Arc::new(vec![1, 2, 3]);
let clone = Arc::clone(&shared);
```

## Safe Resource Management in C

C lacks RAII. Use these patterns instead.

```c
// goto cleanup pattern
int process_file(const char* path) {
    FILE* file = NULL;
    char* buffer = NULL;
    int result = -1;
// ... (18 lines trimmed)
// GCC/Clang cleanup attribute
#define AUTO_FREE __attribute__((cleanup(auto_free_func)))
void auto_free_func(void** ptr) { free(*ptr); }
```

## Bounds Checking

```cpp
// C++: use .at() for bounds-checked access (throws std::out_of_range)
vec.at(10);
// Use std::span (C++20) for safe array views
// Use std::array for fixed-size with compile-time size
```

```rust
// Rust: bounds checked by default (panics)
let val = vec[2];
// Use .get() for Option instead of panic
match vec.get(10) {
    Some(val) => println!("{}", val),
    None => println!("Out of bounds"),
}
// Iterators avoid bounds checking entirely
```

## Preventing Data Races

```cpp
// C++: atomics for simple types, shared_mutex for read-heavy
std::atomic<int> counter{0};
counter.fetch_add(1, std::memory_order_relaxed);

std::shared_mutex mutex_;
std::shared_lock lock(mutex_);  // Multiple readers
std::unique_lock lock(mutex_);  // Exclusive writer
```

```rust
// Rust: compile-time data race prevention
// Arc<Mutex<T>> for shared mutable state
let data = Arc::new(Mutex::new(vec![]));
let mut vec = data.lock().unwrap();
// Arc<RwLock<T>> for read-heavy workloads
```

## Debugging Tools

```bash
clang++ -fsanitize=address -g source.cpp   # AddressSanitizer
clang++ -fsanitize=thread -g source.cpp    # ThreadSanitizer
valgrind --leak-check=full ./program       # Valgrind
cargo +nightly miri run                    # Rust undefined behavior
```

## Reference Files

| File | Description |
|------|-------------|
| [references/rust-unsafe-ffi-audit.md](references/rust-unsafe-ffi-audit.md) | Rust unsafe block audit rules, FFI patterns, SAFETY comments |
