# Common Harness Patterns

## Pattern: Beyond Byte Arrays—Casting to Integers

**Use Case:** When target expects primitive types like integers or floats

**Implementation:**
```cpp
extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {
    // Ensure exactly 2 4-byte numbers
    if (size != 2 * sizeof(uint32_t)) {
        return 0;
    }

    // Split input into two integers
    uint32_t numerator = *(uint32_t*)(data);
    uint32_t denominator = *(uint32_t*)(data + sizeof(uint32_t));

    divide(numerator, denominator);
    return 0;
}
```

**Rust equivalent:**
```rust
fuzz_target!(|data: &[u8]| {
    if data.len() != 2 * std::mem::size_of::<i32>() {
        return;
    }

    let numerator = i32::from_ne_bytes([data[0], data[1], data[2], data[3]]);
    let denominator = i32::from_ne_bytes([data[4], data[5], data[6], data[7]]);

    divide(numerator, denominator);
});
```

**Why it works:** Any 8-byte input is valid. The fuzzer learns that inputs must be exactly 8 bytes, and every bit flip produces a new, potentially interesting input.

## Pattern: FuzzedDataProvider for Complex Inputs

**Use Case:** When target requires multiple strings, integers, or variable-length data

**Implementation:**
```cpp
#include "FuzzedDataProvider.h"

extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {
    FuzzedDataProvider fuzzed_data(data, size);

// ... (11 lines trimmed)

    return 0;
}
```

**Why it helps:** `FuzzedDataProvider` handles the complexity of extracting structured data from a byte stream. It's particularly useful for APIs that need multiple parameters of different types.

## Pattern: Interleaved Fuzzing

**Use Case:** When multiple related operations should be tested in a single harness

**Implementation:**
```cpp
extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {
    if (size < 1 + 2 * sizeof(int32_t)) {
        return 0;
    }

// ... (24 lines trimmed)
    printf("%d", result);
    return 0;
}
```

**Advantages:**
- Faster to write one harness than multiple individual harnesses
- Single shared corpus means interesting inputs for one operation may be interesting for others
- Can discover bugs in interactions between operations

**When to use:**
- Operations share similar input types
- Operations are logically related (e.g., arithmetic operations, CRUD operations)
- Single corpus makes sense across all operations

## Pattern: Structure-Aware Fuzzing with Arbitrary (Rust)

**Use Case:** When fuzzing Rust code that uses custom structs

**Implementation:**
```rust
use arbitrary::Arbitrary;

#[derive(Debug, Arbitrary)]
pub struct Name {
    data: String
// ... (11 lines trimmed)
        }
    }
}
```

**Harness with arbitrary:**
```rust
#![no_main]
use libfuzzer_sys::fuzz_target;

fuzz_target!(|data: your_project::Name| {
    data.check_buf();
});
```

**Add to Cargo.toml:**
```toml
[dependencies]
arbitrary = { version = "1", features = ["derive"] }
```

**Why it helps:** The `arbitrary` crate automatically handles deserialization of raw bytes into your Rust structs, reducing boilerplate and ensuring valid struct construction.

**Limitation:** The arbitrary crate doesn't offer reverse serialization, so you can't manually construct byte arrays that map to specific structs. This works best when starting from an empty corpus.
