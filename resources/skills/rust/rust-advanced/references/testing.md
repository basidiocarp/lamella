# Testing in Rust

Use this page to choose the testing layer you need.

## Reference Map

| Need | Load |
|------|------|
| Unit, integration, and doctest structure | [test-layers.md](test-layers.md) |
| Async tests, property tests, and mocks | [async-property-and-mock-tests.md](async-property-and-mock-tests.md) |
| Criterion benchmarks and performance checks | [benchmarking.md](benchmarking.md) |

## Rule

Prefer the simplest test layer that proves the behavior. Reach for integration, property, or benchmark tooling only when the behavior actually crosses those boundaries.
