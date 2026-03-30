# opt-simd-portable

> Use portable SIMD for vectorized operations across architectures

Use portable SIMD when vectorized math or byte processing is a proven hotspot.

## Prefer

- SIMD for data-parallel loops with large uniform workloads
- portable abstractions when cross-architecture support matters
- scalar fallbacks or feature gating when the environment varies

## Avoid

- SIMD rewrites before profiling
- vectorization that obscures correctness for marginal wins
- architecture-specific assumptions hidden inside a “portable” path

## See Also

- [opt-target-cpu](./opt-target-cpu.md) - Tune for known deployment targets intentionally
- [perf-profile-first](./perf-profile-first.md) - Measure before optimizing
