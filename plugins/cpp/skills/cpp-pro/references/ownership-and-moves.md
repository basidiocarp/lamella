# Ownership and Moves

Use this reference for smart pointers, forwarding, and copy-elision guidance.

## Smart Pointer Defaults

```cpp
auto create_resource() {
    return std::make_unique<Resource>("data");
}

class Session : public std::enable_shared_from_this<Session> {
public:
    std::shared_ptr<Session> self() { return shared_from_this(); }
};
```

## Move-Aware Buffer

```cpp
class Buffer {
public:
    explicit Buffer(std::size_t size)
        : size_(size), data_(std::make_unique<std::byte[]>(size)) {}

    Buffer(Buffer&&) noexcept = default;
    Buffer& operator=(Buffer&&) noexcept = default;

private:
    std::size_t size_;
    std::unique_ptr<std::byte[]> data_;
};
```

## Perfect Forwarding

```cpp
template <typename T>
void wrapper(T&& arg) {
    process(std::forward<T>(arg));
}
```

## RVO and NRVO

```cpp
std::vector<int> create_vector() {
    std::vector<int> values{1, 2, 3, 4, 5};
    return values;
}
```
