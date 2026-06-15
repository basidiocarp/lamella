# Allocators and Pools

Use this reference when allocation behavior is part of the performance problem.

## Pool Allocator Sketch

```cpp
template <typename T, std::size_t PoolSize = 1024>
class PoolAllocator {
public:
    using value_type = T;

    T* allocate(std::size_t n) {
        if (offset_ + n > PoolSize) throw std::bad_alloc{};
        T* ptr = reinterpret_cast<T*>(&storage_[offset_]);
        offset_ += n;
        return ptr;
    }

    void deallocate(T*, std::size_t) noexcept {}

private:
    std::array<std::byte, sizeof(T) * PoolSize> storage_{};
    std::size_t offset_{0};
};
```

## Simple Object Pool

```cpp
template <typename T>
class MemoryPool {
public:
    template <typename... Args>
    T* create(Args&&... args) {
        auto slot = std::make_unique<T>(std::forward<Args>(args)...);
        T* ptr = slot.get();
        storage_.push_back(std::move(slot));
        return ptr;
    }

private:
    std::vector<std::unique_ptr<T>> storage_;
};
```

## When to Use

- Allocation churn is visible in profiles.
- Object sizes are stable and lifetimes are well-bounded.
- General-purpose allocators are dominating latency or fragmentation.
