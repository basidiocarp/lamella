# Template Metaprogramming

Use this reference when modern C++ needs compile-time type logic, variadic APIs,
or zero-cost customization. Prefer the simplest template technique that solves
the problem.

## Variadic Templates

Use variadic templates when the API naturally accepts a parameter pack.

```cpp
template <typename... Args>
auto make_tuple_advanced(Args&&... args) {
    return std::tuple<std::decay_t<Args>...>(std::forward<Args>(args)...);
}
```

Good fits:
- forwarding constructors and factory helpers
- tuple or heterogenous container builders
- fold-expression utilities

## Constrained Dispatch

Prefer `if constexpr`, concepts, or constrained overloads over older
`std::enable_if` patterns when the codebase permits it.

```cpp
template <typename T>
void serialize(const T& value) {
    if constexpr (std::is_integral_v<T>) {
        // integral path
    } else {
        // default path
    }
}
```

Use SFINAE only when compatibility or overload-shaping requires it.

## Type Traits

Traits answer questions about types or expose type transformations.

Typical uses:
- remove or add qualifiers and wrappers
- detect whether an operation exists
- enable a specialized implementation only for certain type categories

Keep custom traits small and composable. If the standard library already exposes
the trait you need, use it directly.

## CRTP

CRTP gives static polymorphism without a vtable.

```cpp
template <typename Derived>
class Shape {
public:
    double area() const {
        return static_cast<const Derived*>(this)->area_impl();
    }
};
```

Best fit:
- tiny performance-sensitive interfaces
- mixin behavior
- compile-time extension points

Avoid it when runtime substitution is actually required.

## Template Template Parameters

Use template template parameters when callers supply a container or policy
template, not just a concrete type.

```cpp
template <typename T, template <typename...> class Container>
class Stack {
    Container<T> items_;
};
```

This is useful for containers, allocators, and policy families, but it raises
API complexity quickly.

## Compile-Time Computation

Use `constexpr` and `consteval` for:
- constant lookup tables
- validation of invariants at compile time
- tiny algorithmic helpers where compile-time evaluation is worth it

Do not force large computations into compile time unless the cost and build-time
impact are justified.

## Expression Templates

Expression templates are for advanced performance-sensitive numeric or DSL code.
They avoid temporaries by representing computations lazily.

Use them only when profiling justifies the extra complexity. For most code,
ordinary templates plus compiler optimization are enough.

## Technique Guide

| Technique | Best use |
|---|---|
| variadic templates | parameter-pack APIs |
| `if constexpr` / concepts | type-based branching |
| traits | type queries and adaptation |
| CRTP | static polymorphism |
| template template parameters | container or policy families |
| `constexpr` | compile-time tables and checks |
| expression templates | high-performance numeric DSLs |

Default to readability first. Template metaprogramming is only a win when the
abstraction is still understandable after the optimization.
