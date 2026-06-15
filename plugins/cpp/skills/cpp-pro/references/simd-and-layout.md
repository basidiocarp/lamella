# SIMD and Layout

Use this reference when the hotspot is numeric or cache-bound.

## AVX2 Reduction Sketch

```cpp
float simd_sum(const float* data, std::size_t size) {
    __m256 acc = _mm256_setzero_ps();
    std::size_t i = 0;
    for (; i + 8 <= size; i += 8) {
        acc = _mm256_add_ps(acc, _mm256_loadu_ps(data + i));
    }
    alignas(32) float lanes[8];
    _mm256_store_ps(lanes, acc);
    return std::accumulate(std::begin(lanes), std::end(lanes), 0.0f);
}
```

## Structure of Arrays

```cpp
struct ParticlesSoA {
    std::vector<float> x, y, z;
    std::vector<float> vx, vy, vz;
};
```

## Alignment

```cpp
struct alignas(64) CacheAligned {
    int data[16];
};

alignas(32) std::byte buffer[sizeof(Data)];
Data* obj = new (buffer) Data();
obj->~Data();
```

## Guardrails

- Confirm the target ISA and fallback behavior before adding intrinsics.
- Prefer layout fixes before hand-vectorized code when the bottleneck is cache locality.
