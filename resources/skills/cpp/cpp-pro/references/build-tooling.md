# Build Systems and Tooling

Use this page to choose the right tooling slice. The detailed examples are split so you can load the part that matches the task instead of a single oversized handbook.

## Reference Map

| Need | Load |
|------|------|
| Modern CMake layout, install rules, and sanitizer build types | [cmake-and-sanitizers.md](cmake-and-sanitizers.md) |
| Static analysis, unit testing, and benchmarking setup | [analysis-and-testing.md](analysis-and-testing.md) |
| Conan integration, CI, and release automation | [packaging-and-ci.md](packaging-and-ci.md) |

## Fast Guidance

- Prefer CMake presets or clearly named build types for sanitizer-enabled local work.
- Keep static analysis and tests runnable from a single build directory.
- Treat CI as a thin wrapper around local commands rather than inventing separate behavior.

## Common Toolchain Stack

| Layer | Typical Choice |
|-------|----------------|
| Build system | `CMake` |
| Package manager | `Conan` when external packages need pinning |
| Static analysis | `clang-tidy`, `cppcheck`, `include-what-you-use` |
| Unit tests | `Catch2` or `GoogleTest` |
| Benchmarks | `Google Benchmark` |
| Runtime safety | `ASan`, `UBSan`, `TSan` |
| CI | GitHub Actions or equivalent runner invoking local scripts |
