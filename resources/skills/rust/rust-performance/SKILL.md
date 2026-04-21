---
name: rust-performance
description: Optimize Rust performance and memory usage with measurement-first guidance. Use when benchmarking, profiling, reducing allocation pressure, tuning release profiles, or evaluating layout and container tradeoffs in hot paths.
origin: lamella
---

# Rust Performance

Use this skill when the question is about measured performance, memory, or
build-profile tuning.

## Focus Areas

- profiling and benchmarking
- allocation pressure and buffer reuse
- release profile and compiler tuning
- layout, locality, and container choice

## Workflow

1. Confirm the hotspot with profiling or benchmarks.
2. Fix algorithm and data-flow issues before compiler attributes.
3. Tune allocation, layout, and profile settings only where they move the bottleneck.
4. Keep complexity only when the measured gain justifies it.

## References

- load [references/performance.md](./references/performance.md) for memory, perf, and tuning guidance
