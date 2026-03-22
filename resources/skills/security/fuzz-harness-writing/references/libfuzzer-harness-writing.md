# Writing a Harness

The harness is the entry point for the fuzzer. libFuzzer calls the `LLVMFuzzerTestOneInput` function repeatedly with different inputs.

## Harness Structure

```c++
#include <stdint.h>
#include <stddef.h>

extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {
    // 1. Optional: Validate input size
// ... (15 lines trimmed)
    // 4. Always return 0 (non-zero reserved for future use)
    return 0;
}
```

## Harness Rules

| Do | Don't |
|----|-------|
| Handle all input types (empty, huge, malformed) | Call `exit()` - stops fuzzing process |
| Join all threads before returning | Leave threads running |
| Keep harness fast and simple | Add excessive logging or complexity |
| Maintain determinism | Use random number generators or read `/dev/random` |
| Reset global state between runs | Rely on state from previous executions |
| Use narrow, focused targets | Mix unrelated data formats (PNG + TCP) in one harness |

**Rationale:**
- **Speed matters:** Aim for 100s-1000s executions per second per core
- **Reproducibility:** Crashes must be reproducible after fuzzing completes
- **Isolation:** Each execution should be independent

## Using FuzzedDataProvider for Complex Inputs

For complex inputs (strings, multiple parameters), use the `FuzzedDataProvider` helper:

```c++
#include <stdint.h>
#include <stddef.h>
#include "FuzzedDataProvider.h"  // From LLVM project

extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {
// ... (12 lines trimmed)

    return 0;
}
```

Download `FuzzedDataProvider.h` from the [LLVM repository](https://github.com/llvm/llvm-project/blob/main/compiler-rt/include/fuzzer/FuzzedDataProvider.h).

## Interleaved Fuzzing

Use a single harness to test multiple related functions:

```c++
extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {
    if (size < 1 + 2 * sizeof(int32_t)) {
        return 0;
    }

// ... (11 lines trimmed)

    return 0;
}
```

> **See Also:** For detailed harness writing techniques, patterns for handling complex inputs,
> structure-aware fuzzing, and protobuf-based fuzzing, see the **fuzz-harness-writing** technique skill.
