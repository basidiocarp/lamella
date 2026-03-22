# Advanced Usage

## Tips and Tricks

| Tip | Why It Helps |
|-----|--------------|
| Start with single-core, switch to AFL++ for multi-core | libFuzzer harnesses work with AFL++ |
| Use dictionaries for structured formats | 10-100x faster bug discovery |
| Close file descriptors with `-close_fd_mask=3` | Speed boost if SUT writes output |
| Set reasonable `-max_len` | Prevents wasted time on huge inputs |
| Run for days/weeks, not minutes | Coverage plateaus take time to break |
| Use seed corpus from test suites | Starts fuzzing from valid inputs |

## Structure-Aware Fuzzing

For highly structured inputs (e.g., complex protocols, file formats), use libprotobuf-mutator:

- Define input structure using Protocol Buffers
- libFuzzer mutates protobuf messages (structure-preserving mutations)
- Harness converts protobuf to native format

See [structure-aware fuzzing documentation](https://github.com/google/fuzzing/blob/master/docs/structure-aware-fuzzing.md) for details.

## Custom Mutators

libFuzzer allows custom mutators for specialized fuzzing:

```c++
extern "C" size_t LLVMFuzzerCustomMutator(uint8_t *Data, size_t Size,
                                          size_t MaxSize, unsigned int Seed) {
    // Custom mutation logic
    return new_size;
}

extern "C" size_t LLVMFuzzerCustomCrossOver(const uint8_t *Data1, size_t Size1,
                                            const uint8_t *Data2, size_t Size2,
                                            uint8_t *Out, size_t MaxOutSize,
                                            unsigned int Seed) {
    // Custom crossover logic
    return new_size;
}
```

## Performance Tuning

| Setting | Impact |
|---------|--------|
| `-close_fd_mask=3` | Closes stdout/stderr, speeds up fuzzing |
| `-max_len=<reasonable_size>` | Avoids wasting time on huge inputs |
| `-timeout=<seconds>` | Detects hangs, prevents stuck executions |
| Disable ASan for baseline | 2-4x speed boost (but misses memory bugs) |
| Use `-jobs` and `-workers` | Limited multi-core support |
| Run on Linux | Best platform support and performance |

---

# Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| No crashes found after hours | Poor corpus, low coverage | Add seed inputs, use dictionary, check harness |
| Very slow executions/sec (<100) | Target too complex, excessive logging | Optimize target, use `-close_fd_mask=3`, reduce logging |
| Out of memory | ASan's 20TB virtual memory | Set `-rss_limit_mb=0` to disable RSS limit |
| Fuzzer stops after first crash | Default behavior | Use `-fork=1 -ignore_crashes=1` to continue |
| Can't reproduce crash | Non-determinism in harness/target | Remove random number generation, global state |
| Linking errors with `-fsanitize=fuzzer` | Missing libFuzzer runtime | Ensure using Clang, check LLVM installation |
| GCC project won't compile with Clang | GCC-specific code | Switch to AFL++ with `gcc_plugin` instead |
| Coverage not improving | Corpus plateau | Run longer, add dictionary, improve seeds, check coverage report |
| Crashes but ASan doesn't trigger | Memory error not detected without ASan | Recompile with `-fsanitize=address` |

---

# Related Skills

## Technique Skills

| Skill | Use Case |
|-------|----------|
| **fuzz-harness-writing** | Detailed guidance on writing effective harnesses, structure-aware fuzzing, and FuzzedDataProvider usage |
| **address-sanitizer** | Memory error detection configuration, ASAN_OPTIONS, and troubleshooting |
| **undefined-behavior-sanitizer** | Detecting undefined behavior during fuzzing |
| **fuzz-coverage-analysis** | Measuring fuzzing effectiveness and identifying untested code paths |
| **fuzzing-corpus** | Building and managing seed corpora, corpus minimization strategies |
| **fuzzing-dictionaries** | Creating format-specific dictionaries for faster bug discovery |

## Related Fuzzers

| Skill | When to Consider |
|-------|------------------|
| **aflpp** | When you need serious multi-core fuzzing, or when libFuzzer coverage plateaus |
| **honggfuzz** | When you want hardware-based coverage feedback on Linux |
| **libafl** | When building custom fuzzers or conducting fuzzing research |

---

# Resources

## Official Documentation

- [LLVM libFuzzer Documentation](https://llvm.org/docs/LibFuzzer.html) - Official reference
- [libFuzzer Tutorial by Google](https://github.com/google/fuzzing/blob/master/tutorial/libFuzzerTutorial.md) - Step-by-step guide
- [SanitizerCoverage](https://clang.llvm.org/docs/SanitizerCoverage.html) - Coverage instrumentation details

## Advanced Topics

- [Structure-Aware Fuzzing with libprotobuf-mutator](https://github.com/google/fuzzing/blob/master/docs/structure-aware-fuzzing.md)
- [Split Inputs in libFuzzer](https://github.com/google/fuzzing/blob/master/docs/split-inputs.md)
- [FuzzedDataProvider Header](https://github.com/llvm/llvm-project/blob/main/compiler-rt/include/fuzzer/FuzzedDataProvider.h)

## Example Projects

- [OSS-Fuzz](https://github.com/google/oss-fuzz) - Continuous fuzzing for open-source projects (many libFuzzer examples)
- [AFL++ Dictionary Collection](https://github.com/AFLplusplus/AFLplusplus/tree/stable/dictionaries) - Reusable dictionaries
