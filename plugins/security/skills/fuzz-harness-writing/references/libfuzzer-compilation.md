# Compilation

## Basic Compilation

The key flag is `-fsanitize=fuzzer`, which:
- Links the libFuzzer runtime (provides `main` function)
- Enables SanitizerCoverage instrumentation for coverage tracking
- Disables built-in functions like `memcmp`

```bash
clang++ -fsanitize=fuzzer -g -O2 harness.cc target.cc -o fuzz
```

**Flags explained:**
- `-fsanitize=fuzzer`: Enable libFuzzer
- `-g`: Add debug symbols (helpful for crash analysis)
- `-O2`: Production-level optimizations (recommended for fuzzing)
- `-DNO_MAIN`: Define macro if your code has a `main` function

## With Sanitizers

**AddressSanitizer (recommended):**
```bash
clang++ -fsanitize=fuzzer,address -g -O2 -U_FORTIFY_SOURCE harness.cc target.cc -o fuzz
```

**Multiple sanitizers:**
```bash
clang++ -fsanitize=fuzzer,address,undefined -g -O2 harness.cc target.cc -o fuzz
```

> **See Also:** For detailed sanitizer configuration, common issues, ASAN_OPTIONS flags,
> and advanced sanitizer usage, see the **address-sanitizer** and **undefined-behavior-sanitizer**
> technique skills.

## Build Flags

| Flag | Purpose |
|------|---------|
| `-fsanitize=fuzzer` | Enable libFuzzer runtime and instrumentation |
| `-fsanitize=address` | Enable AddressSanitizer (memory error detection) |
| `-fsanitize=undefined` | Enable UndefinedBehaviorSanitizer |
| `-fsanitize=fuzzer-no-link` | Instrument without linking fuzzer (for libraries) |
| `-g` | Include debug symbols |
| `-O2` | Production optimization level |
| `-U_FORTIFY_SOURCE` | Disable fortification (can interfere with ASan) |

## Building Static Libraries

For projects that produce static libraries:

1. Build the library with fuzzing instrumentation:
```bash
export CC=clang CFLAGS="-fsanitize=fuzzer-no-link -fsanitize=address"
export CXX=clang++ CXXFLAGS="$CFLAGS"
./configure --enable-shared=no
make
```

2. Link the static library with your harness:
```bash
clang++ -fsanitize=fuzzer -fsanitize=address harness.cc libmylib.a -o fuzz
```

## CMake Integration

```cmake
project(FuzzTarget)
cmake_minimum_required(VERSION 3.0)

add_executable(fuzz main.cc harness.cc)
target_compile_definitions(fuzz PRIVATE NO_MAIN=1)
target_compile_options(fuzz PRIVATE -g -O2 -fsanitize=fuzzer -fsanitize=address)
target_link_libraries(fuzz -fsanitize=fuzzer -fsanitize=address)
```

Build with:
```bash
cmake -DCMAKE_C_COMPILER=clang -DCMAKE_CXX_COMPILER=clang++ .
cmake --build .
```
