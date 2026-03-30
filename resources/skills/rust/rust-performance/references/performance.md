# Rust Performance Reference

Relevant source rule groups:

- `resources/rules/rust/mem-*.md`
- `resources/rules/rust/opt-*.md`
- `resources/rules/rust/perf-*.md`
- `resources/rules/rust/anti-format-hot-path.md`

Use this reference for:

- allocation reuse, capacity planning, boxed slices, small buffers, zero-copy
- LTO, PGO, codegen units, target CPU, SIMD, inlining, cold paths
- iterator materialization, entry API, drain/extend, benchmark hygiene

The core rules keep only one always-on performance principle. Everything else is
here so it loads only when the task is truly performance-sensitive.
