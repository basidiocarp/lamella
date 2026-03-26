---
name: fuzz-harness-writing
description: >-
  Guides effective fuzzing harness design across languages, including Python (Atheris), dictionary and corpus building,
  and common fuzzing obstacles. Covers libFuzzer, AFL++, coverage analysis, and fuzz campaign management. Use when creating
  fuzz targets, improving harness code, building fuzzing dictionaries, measuring coverage, or choosing between libFuzzer,
  AFL++, and LibAFL.
---

# Writing Fuzzing Harnesses


## Contents

- [Overview](#overview)
- [When to Apply](#when-to-apply)
- [Quick Reference](#quick-reference)
- [Step-by-Step](#step-by-step)
- [Python Fuzzing with Atheris](#python-fuzzing-with-atheris)
- [Fuzzing Dictionaries](#fuzzing-dictionaries)
- [Overcoming Fuzzing Obstacles](#overcoming-fuzzing-obstacles)
- [Troubleshooting](#troubleshooting)
- [References](#references)


A fuzzing harness is the entrypoint function that receives random data from the fuzzer and routes it to your system under test (SUT). The quality of your harness directly determines which code paths get exercised and whether critical bugs are found.

## Overview

The harness is the bridge between the fuzzer's random byte generation and your application's API. It must parse raw bytes into meaningful inputs, call target functions, and handle edge cases gracefully.

| Concept | Description |
|---------|-------------|
| **Harness** | Function that receives fuzzer input and calls target code |
| **SUT** | System Under Test—the code being fuzzed |
| **Entry point** | Function signature required by fuzzer (e.g., `LLVMFuzzerTestOneInput`) |
| **FuzzedDataProvider** | Helper for extracting typed data from raw bytes |
| **Determinism** | Same input always produces same behavior |
| **Dictionary** | File of domain-specific tokens to guide fuzzer mutations |
| **SUT Patching** | Modifying System Under Test to be fuzzing-friendly via conditional compilation |

## When to Apply

**Apply this technique when:**
- Creating a new fuzz target for the first time
- Fuzz campaign has low code coverage or isn't finding bugs
- Crashes found during fuzzing are not reproducible
- Target API requires complex or structured inputs
- Fuzzing Python code with Atheris
- Coverage plateaus early — dictionary tokens or obstacle bypasses needed
- The fuzzer gets stuck at checksum or hash verification
- Code uses time-based seeds or other non-deterministic global state

**Skip this technique when:**
- Using existing well-tested harnesses
- Tool provides automatic harness generation that meets needs

## Quick Reference

| Task | Pattern |
|------|---------|
| Minimal C++ harness | `extern "C" int LLVMFuzzerTestOneInput(const uint8_t* data, size_t size)` |
| Minimal Rust harness | `fuzz_target!(|data: &[u8]| { ... })` |
| Minimal Python harness | `atheris.Setup(sys.argv, TestOneInput); atheris.Fuzz()` |
| Size validation | `if (size < MIN_SIZE) return 0;` |
| Cast to integers | `uint32_t val = *(uint32_t*)(data);` |
| Use FuzzedDataProvider | `FuzzedDataProvider fuzzed_data(data, size);` |
| Use dictionary (libFuzzer) | `./fuzz -dict=./dictionary.dict ...` |
| Use dictionary (AFL++) | `afl-fuzz -x ./dictionary.dict ...` |
| Check if fuzzing build (C++) | `#ifdef FUZZING_BUILD_MODE_UNSAFE_FOR_PRODUCTION` |
| Check if fuzzing build (Rust) | `cfg!(fuzzing)` |

## Step-by-Step

### Step 1: Identify Entry Points
Find functions that:
- Accept external input (parsers, validators)
- Parse complex data formats (JSON, XML, binary)
- Perform security-critical operations
- Have high cyclomatic complexity

### Step 2: Write Minimal Harness

**C/C++:**
```cpp
extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {
    target_function(data, size);
    return 0;
}
```

**Rust:**
```rust
#![no_main]
use libfuzzer_sys::fuzz_target;

fuzz_target!(|data: &[u8]| {
    target_function(data);
});
```

**Python (Atheris):**
```python
import atheris
import sys

def TestOneInput(data: bytes) -> None:
    try:
// ... (9 lines trimmed)

if __name__ == "__main__":
    main()
```

### Step 3: Add Input Validation

```cpp
extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {
    if (size < MIN_INPUT_SIZE || size > MAX_INPUT_SIZE) {
        return 0;
    }
    target_function(data, size);
    return 0;
}
```

### Step 4: Structure the Input

For APIs requiring typed data, use `FuzzedDataProvider`:

```cpp
#include "FuzzedDataProvider.h"

extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {
    FuzzedDataProvider fuzzed_data(data, size);
    auto val = fuzzed_data.ConsumeIntegral<uint32_t>();
    auto str = fuzzed_data.ConsumeRandomLengthString(256);
    target_function(val, str);
    return 0;
}
```

### Step 5: Test and Iterate
- Monitor code coverage
- Check executions per second
- Verify crash reproducibility

## Python Fuzzing with Atheris

Atheris is Google's coverage-guided Python fuzzer based on libFuzzer. It finds crashes, hangs, and assertion failures by generating mutated inputs and tracking code coverage.

**When to use:** Testing parsers, deserializers, data processors, or any Python code handling untrusted input.

### Setup

```bash
pip install atheris

# Run a fuzzer
python my_fuzzer.py -atheris_runs=100000

# With corpus directory
python my_fuzzer.py corpus/ -atheris_runs=100000
```

### Running Python Fuzzers

```bash
# Basic run
python fuzzer.py -atheris_runs=100000

# With parallel workers
// ... (5 lines trimmed)
# Print statistics
python fuzzer.py -print_final_stats=1 corpus/
```

### Crash Analysis

Crashes saved to `crash-<hash>` files. Reproduce:

```bash
# Reproduce crash
python fuzzer.py crash-abc123

# Minimize crash input
python fuzzer.py -minimize_crash=1 -runs=10000 crash-abc123
```

### Atheris FuzzedDataProvider API

| Method | Returns |
|--------|---------|
| `ConsumeBytes(n)` | Up to n bytes |
| `ConsumeUnicodeNoSurrogates(n)` | Up to n chars (safe string) |
| `ConsumeInt(n)` | n-byte int |
| `ConsumeIntInRange(min, max)` | Int in range |
| `ConsumeBool()` | True/False |
| `ConsumeFloat()` | Float |
| `ConsumeFloatInRange(min, max)` | Float in range |
| `PickValueInList(list)` | Random element |

### Atheris References

- [references/docker-setup.md](references/docker-setup.md) - Docker-based fuzzing environment setup
- [references/atheris-examples.md](references/atheris-examples.md) - Complete Atheris fuzzing examples for parsers, JSON, regex, PIL

## Fuzzing Dictionaries

A fuzzing dictionary provides domain-specific tokens to guide the fuzzer toward interesting inputs. Instead of purely random mutations, the fuzzer incorporates known keywords, magic numbers, protocol commands, and format-specific strings that are more likely to reach deeper code paths.

### When to Use Dictionaries

**Apply when:**
- Fuzzing parsers (JSON, XML, config files)
- Fuzzing protocol implementations (HTTP, DNS, custom protocols)
- Fuzzing file format handlers (PNG, PDF, media codecs)
- Coverage plateaus early without reaching deeper logic

**Skip when:**
- Fuzzing pure algorithms without format expectations
- Corpus already achieves high coverage

### Dictionary File Format

```conf
# Lines starting with '#' and empty lines are ignored.
# Quoted strings or key-value pairs:
kw1="blah"
kw2="\"ac\\dc\""
kw3="\xF7\xF8"
"foo\x0Abar"
```

### Generating Dictionary Content

**From LLM:**
```text
Write me a dictionary file for fuzzing a <PNG parser>. Each line should be a quoted
string or key-value pair like kw="value". Include magic bytes, chunk types, and common
header values. Use hex escapes like "\xF7\xF8" for binary values.
```

**From header files:**
```bash
grep -o '".*"' header.h > header.dict
```

**From binary strings:**
```bash
strings ./binary | sed 's/^/"&/; s/$/&"/' > strings.dict
```

**Auto-generated (AFL++):**
```bash
export AFL_LLVM_DICT2FILE=auto.dict
afl-clang-lto++ target.cc -o target
afl-fuzz -x auto.dict -i in -o out -- ./target
```

### Dictionary Patterns

**Protocol keywords:**
```conf
"GET"
"POST"
"Content-Type"
"HTTP/1.1"
```

**Magic bytes / file format headers:**
```conf
png_magic="\x89PNG\r\n\x1a\n"
ihdr="IHDR"
jpeg_soi="\xFF\xD8"
```

**Configuration file keywords:**
```conf
"true"
"false"
"null"
"[general]"
```

### Using Dictionaries with Fuzzers

| Fuzzer | Command |
|--------|---------|
| libFuzzer | `./fuzz -dict=./dictionary.dict corpus/` |
| AFL++ | `afl-fuzz -x ./dictionary.dict -i input/ -o output/ -- ./target @@` |
| cargo-fuzz | `cargo fuzz run fuzz_target -- -dict=./dictionary.dict` |
| go-fuzz | Seed corpus manually (no built-in dict support) |

### Dictionary Tips

| Tip | Why It Helps |
|-----|--------------|
| Combine multiple generation methods | LLM + binary strings covers broad surface |
| Include boundary values | `"0"`, `"-1"`, `"2147483647"` trigger edge cases |
| Add format delimiters | `:`, `=`, `{`, `}` help fuzzer construct valid structures |
| Keep dictionaries focused | 50-200 entries perform better than thousands |
| Test dictionary effectiveness | Run with and without dict, compare coverage |

### Dictionary Anti-Patterns

| Anti-Pattern | Problem | Correct Approach |
|--------------|---------|------------------|
| Including full sentences | Fuzzer needs atomic tokens | Break into individual keywords |
| Duplicating entries | Wastes mutation budget | Use `sort -u` to deduplicate |
| Over-sized dictionaries | Slows fuzzer, dilutes useful tokens | Keep 50-200 most relevant entries |
| Missing hex escapes | Non-printable bytes become mangled | Use `\xXX` for binary values |

## Overcoming Fuzzing Obstacles

Codebases often contain anti-fuzzing patterns that prevent effective coverage. Checksums, global state (like time-seeded PRNGs), and validation checks can block the fuzzer from exploring deeper code paths. This section shows how to patch your SUT to bypass these obstacles during fuzzing while preserving production behavior.

### Identifying Obstacles

Run the fuzzer and analyze coverage to find unreachable code:

1. Checksum/hash verification before deeper processing
2. Calls to `rand()`, `time()`, or `srand()` with system seeds
3. Validation functions that reject most inputs
4. Global state initialization that differs across runs

### Conditional Compilation

**C/C++ — bypass checksum:**
```c++
if (checksum != expected_hash) {
#ifndef FUZZING_BUILD_MODE_UNSAFE_FOR_PRODUCTION
    return -1;  // Only enforced in production
#endif
}
```

**Rust — bypass checksum:**
```rust
if checksum != expected_hash {
    if !cfg!(fuzzing) {
        return Err(MyError::Hash);
    }
}
```

**Deterministic PRNG seeding:**
```c++
void initialize() {
#ifdef FUZZING_BUILD_MODE_UNSAFE_FOR_PRODUCTION
    srand(12345);  // Fixed seed for fuzzing
#else
    srand(time(NULL));
#endif
}
```

### Safe Validation Skip (with Defaults)

Dangerous — skipping validation without defaults:
```c++
// BAD: config.x could be 0, causing division by zero
#ifndef FUZZING_BUILD_MODE_UNSAFE_FOR_PRODUCTION
if (!validate_config(&config)) return -1;
#endif
int32_t result = 100 / config.x;  // CRASH
```

Safe — provide defaults:
```c++
#ifdef FUZZING_BUILD_MODE_UNSAFE_FOR_PRODUCTION
if (!validate_config(&config)) {
    config.x = 1;  // Prevent division by zero
    config.y = 1;
}
#else
if (!validate_config(&config)) return -1;
#endif
int32_t result = 100 / config.x;  // Safe in both builds
```

### Bypass Complex Format Validation (Rust)

```rust
pub fn parse_message(data: &[u8]) -> Result<Message, Error> {
    validate_magic_bytes(data)?;  // Keep cheap checks

    if !cfg!(fuzzing) {
// ... (5 lines trimmed)
    deserialize_message(data)
}
```

### Obstacle Patching Tips

| Tip | Why It Helps |
|-----|--------------|
| Keep cheap validation | Magic bytes and size checks guide fuzzer without much cost |
| Use fixed seeds for PRNGs | Makes behavior deterministic while exploring all code paths |
| Patch incrementally | Skip one obstacle at a time and measure coverage impact |
| Add defensive defaults | When skipping validation, provide safe fallback values |
| Document all patches | Future maintainers need to understand fuzzing vs. production differences |

### Assessing False Positive Risk

After patching, consider:
- Does code after the check assume validated properties?
- Could skipping validation cause crashes impossible in production?
- Is there implicit state dependency?

| False Positive Risk | Pattern |
|---------------------|---------|
| LOW | Bypassing checksums when processing doesn't depend on checksum correctness |
| LOW | Fixed PRNG seeds |
| MEDIUM | Skipping format validation before deserialization |
| MITIGATED | Providing safe defaults instead of skipping entirely |

### Measuring Patch Effectiveness

1. **Line coverage:** Use `llvm-cov` or `cargo-cov` to see new reachable lines
2. **Basic block coverage:** More fine-grained than line coverage
3. **Function coverage:** How many more functions are now reachable?
4. **Corpus size:** Does the fuzzer generate more diverse inputs?

Effective patches typically increase coverage by 10-50% or more.

### Real-World Examples

- **OpenSSL:** Uses `FUZZING_BUILD_MODE_UNSAFE_FOR_PRODUCTION` to modify cryptographic algorithm behavior for deeper fuzzing of certificate validation logic.
- **ogg crate (Rust):** Uses `cfg!(fuzzing)` to skip checksum verification, letting the fuzzer explore audio processing code.

### Obstacle Anti-Patterns

| Anti-Pattern | Problem | Correct Approach |
|--------------|---------|------------------|
| Skip all validation wholesale | Creates false positives | Skip only specific obstacles |
| No risk assessment | False positives waste time | Analyze downstream code assumptions |
| Forget to document patches | Future confusion | Add comments explaining safety |
| Patch without measuring | Unknown effectiveness | Compare coverage before and after |
| Over-patching | Build diverges from production | Minimize differences |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Low executions/sec | Remove logging, mock I/O |
| No crashes found | Check coverage, improve harness |
| Non-reproducible crashes | Remove randomness, reset globals |
| Fuzzer exits immediately | Replace `exit()` with `abort()` |
| Out of memory | Free allocations before returning |
| Dictionary not loaded | Check fuzzer output for parsing errors; verify format |
| No coverage improvement with dict | Dictionary tokens not relevant to target code |
| Coverage doesn't improve after patching | Wrong obstacle identified; profile execution |
| Many false positive crashes | Downstream code has assumptions; add defensive defaults |


## Reference Files

| File | Description |
|------|-------------|
| [common-patterns.md](references/common-patterns.md) | Common harness patterns |
| [tool-specific-guidance.md](references/tool-specific-guidance.md) | Tool-specific harness guidance |
| [advanced-usage.md](references/advanced-usage.md) | Advanced fuzzing techniques |
| [anti-patterns.md](references/anti-patterns.md) | Fuzzing anti-patterns |
| [tool-specific.md](references/tool-specific.md) | Tool-specific configurations |
| **libFuzzer** | [installation](references/libfuzzer-installation.md), [compilation](references/libfuzzer-compilation.md), [harness-writing](references/libfuzzer-harness-writing.md), [corpus-management](references/libfuzzer-corpus-management.md), [running-campaigns](references/libfuzzer-running-campaigns.md), [dictionaries-coverage](references/libfuzzer-dictionaries-coverage.md), [sanitizers](references/libfuzzer-sanitizers.md), [examples](references/libfuzzer-examples.md), [advanced-troubleshooting](references/libfuzzer-advanced-troubleshooting.md) |
| **AFL++** | [installation-guide](references/aflpp-installation-guide.md), [harness-examples](references/aflpp-harness-examples.md), [compilation-modes](references/aflpp-compilation-modes.md), [multi-core-fuzzing](references/aflpp-multi-core-fuzzing.md), [custom-fuzzer](references/aflpp-custom-fuzzer.md), [custom-fuzzer-guide](references/aflpp-custom-fuzzer-guide.md), [libafl-compilation](references/aflpp-libafl-compilation.md), [libafl-advanced-usage](references/aflpp-libafl-advanced-usage.md), [libafl-examples](references/aflpp-libafl-examples.md), [libafl-real-world-examples](references/aflpp-libafl-real-world-examples.md) |
| **Coverage** | [execute-runtime](references/coverage-execute-runtime.md), [tool-specific-guides](references/coverage-tool-specific-guides.md), [advanced-usage](references/coverage-advanced-usage.md), [common-patterns](references/coverage-common-patterns.md) |
