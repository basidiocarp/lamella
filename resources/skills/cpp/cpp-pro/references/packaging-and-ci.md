# Packaging and CI

Use this reference when the task includes dependency management, package installation, or pipeline wiring.

## Conan Example

```ini
[requires]
fmt/10.1.1
spdlog/1.12.0
catch2/3.4.0

[generators]
CMakeDeps
CMakeToolchain
```

```bash
conan install . --output-folder=build --build=missing
cmake -S . -B build -DCMAKE_TOOLCHAIN_FILE=build/conan_toolchain.cmake
cmake --build build
```

## GitHub Actions Skeleton

```yaml
name: CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Configure
        run: cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug
      - name: Build
        run: cmake --build build
      - name: Test
        run: ctest --test-dir build --output-on-failure
      - name: Static analysis
        run: cppcheck --enable=all --error-exitcode=1 src/
```

## Release Hygiene

- Keep CI commands identical to the documented local commands.
- Fail the pipeline on sanitizer, test, or static-analysis errors.
- Prefer explicit dependency pinning over floating package-manager state.
