# Advanced Harness Techniques

Tips, tricks, and troubleshooting for fuzzing harnesses.

## Tips and Tricks

| Tip | Why It Helps |
|-----|--------------|
| **Start with parsers** | High bug density, clear entry points, easy to harness |
| **Mock I/O operations** | Prevents hangs from blocking I/O, enables determinism |
| **Use FuzzedDataProvider** | Simplifies extraction of structured data from raw bytes |
| **Reset global state** | Ensures each iteration is independent and reproducible |
| **Free resources in harness** | Prevents memory exhaustion during long campaigns |
| **Avoid logging in harness** | Logging is slow—fuzzing needs 100s-1000s exec/sec |
| **Test harness manually first** | Run harness with known inputs before starting campaign |
| **Check coverage early** | Ensure harness reaches expected code paths |

## Practical Harness Rules

| Rule | Rationale |
|------|-----------|
| **Handle all input sizes** | Fuzzer generates empty, tiny, huge inputs—harness must handle gracefully |
| **Never call `exit()`** | Calling `exit()` stops the fuzzer process. Use `abort()` in SUT if needed |
| **Join all threads** | Each iteration must run to completion before next iteration starts |
| **Be fast** | Aim for 100s-1000s executions/sec. Avoid logging, high complexity, excess memory |
| **Maintain determinism** | Same input must always produce same behavior for reproducibility |
| **Avoid global state** | Global state reduces reproducibility—reset between iterations if unavoidable |
| **Use narrow targets** | Don't fuzz PNG and TCP in same harness—different formats need separate targets |
| **Free resources** | Prevent memory leaks that cause resource exhaustion during long campaigns |

## Anti-Patterns

| Anti-Pattern | Problem | Correct Approach |
|--------------|---------|------------------|
| **Global state without reset** | Non-deterministic crashes | Reset all globals at start of harness |
| **Blocking I/O or network calls** | Hangs fuzzer, wastes time | Mock I/O, use in-memory buffers |
| **Memory leaks in harness** | Resource exhaustion kills campaign | Free all allocations before returning |
| **Calling `exit()` in SUT** | Stops entire fuzzing process | Use `abort()` or return error codes |
| **Heavy logging in harness** | Reduces exec/sec by orders of magnitude | Disable logging during fuzzing |
| **Too many operations per iteration** | Slows down fuzzer | Keep iterations fast and focused |
| **Mixing unrelated input formats** | Corpus entries not useful across formats | Separate harnesses for different formats |
| **Not validating input size** | Harness crashes on edge cases | Check `size` before accessing `data` |

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| **Low executions/sec** | Harness is too slow (logging, I/O, complexity) | Profile harness, remove bottlenecks, mock I/O |
| **No crashes found** | Coverage not reaching buggy code | Check coverage, improve harness to reach more paths |
| **Non-reproducible crashes** | Non-determinism or global state | Remove randomness, reset globals between iterations |
| **Fuzzer exits immediately** | Harness calls `exit()` | Replace `exit()` with `abort()` or return error |
| **Out of memory errors** | Memory leaks in harness or SUT | Free allocations, use leak sanitizer to find leaks |
| **Crashes on empty input** | Harness doesn't validate size | Add `if (size < MIN_SIZE) return 0;` |
| **Corpus not growing** | Inputs too constrained or format too strict | Use FuzzedDataProvider or structure-aware fuzzing |

## Related Skills

### Tools That Use This Technique

| Skill | How It Applies |
|-------|----------------|
| **libfuzzer** | Uses `LLVMFuzzerTestOneInput` harness signature with FuzzedDataProvider |
| **aflpp** | Supports persistent mode harnesses with `__AFL_LOOP` for performance |
| **cargo-fuzz** | Uses Rust-specific `fuzz_target!` macro with arbitrary crate integration |
| **atheris** | Python harness takes bytes, calls Python functions |
| **ossfuzz** | Requires harnesses in specific directory structure for cloud fuzzing |

### Related Techniques

| Skill | Relationship |
|-------|--------------|
| **fuzz-coverage-analysis** | Measure harness effectiveness—are you reaching target code? |
| **address-sanitizer** | Detects bugs found by harness (buffer overflows, use-after-free) |
| **fuzzing-dictionary** | Provide tokens to help fuzzer pass format checks in harness |
| **fuzzing-obstacles** | Patch SUT when it violates harness rules (exit, non-determinism) |
