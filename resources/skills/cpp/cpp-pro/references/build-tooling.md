# Build Systems and Tooling

## Modern CMake

```cmake
cmake_minimum_required(VERSION 3.20)
project(MyProject VERSION 1.0.0 LANGUAGES CXX)

# Set C++ standard
set(CMAKE_CXX_STANDARD 20)
// ... (58 lines trimmed)
install(DIRECTORY include/
    DESTINATION ${CMAKE_INSTALL_INCLUDEDIR}
)
```

## Sanitizers

```cmake
# AddressSanitizer (ASan) - memory errors
set(CMAKE_CXX_FLAGS_ASAN
    "-g -O1 -fsanitize=address -fno-omit-frame-pointer"
    CACHE STRING "Flags for ASan build"
)
// ... (17 lines trimmed)
)

# Usage: cmake -DCMAKE_BUILD_TYPE=ASAN ..
```

## Static Analysis

```yaml
# .clang-tidy configuration
---
Checks: >
  *,
  -fuchsia-*,
// ... (19 lines trimmed)
    value: '_'
  - key: modernize-use-nullptr.NullMacros
    value: 'NULL'
```

```bash
# Run clang-tidy
clang-tidy src/*.cpp -p build/

# Run cppcheck
cppcheck --enable=all --std=c++20 --suppress=missingInclude src/

# Run include-what-you-use
include-what-you-use -std=c++20 src/main.cpp
```

## Testing with Catch2

```cpp
#include <catch2/catch_test_macros.hpp>
#include <catch2/benchmark/catch_benchmark.hpp>
#include "mylib.h"

TEST_CASE("Vector operations", "[vector]") {
// ... (33 lines trimmed)
    }
    return vec;
};
```

## Testing with GoogleTest

```cpp
#include <gtest/gtest.h>
#include <gmock/gmock.h>
#include "calculator.h"

class CalculatorTest : public ::testing::Test {
// ... (56 lines trimmed)
    Service service(mock_db);
    service.process();
}
```

## Performance Profiling

```cpp
// Benchmark with Google Benchmark
#include <benchmark/benchmark.h>

static void BM_VectorPush(benchmark::State& state) {
    for (auto _ : state) {
// ... (19 lines trimmed)
BENCHMARK(BM_VectorReserve)->Range(8, 8<<10);

BENCHMARK_MAIN();
```

```bash
# Profiling with perf (Linux)
perf record -g ./myapp
perf report

# Profiling with Instruments (macOS)
instruments -t "Time Profiler" ./myapp

# Valgrind callgrind
valgrind --tool=callgrind ./myapp
kcachegrind callgrind.out.*

# Memory profiling
valgrind --tool=massif ./myapp
ms_print massif.out.*
```

## Conan Package Manager

```python
# conanfile.txt
[requires]
fmt/10.1.1
spdlog/1.12.0
catch2/3.4.0

[generators]
CMakeDeps
CMakeToolchain

[options]
fmt:header_only=True
```

```cmake
# CMakeLists.txt with Conan
cmake_minimum_required(VERSION 3.20)
project(MyProject)

find_package(fmt REQUIRED)
// ... (12 lines trimmed)
    PRIVATE
        Catch2::Catch2WithMain
)
```

```bash
# Install dependencies
conan install . --output-folder=build --build=missing
cd build
cmake .. -DCMAKE_TOOLCHAIN_FILE=conan_toolchain.cmake
cmake --build .
```

## CI/CD with GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

// ... (54 lines trimmed)

    - name: Run cppcheck
      run: cppcheck --enable=all --error-exitcode=1 src/
```

## Quick Reference

| Tool | Purpose | Command |
|------|---------|---------|
| CMake | Build system | `cmake -B build && cmake --build build` |
| Conan | Package manager | `conan install . --build=missing` |
| ASan | Memory errors | `-fsanitize=address` |
| UBSan | Undefined behavior | `-fsanitize=undefined` |
| TSan | Data races | `-fsanitize=thread` |
| clang-tidy | Static analysis | `clang-tidy src/*.cpp` |
| cppcheck | Static analysis | `cppcheck --enable=all src/` |
| Catch2 | Unit testing | `TEST_CASE("name") { REQUIRE(...); }` |
| GoogleTest | Unit testing | `TEST(Suite, Name) { EXPECT_EQ(...); }` |
| Google Benchmark | Performance | `BENCHMARK(func)->Range(...)` |
| Valgrind | Memory profiler | `valgrind --tool=memcheck ./app` |
