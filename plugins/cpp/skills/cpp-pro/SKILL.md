---
name: cpp-pro
description: "Applies modern C++ development patterns."
origin: lamella
---

# C++ Pro

Modern C++20/23 patterns for systems programming, high-performance computing, and zero-overhead abstractions.

## When to Use This Skill

- Building high-performance C++ applications
- Implementing template metaprogramming solutions
- Optimizing memory-critical systems
- Developing concurrent and parallel algorithms
- Creating custom allocators and memory pools
- Systems programming and embedded development

## Core Workflow

1. **Analyze architecture** - Review build system, compiler flags, performance requirements
2. **Design with concepts** - Create type-safe interfaces using C++20 concepts
3. **Implement zero-cost** - Apply RAII, constexpr, and zero-overhead abstractions
4. **Verify quality** - Run sanitizers, static analysis, and performance benchmarks
5. **Optimize** - Profile, measure, and apply targeted optimizations

## Reference Guide

Load detailed guidance based on context:

| Topic | Reference | Load When |
|-------|-----------|-----------|
| Modern C++ Features | `references/modern-cpp.md` | C++20/23 features, concepts, ranges, coroutines |
| Template Metaprogramming | `references/templates.md` | Variadic templates, SFINAE, type traits, CRTP |
| Memory & Performance | `references/memory-performance.md` | Allocators, SIMD, cache optimization, move semantics |
| Concurrency | `references/concurrency.md` | Atomics, lock-free structures, thread pools, coroutines |
| Build & Tooling | `references/build-tooling.md` | CMake, sanitizers, static analysis, testing |
| Coding Standards | `references/coding-standards.md` | C++ Core Guidelines quick reference, rule tables, checklist |

## Constraints

### MUST DO
- Follow C++ Core Guidelines
- Use concepts for template constraints
- Apply RAII universally
- Use `auto` with type deduction
- Prefer `std::unique_ptr` and `std::shared_ptr`
- Enable all compiler warnings (-Wall -Wextra -Wpedantic)
- Run AddressSanitizer and UndefinedBehaviorSanitizer
- Write const-correct code

### MUST NOT DO
- Use raw `new`/`delete` (prefer smart pointers)
- Ignore compiler warnings
- Use C-style casts (use static_cast, etc.)
- Mix exception and error code patterns inconsistently
- Write non-const-correct code
- Use `using namespace std` in headers
- Ignore undefined behavior
- Skip move semantics for expensive types

## Output Templates

When implementing C++ features, provide:
1. Header file with interfaces and templates
2. Implementation file (when needed)
3. CMakeLists.txt updates (if applicable)
4. Test file demonstrating usage
5. Brief explanation of design decisions and performance characteristics

## Knowledge Reference

C++20/23, concepts, ranges, coroutines, modules, template metaprogramming, SFINAE, type traits, CRTP, smart pointers, custom allocators, move semantics, RAII, SIMD, atomics, lock-free programming, CMake, Conan, sanitizers, clang-tidy, cppcheck, Catch2, GoogleTest
### Additional Resources

- [Anti Patterns](references/anti-patterns.md)
- [Code Examples](references/code-examples.md)
