# Analysis and Testing

Use this reference for local quality gates: static analysis, unit tests, and benchmarks.

## Static Analysis

```yaml
Checks: >
  *,
  -fuchsia-*,
  -llvm-header-guard,
  -readability-identifier-length
WarningsAsErrors: "*"
```

```bash
clang-tidy src/*.cpp -p build/
cppcheck --enable=all --std=c++20 --suppress=missingInclude src/
include-what-you-use -std=c++20 src/main.cpp
```

## Catch2 Example

```cpp
TEST_CASE("Vector grows as elements are appended", "[vector]") {
    std::vector<int> values;
    values.push_back(1);
    values.push_back(2);
    REQUIRE(values.size() == 2);
}
```

## GoogleTest Example

```cpp
class CalculatorTest : public ::testing::Test {
protected:
    Calculator calc;
};

TEST_F(CalculatorTest, AddsIntegers) {
    EXPECT_EQ(calc.add(2, 3), 5);
}
```

## Benchmark Example

```cpp
static void BM_VectorReserve(benchmark::State& state) {
    for (auto _ : state) {
        std::vector<int> values;
        values.reserve(state.range(0));
        for (int i = 0; i < state.range(0); ++i) values.push_back(i);
    }
}
BENCHMARK(BM_VectorReserve)->Range(8, 8 << 10);
```
