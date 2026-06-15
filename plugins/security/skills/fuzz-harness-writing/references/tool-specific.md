# Tool-Specific Harness Guidance

Quick harness patterns by fuzzing engine.

## libFuzzer

```cpp
extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {
    target(data, size);
    return 0;
}
```

- Use `-fsanitize=fuzzer,address` for local crash discovery.
- Start with an empty or tiny corpus and add dictionaries only when coverage stalls.

## AFL++

```cpp
#include <unistd.h>

int main() {
    __AFL_FUZZ_INIT();
    unsigned char *buf = __AFL_FUZZ_TESTCASE_BUF;

    while (__AFL_LOOP(1000)) {
        int len = __AFL_FUZZ_TESTCASE_LEN;
        target(buf, len);
    }
    return 0;
}
```

- Prefer persistent mode for throughput.
- Seed the corpus with at least one valid input.

## cargo-fuzz

```rust
#![no_main]
use libfuzzer_sys::fuzz_target;

fuzz_target!(|data: &[u8]| {
    target(data);
});
```

- Use `arbitrary` when the target needs structured input.
- Keep harnesses in `fuzz/fuzz_targets/`.

## go-fuzz

```go
func Fuzz(data []byte) int {
    target(data)
    return 0
}
```

- Return `-1` for structurally invalid inputs when that helps AFL-style prioritization.
- Use a small seed corpus to bootstrap parser-heavy targets.
