# perf-profile-first

> Profile before optimizing

Do not optimize blind.

## Prefer

- profiling representative workloads before changing algorithms, layout, or profile settings
- validating that an optimization moves the real bottleneck
- reverting complexity that did not pay off
- keeping the simple version until measurement proves otherwise

## Avoid

- performance work driven only by intuition
- micro-optimizing cold code
- keeping complexity after the measured win disappears

## See Also

- [test-criterion-bench](./test-criterion-bench.md) - Benchmark carefully
- [opt-cache-friendly](./opt-cache-friendly.md) - Optimize locality only with evidence
