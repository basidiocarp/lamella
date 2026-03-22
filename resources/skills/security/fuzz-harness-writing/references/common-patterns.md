# Common Fuzzing Harness Patterns

Detailed patterns for different fuzzing scenarios.

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

**Why it helps:** `FuzzedDataProvider` handles the complexity of extracting structured data from a byte stream.

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

## Structure-Aware Fuzzing with Protocol Buffers

For highly structured input formats, consider using Protocol Buffers as an intermediate format with custom mutators:

```cpp
// Define your input format in .proto file
// Use libprotobuf-mutator to generate valid mutations
// This ensures fuzzer mutates message contents, not the protobuf encoding itself
```

This approach is more setup but prevents the fuzzer from wasting time on unparseable inputs.

## Handling Non-Determinism

**Problem:** Random values or timing dependencies cause non-reproducible crashes.

**Solutions:**
- Replace `rand()` with deterministic PRNG seeded from fuzzer input:
  ```cpp
  uint32_t seed = fuzzed_data.ConsumeIntegral<uint32_t>();
  srand(seed);
  ```
- Mock system calls that return time, PIDs, or random data
- Avoid reading from `/dev/random` or `/dev/urandom`

## Resetting Global State

If your SUT uses global state, reset it between iterations:

```cpp
extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {
    // Reset global state before each iteration
    global_reset();

    target_function(data, size);

    // Clean up resources
    global_cleanup();
    return 0;
}
```

**Rationale:** Global state can cause crashes after N iterations rather than on a specific input, making bugs non-reproducible.
