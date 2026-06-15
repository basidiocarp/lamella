# Tool-Specific Harness Guidance

Harness patterns for specific fuzzing tools.

## libFuzzer

**Harness signature:**
```cpp
extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {
    // Your code here
    return 0;  // Non-zero return is reserved for future use
}
```

**Compilation:**
```bash
clang++ -fsanitize=fuzzer,address -g harness.cc -o fuzz_target
```

**Integration tips:**
- Use `FuzzedDataProvider.h` for structured input extraction
- Compile with `-fsanitize=fuzzer` to link the fuzzing runtime
- Add sanitizers (`-fsanitize=address,undefined`) to detect more bugs
- Use `-g` for better stack traces when crashes occur
- libFuzzer can start with empty corpus—no seed inputs required

**Running:**
```bash
./fuzz_target corpus_dir/
```

**Resources:**
- [FuzzedDataProvider header](https://github.com/llvm/llvm-project/blob/main/compiler-rt/include/fuzzer/FuzzedDataProvider.h)
- [libFuzzer documentation](https://llvm.org/docs/LibFuzzer.html)

## AFL++

AFL++ supports multiple harness styles. For best performance, use persistent mode:

**Persistent mode harness:**
```cpp
#include <unistd.h>

int main(int argc, char **argv) {
    #ifdef __AFL_HAVE_MANUAL_CONTROL
        __AFL_INIT();
    #endif

    __AFL_FUZZ_INIT();
    unsigned char *buf = __AFL_FUZZ_TESTCASE_BUF;

    while (__AFL_LOOP(1000)) {
        int len = __AFL_FUZZ_TESTCASE_LEN;
        target(buf, len);
    }

    return 0;
}
```

**Compilation:**
```bash
afl-clang-fast++ -g harness.cc -o fuzz_target
```

**Integration tips:**
- Use persistent mode (`__AFL_LOOP`) for 10-100x speedup
- Consider deferred initialization (`__AFL_INIT()`) to skip setup overhead
- AFL++ requires at least one seed input in the corpus directory
- Use `AFL_USE_ASAN=1` or `AFL_USE_UBSAN=1` for sanitizer builds

**Running:**
```bash
afl-fuzz -i seeds/ -o findings/ -- ./fuzz_target
```

## cargo-fuzz (Rust)

**Harness signature:**
```rust
#![no_main]
use libfuzzer_sys::fuzz_target;

fuzz_target!(|data: &[u8]| {
    // Your code here
});
```

**With structured input (arbitrary crate):**
```rust
#![no_main]
use libfuzzer_sys::fuzz_target;

fuzz_target!(|data: YourStruct| {
    data.check();
});
```

**Creating harness:**
```bash
cargo fuzz init
cargo fuzz add my_target
```

**Integration tips:**
- Use `arbitrary` crate for automatic struct deserialization
- cargo-fuzz wraps libFuzzer, so all libFuzzer features work
- Compile with sanitizers automatically via cargo-fuzz
- Harnesses go in `fuzz/fuzz_targets/` directory

**Running:**
```bash
cargo +nightly fuzz run my_target
```

**Resources:**
- [cargo-fuzz documentation](https://rust-fuzz.github.io/book/cargo-fuzz.html)
- [arbitrary crate](https://github.com/rust-fuzz/arbitrary)

## go-fuzz

**Harness signature:**
```go
// +build gofuzz

package mypackage

func Fuzz(data []byte) int {
    // Call target function
    target(data)

    // Return codes:
    // -1 if input is invalid
    //  0 if input is valid but not interesting
    //  1 if input is interesting (e.g., added new coverage)
    return 0
}
```

**Building:**
```bash
go-fuzz-build
```

**Integration tips:**
- Return 1 for inputs that add coverage (optional—fuzzer can detect automatically)
- Return -1 for invalid inputs to deprioritize similar mutations
- go-fuzz handles persistence automatically

**Running:**
```bash
go-fuzz -bin=./mypackage-fuzz.zip -workdir=fuzz
```
