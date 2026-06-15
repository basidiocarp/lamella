# Interface and Function Examples

Use these examples when reviewing API boundaries, parameter passing, and pure computation style.

## Strong Interface Shapes

```cpp
struct Temperature {
    double kelvin;
};

Temperature boil(const Temperature& water);
```

```cpp
double boil(double* temp);  // unclear ownership and units
```

## Parameter Passing

```cpp
void print(int x);                      // cheap type by value
void analyze(const std::string& data);  // expensive type by const&
void transform(std::string s);          // sink by value, move internally
```

```cpp
void parse(std::string_view input) {
    std::string token;
    int pos = 0;
    // parse and return a structured result instead of mutating out-params
}
```

```cpp
void parse(std::string_view input, std::string& token, int& pos);  // avoid
```

## Pure and `constexpr` Functions

```cpp
constexpr int factorial(int n) noexcept {
    return (n <= 1) ? 1 : n * factorial(n - 1);
}

static_assert(factorial(5) == 120);
```

## Header Self-Containment

```cpp
#pragma once

#include <memory>
#include <string>

namespace project::module {

class Widget {
public:
    explicit Widget(std::string name);
    void render() const;

private:
    std::string name_;
};

}  // namespace project::module
```
