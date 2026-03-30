# perf-black-box-bench

> Use black_box in benchmarks

Use `black_box` when benchmarked code risks being optimized away or simplified
unrealistically.

## Prefer

- `black_box` around benchmark inputs or results when needed to preserve real work
- pairing `black_box` with Criterion or another real benchmark harness
- checking generated behavior only when benchmark results look suspicious

## Avoid

- `black_box` in production code
- assuming `black_box` makes a bad benchmark good
- benchmarking code the optimizer can erase while trusting the numbers

## See Also

- [test-criterion-bench](./test-criterion-bench.md) - Use a proper benchmark harness
- [perf-profile-first](./perf-profile-first.md) - Measure real workloads too
