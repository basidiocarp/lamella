# Practical Harness Rules & Anti-Patterns

## Practical Harness Rules

Follow these rules to ensure effective fuzzing harnesses:

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

**Note:** These guidelines apply not just to harness code, but to the entire SUT. If the SUT violates these rules, consider patching it.

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
