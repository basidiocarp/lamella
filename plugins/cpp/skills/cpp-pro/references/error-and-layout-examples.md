# Error and Layout Examples

Use this reference for initialization, exception boundaries, constants, and layout-oriented choices.

## Initialization by Default

```cpp
const int max_retries{3};
const std::string name{"widget"};
const std::vector<int> primes{2, 3, 5, 7, 11};

const auto checksum = [] {
    int c = 0;
    for (int value : primes) c += value;
    return c;
}();
```

## Exception Hierarchy

```cpp
class AppError : public std::runtime_error {
public:
    using std::runtime_error::runtime_error;
};

class ParseError : public AppError {
public:
    using AppError::AppError;
};

void load_config(const std::string& path) {
    if (path.empty()) throw ParseError("config path is empty");
}
```

## Immutability and Constants

```cpp
class Sensor {
public:
    explicit Sensor(std::string id) : id_(std::move(id)) {}
    const std::string& id() const { return id_; }

private:
    std::string id_;
};

constexpr double PI = 3.14159265358979;
constexpr int MAX_SENSORS = 256;
```

## Layout and Storage Choices

```cpp
struct Point {
    int x{};
    int y{};
};

std::vector<Point> points;                     // contiguous
std::vector<std::unique_ptr<Point>> indirect; // extra indirection

std::array<int, 256> table{};
for (int i = 0; i < 256; ++i) {
    table[i] = i * i;
}
```
