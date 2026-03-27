# Class and Resource Examples

Use these examples when the review is about ownership, hierarchy safety, or RAII wrappers.

## Rule of Zero

```cpp
struct Employee {
    std::string name;
    std::string department;
    int id;
};
```

## Rule of Five for Owned Buffers

```cpp
class Buffer {
public:
    explicit Buffer(std::size_t size)
        : data_(std::make_unique<char[]>(size)), size_(size) {}

    Buffer(const Buffer& other)
        : data_(std::make_unique<char[]>(other.size_)), size_(other.size_) {
        std::copy(other.data_.get(), other.data_.get() + size_, data_.get());
    }

    Buffer& operator=(const Buffer& other) {
        if (this == &other) return *this;
        auto copy = std::make_unique<char[]>(other.size_);
        std::copy(other.data_.get(), other.data_.get() + other.size_, copy.get());
        data_ = std::move(copy);
        size_ = other.size_;
        return *this;
    }

    Buffer(Buffer&&) noexcept = default;
    Buffer& operator=(Buffer&&) noexcept = default;
    ~Buffer() = default;

private:
    std::unique_ptr<char[]> data_;
    std::size_t size_;
};
```

## Virtual Hierarchy Boundaries

```cpp
class Shape {
public:
    virtual ~Shape() = default;
    virtual double area() const = 0;
};

class Circle final : public Shape {
public:
    explicit Circle(double radius) : radius_(radius) {}
    double area() const override { return 3.14159265358979 * radius_ * radius_; }

private:
    double radius_;
};
```

## RAII File Wrapper

```cpp
class FileHandle {
public:
    explicit FileHandle(const std::string& path)
        : handle_(std::fopen(path.c_str(), "r")) {
        if (!handle_) throw std::runtime_error("failed to open file");
    }

    ~FileHandle() {
        if (handle_) std::fclose(handle_);
    }

    FileHandle(const FileHandle&) = delete;
    FileHandle& operator=(const FileHandle&) = delete;

private:
    std::FILE* handle_;
};
```
