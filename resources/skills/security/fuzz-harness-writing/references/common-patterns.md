# Common Fuzzing Harness Patterns

Use these patterns when the target needs more structure than a raw byte slice
but does not justify a large custom input model.

## Primitive Splitting

Use fixed-width parsing when the target expects a small number of integers or
flags.

```cpp
extern "C" int LLVMFuzzerTestOneInput(const uint8_t* data, size_t size) {
    if (size != 2 * sizeof(uint32_t)) {
        return 0;
    }

    uint32_t numerator = 0;
    uint32_t denominator = 0;
    memcpy(&numerator, data, sizeof(uint32_t));
    memcpy(&denominator, data + sizeof(uint32_t), sizeof(uint32_t));

    divide(numerator, denominator);
    return 0;
}
```

Prefer `memcpy` or explicit byte conversion over pointer casts so alignment and
aliasing bugs stay out of the harness.

## `FuzzedDataProvider`

Use `FuzzedDataProvider` for mixed strings, numbers, and variable-length fields.

```cpp
#include "FuzzedDataProvider.h"

extern "C" int LLVMFuzzerTestOneInput(const uint8_t* data, size_t size) {
    FuzzedDataProvider provider(data, size);

    auto user = provider.ConsumeRandomLengthString(64);
    auto count = provider.ConsumeIntegralInRange<uint32_t>(0, 1000);
    auto body = provider.ConsumeRemainingBytes<uint8_t>();

    parse_record(user, count, body.data(), body.size());
    return 0;
}
```

This keeps the harness readable and preserves stable boundaries between fields.

## Interleaved Related Operations

Use one harness for a few tightly related operations when a shared corpus is
helpful.

```cpp
extern "C" int LLVMFuzzerTestOneInput(const uint8_t* data, size_t size) {
    FuzzedDataProvider provider(data, size);

    switch (provider.ConsumeIntegralInRange<uint8_t>(0, 2)) {
        case 0:
            parse_header(provider.ConsumeRemainingBytes<uint8_t>().data(), size);
            break;
        case 1:
            normalize_header(provider.ConsumeRandomLengthString(128));
            break;
        case 2:
            serialize_header(provider.ConsumeIntegral<uint16_t>());
            break;
    }

    return 0;
}
```

Do not combine unrelated formats. Shared corpora help only when the branches
explore the same conceptual surface.

## Structure-Aware Rust Targets

Use `arbitrary` when the Rust target already wants a typed input shape.

```rust
use arbitrary::Arbitrary;
use libfuzzer_sys::fuzz_target;

#[derive(Debug, Arbitrary)]
struct Request {
    method: u8,
    path: String,
    body: Vec<u8>,
}

fuzz_target!(|req: Request| {
    handle_request(req.method, &req.path, &req.body);
});
```

This reduces parsing noise and lets the fuzzer mutate semantic fields instead of
raw offsets.

## Structured Formats

For heavily structured inputs, use a generator or mutator layer instead of
manually decoding every byte in the harness:

- `arbitrary` for Rust structs
- protobuf plus libprotobuf-mutator for C and C++
- format-native builders for JSON, AST, or protocol message trees

Use this when parse failures dominate coverage and the raw corpus cannot reach
interesting logic.

## Non-Determinism and Global State

Two recurring harness failures:

- non-determinism from time, randomness, or process state
- state leakage between iterations

Typical mitigations:

```cpp
extern "C" int LLVMFuzzerTestOneInput(const uint8_t* data, size_t size) {
    global_reset();

    FuzzedDataProvider provider(data, size);
    uint32_t seed = provider.ConsumeIntegral<uint32_t>();
    srand(seed);

    target_function(provider.ConsumeRemainingBytes<uint8_t>().data(), size);

    global_cleanup();
    return 0;
}
```

Mock clocks or random sources when possible. The goal is input-driven behavior,
not environment-driven behavior.

## Pattern Selection

| Target shape | Best pattern |
|---|---|
| Fixed small arguments | Primitive splitting |
| Mixed strings and scalars | `FuzzedDataProvider` |
| Typed Rust domain objects | `arbitrary` |
| Rich nested schemas | Structure-aware generators |
| Shared parser and serializer flows | Interleaved related operations |

Use the simplest pattern that gives stable, high-signal inputs.
