# test-criterion-bench

> Use `criterion` for benchmarking

Use `criterion` for Rust benchmarks instead of ad hoc timing loops.

## Prefer

- `criterion` for stable measurement, statistics, and comparison across changes
- benchmarking release-mode code with representative inputs
- turning benchmark results into decisions only after checking real hotspots

## Avoid

- manual `Instant::now()` loops as your main benchmark method
- benchmarking debug builds
- treating microbenchmarks as proof of end-to-end wins

## See Also

- [perf-profile-first](./perf-profile-first.md) - Measure before optimizing
- [perf-black-box-bench](./perf-black-box-bench.md) - Prevent optimizer artifacts in benchmarks
