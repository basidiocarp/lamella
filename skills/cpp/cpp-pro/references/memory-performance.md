# Memory Management & Performance

## Smart Pointers

```cpp
#include <memory>

// unique_ptr - exclusive ownership
auto create_resource() {
    return std::make_unique<Resource>("data");
// ... (17 lines trimmed)
        return shared_from_this();
    }
};
```

## Custom Allocators

```cpp
#include <memory>
#include <vector>

// Pool allocator for fixed-size objects
template<typename T, size_t PoolSize = 1024>
// ... (71 lines trimmed)
        offset_ = 0;
    }
};
```

## Move Semantics

```cpp
#include <utility>
#include <algorithm>

class Buffer {
    size_t size_;
// ... (47 lines trimmed)
void wrapper(T&& arg) {
    process(std::forward<T>(arg));  // Preserves lvalue/rvalue
}
```

## SIMD Optimization

```cpp
#include <immintrin.h>  // AVX/AVX2
#include <cstring>

// Vectorized sum using AVX2
float simd_sum(const float* data, size_t size) {
// ... (35 lines trimmed)
        _mm256_storeu_ps(&result[i], vr);
    }
}
```

## Cache-Friendly Design

```cpp
// Structure of Arrays (SoA) - better cache locality
struct ParticlesAoS {
    struct Particle {
        float x, y, z;
        float vx, vy, vz;
// ... (32 lines trimmed)
        process(data[i]);
    }
}
```

## Memory Pool

```cpp
#include <vector>
#include <memory>

template<typename T, size_t ChunkSize = 256>
class MemoryPool {
// ... (41 lines trimmed)
        deallocate(ptr);
    }
};
```

## Copy Elision and RVO

```cpp
// Return Value Optimization (RVO)
std::vector<int> create_vector() {
    std::vector<int> vec{1, 2, 3, 4, 5};
    return vec;  // RVO applies, no copy/move
}
// ... (21 lines trimmed)
}

auto obj = create();  // OK in C++17
```

## Alignment and Memory Layout

```cpp
#include <cstddef>

// Control alignment
struct alignas(64) CacheAligned {
    int data[16];
// ... (15 lines trimmed)
alignas(32) std::byte buffer[sizeof(Data)];
Data* obj = new (buffer) Data();
obj->~Data();  // Manual destruction needed
```

## Quick Reference

| Technique | Use Case | Benefit |
|-----------|----------|---------|
| Smart Pointers | Ownership management | Memory safety |
| Move Semantics | Avoid copies | Performance |
| Custom Allocators | Specialized allocation | Speed + control |
| SIMD | Parallel computation | 4-8x speedup |
| SoA Layout | Sequential access | Cache efficiency |
| Memory Pools | Frequent alloc/dealloc | Reduced fragmentation |
| Alignment | SIMD/cache optimization | Performance |
| RVO/NRVO | Return objects | Zero-copy |
