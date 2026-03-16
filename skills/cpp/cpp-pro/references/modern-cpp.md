# Modern C++20/23 Features

## Concepts and Constraints

```cpp
#include <concepts>

// Define custom concepts
template<typename T>
concept Numeric = std::integral<T> || std::floating_point<T>;
// ... (28 lines trimmed)
void process(T value) {
    std::cout << "Processing float: " << value << '\n';
}
```

## Ranges and Views

```cpp
#include <ranges>
#include <vector>
#include <algorithm>

// Ranges-based algorithms
// ... (16 lines trimmed)
              | std::views::transform(square);

auto processed = numbers | pipeline;
```

## Coroutines

```cpp
#include <coroutine>
#include <iostream>
#include <memory>

// Generator coroutine
// ... (66 lines trimmed)
    co_await std::suspend_always{};
    std::cout << "Resuming async work\n";
}
```

## Three-Way Comparison (Spaceship)

```cpp
#include <compare>

struct Point {
    int x, y;

// ... (13 lines trimmed)

    bool operator==(const Version& other) const = default;
};
```

## Designated Initializers

```cpp
struct Config {
    std::string host = "localhost";
    int port = 8080;
    bool ssl_enabled = false;
    int timeout_ms = 5000;
};

// C++20 designated initializers
Config cfg {
    .host = "example.com",
    .port = 443,
    .ssl_enabled = true
    // timeout_ms uses default
};
```

## Modules (C++20)

```cpp
// math.cppm - module interface
export module math;

export namespace math {
    template<typename T>
// ... (22 lines trimmed)
    math::Calculator calc;
    auto product = calc.multiply(4, 7);
}
```

## constexpr Enhancements

```cpp
#include <string>
#include <vector>
#include <algorithm>

// C++20: constexpr std::string and std::vector
// ... (14 lines trimmed)
struct Derived : Base {
    constexpr int get_value() const override { return 100; }
};
```

## std::format (C++20)

```cpp
#include <format>
#include <iostream>

int main() {
    std::string msg = std::format("Hello, {}!", "World");
// ... (20 lines trimmed)
        return std::format_to(ctx.out(), "({}, {})", p.x, p.y);
    }
};
```

## Quick Reference

| Feature | C++17 | C++20 | C++23 |
|---------|-------|-------|-------|
| Concepts | - | ✓ | ✓ |
| Ranges | - | ✓ | ✓ |
| Coroutines | - | ✓ | ✓ |
| Modules | - | ✓ | ✓ |
| Spaceship | - | ✓ | ✓ |
| std::format | - | ✓ | ✓ |
| std::expected | - | - | ✓ |
| std::print | - | - | ✓ |
| Deducing this | - | - | ✓ |
