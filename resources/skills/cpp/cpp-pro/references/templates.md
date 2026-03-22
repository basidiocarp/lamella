# Template Metaprogramming

## Variadic Templates

```cpp
#include <iostream>
#include <utility>

// Fold expressions (C++17)
template<typename... Args>
// ... (29 lines trimmed)
auto make_tuple_advanced(Args&&... args) {
    return std::tuple<std::decay_t<Args>...>(std::forward<Args>(args)...);
}
```

## SFINAE and if constexpr

```cpp
#include <type_traits>

// SFINAE with std::enable_if (older style)
template<typename T>
std::enable_if_t<std::is_integral_v<T>, T>
// ... (39 lines trimmed)
        // Default serialization
    }
}
```

## Type Traits

```cpp
#include <type_traits>

// Custom type traits
template<typename T>
struct remove_all_pointers {
// ... (34 lines trimmed)
template<typename T>
struct has_reserve<T, std::void_t<decltype(std::declval<T>().reserve(size_t{}))>>
    : std::true_type {};
```

## CRTP (Curiously Recurring Template Pattern)

```cpp
// Static polymorphism with CRTP
template<typename Derived>
class Shape {
public:
    double area() const {
// ... (51 lines trimmed)
        return "User: " + name_;
    }
};
```

## Template Template Parameters

```cpp
#include <vector>
#include <list>
#include <deque>

// Template template parameter
// ... (21 lines trimmed)
Stack<int, std::vector> vector_stack;
Stack<int, std::deque> deque_stack;
Stack<int, std::list> list_stack;
```

## Compile-Time Computation

```cpp
#include <array>

// Compile-time factorial
constexpr int factorial(int n) {
    return n <= 1 ? 1 : n * factorial(n - 1);
// ... (28 lines trimmed)
}

constexpr auto first_10_primes = generate_primes<10>();
```

## Expression Templates

```cpp
// Lazy evaluation with expression templates
template<typename E>
class VecExpression {
public:
    double operator[](size_t i) const {
// ... (50 lines trimmed)
}

// Usage: a = b + c + d  (no temporaries created!)
```

## Quick Reference

| Technique | Use Case | Performance |
|-----------|----------|-------------|
| Variadic Templates | Variable arguments | Zero overhead |
| SFINAE | Conditional compilation | Compile-time |
| if constexpr | Type-based branching | Zero overhead |
| CRTP | Static polymorphism | No vtable cost |
| Expression Templates | Lazy evaluation | Eliminates temps |
| Type Traits | Type introspection | Compile-time |
| Fold Expressions | Parameter pack ops | Optimal |
| Template Specialization | Type-specific impl | Zero overhead |
