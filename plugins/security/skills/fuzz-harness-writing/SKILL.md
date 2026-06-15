---
name: fuzz-harness-writing
description: "Designs fuzz harnesses, corpora, dictionaries, and coverage strategies."
origin: lamella
---

# Writing Fuzzing Harnesses

A fuzzing harness is the entrypoint that translates random bytes into calls against the system under test. This skill is the routing layer for harness design, dictionary use, coverage, and obstacle removal.

## When to Use

- Writing the first harness for a parser, validator, or decoder
- Low coverage or unreproducible fuzz crashes
- Structured inputs that need parsing before execution
- Python fuzzing with Atheris
- Campaigns blocked on checksums, signatures, or format gates

## Core Workflow

1. Pick the narrowest high-value entrypoint.
2. Start with a minimal deterministic harness.
3. Add size checks and basic input shaping.
4. Measure coverage.
5. Add dictionaries or structure-aware input only when needed.
6. Patch or gate expensive validation only in fuzzing builds.

## Minimal Patterns

```cpp
extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {
    target_function(data, size);
    return 0;
}
```

```rust
#![no_main]
use libfuzzer_sys::fuzz_target;

fuzz_target!(|data: &[u8]| {
    target_function(data);
});
```

```python
import atheris
import sys

def TestOneInput(data: bytes) -> None:
    try:
        target_function(data)
    except ValueError:
        pass

atheris.Setup(sys.argv, TestOneInput)
atheris.Fuzz()
```

## References

- [references/tool-specific.md](references/tool-specific.md)
- [references/aflpp-harness-examples.md](references/aflpp-harness-examples.md)
- [references/aflpp-custom-fuzzer.md](references/aflpp-custom-fuzzer.md)
- [references/libfuzzer-examples.md](references/libfuzzer-examples.md)
- [references/coverage-common-patterns.md](references/coverage-common-patterns.md)
- [references/coverage-advanced-usage.md](references/coverage-advanced-usage.md)
