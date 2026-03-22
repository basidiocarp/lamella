# Concurrency and Parallel Programming

## Atomics and Memory Ordering

```cpp
#include <atomic>
#include <thread>

// Basic atomics
std::atomic<int> counter{0};
// ... (24 lines trimmed)
int increment_counter(std::atomic<int>& counter) {
    return counter.fetch_add(1, std::memory_order_relaxed);
}
```

## Lock-Free Data Structures

```cpp
#include <atomic>
#include <memory>

// Lock-free stack
template<typename T>
// ... (70 lines trimmed)
        return true;
    }
};
```

## Thread Pool

```cpp
#include <thread>
#include <queue>
#include <mutex>
#include <condition_variable>
#include <functional>
// ... (68 lines trimmed)
        return result;
    }
};
```

## Parallel STL Algorithms

```cpp
#include <algorithm>
#include <execution>
#include <vector>
#include <numeric>

// ... (25 lines trimmed)
        [](int x) { return x * x; }
    );
}
```

## Synchronization Primitives

```cpp
#include <mutex>
#include <shared_mutex>
#include <condition_variable>

// Mutex types
// ... (65 lines trimmed)
    from.balance -= amount;
    to.balance += amount;
}
```

## Async and Futures

```cpp
#include <future>

// std::async
auto future = std::async(std::launch::async, []() {
    return expensive_computation();
// ... (28 lines trimmed)

int sum = task_future.get();  // 8
task_thread.join();
```

## Coroutine-Based Concurrency

```cpp
#include <coroutine>
#include <optional>

// Async task coroutine
template<typename T>
// ... (42 lines trimmed)
AsyncTask<int> async_compute() {
    co_return 42;
}
```

## Quick Reference

| Primitive | Use Case | Performance |
|-----------|----------|-------------|
| std::atomic | Simple shared state | Lock-free |
| std::mutex | Exclusive access | Kernel call |
| std::shared_mutex | Read-heavy workload | Better than mutex |
| Lock-free structures | High contention | Best throughput |
| Thread pool | Task parallelism | Avoid thread overhead |
| Parallel STL | Data parallelism | Automatic scaling |
| std::async | Simple async tasks | Thread pool |
| Coroutines | Async I/O | Minimal overhead |

## Memory Ordering Guide

| Ordering | Guarantees | Use Case |
|----------|-----------|----------|
| relaxed | No synchronization | Counters |
| acquire | Load barrier | Consumer |
| release | Store barrier | Producer |
| acq_rel | Both | RMW operations |
| seq_cst | Total order | Default |
