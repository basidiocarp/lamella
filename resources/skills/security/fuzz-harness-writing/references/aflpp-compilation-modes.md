# AFL++ Compilation Modes

## Compilation Mode Decision Tree

- **LTO mode** (`afl-clang-lto`): Best performance and instrumentation. Try this first.
- **LLVM mode** (`afl-clang-fast`): Fall back if LTO fails to compile.
- **GCC plugin** (`afl-gcc-fast`): For projects requiring GCC.

---

## Basic Compilation (LLVM mode)

```bash
./afl++ <host/docker> afl-clang-fast++ -DNO_MAIN=1 -O2 -fsanitize=fuzzer harness.cc main.cc -o fuzz
```

---

## GCC Compilation

```bash
./afl++ <host/docker> afl-g++-fast -DNO_MAIN=1 -O2 -fsanitize=fuzzer harness.cc main.cc -o fuzz
```

**Important:** GCC version must match the version used to compile the AFL++ GCC plugin.

---

## With Sanitizers

```bash
./afl++ <host/docker> AFL_USE_ASAN=1 afl-clang-fast++ -DNO_MAIN=1 -O2 -fsanitize=fuzzer harness.cc main.cc -o fuzz
```

---

## Build Flags Reference

| Flag | Purpose |
|------|---------|
| `-DNO_MAIN=1` | Skip main function when using libFuzzer harness |
| `-O2` | Production optimization level (recommended for fuzzing) |
| `-fsanitize=fuzzer` | Enable libFuzzer compatibility mode and adds fuzzer runtime |
| `-fsanitize=fuzzer-no-link` | Instrument without linking fuzzer runtime (for static libs) |

`-g` is not necessary—it's added by default by the AFL++ compilers.

---

## CMPLOG Mode

CMPLOG/RedQueen is the best path constraint solving mechanism available.

To enable it, set the environment variable before building:

```bash
./afl++ <host/docker> AFL_LLVM_CMPLOG=1 make
```

To run a fuzzer instance with a CMPLOG instrumented target:

```bash
./afl++ <host/docker> afl-fuzz -c0 -S cmplog -i seeds -o state -- ./fuzz
```

---

## Sanitizer Integration

### AddressSanitizer (ASan)

```bash
./afl++ <host/docker> AFL_USE_ASAN=1 afl-clang-fast++ -DNO_MAIN=1 -O2 -fsanitize=fuzzer harness.cc main.cc -o fuzz
```

**Note:** Memory limit (`-m`) is not supported with ASan due to 20TB virtual memory reservation.

### UndefinedBehaviorSanitizer (UBSan)

```bash
./afl++ <host/docker> AFL_USE_UBSAN=1 afl-clang-fast++ -DNO_MAIN=1 -O2 -fsanitize=fuzzer,undefined harness.cc main.cc -o fuzz
```

### Common Sanitizer Issues

| Issue | Solution |
|-------|----------|
| ASan slows fuzzing | Use only 1 ASan job in multi-core setup |
| Stack exhaustion | Increase stack with `ASAN_OPTIONS=stack_size=...` |
| GCC version mismatch | Ensure system GCC matches AFL++ plugin version |
