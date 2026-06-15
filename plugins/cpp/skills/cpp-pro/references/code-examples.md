# C++ Core Guidelines Example Map

Use this page as the entry point for example-heavy guidance. The original all-in-one example sheet overlapped heavily with the dedicated `modern-cpp`, `concurrency`, and `memory-performance` refs, so it now routes by concern instead of repeating partial snippets.

## Start Here

| Need | Load |
|------|------|
| Interface shape, parameter passing, and pure functions | [interface-and-function-examples.md](interface-and-function-examples.md) |
| Rule of zero, RAII wrappers, and inheritance boundaries | [class-and-resource-examples.md](class-and-resource-examples.md) |
| Initialization, error handling, constants, and layout choices | [error-and-layout-examples.md](error-and-layout-examples.md) |

## Use the Dedicated Refs for These Topics

| Topic | Reference |
|-------|-----------|
| C++20/23 language features | [modern-cpp.md](modern-cpp.md) |
| Atomics, thread pools, futures, coroutines | [concurrency.md](concurrency.md) |
| Allocators, move semantics, SIMD, cache behavior | [memory-performance.md](memory-performance.md) |
| Templates, concepts, and generic patterns | [templates.md](templates.md) |
| Build, sanitizers, tests, and CI | [build-tooling.md](build-tooling.md) |

## Selection Guide

- Reach for the focused example refs when the user needs copy-pasteable Core Guidelines patterns.
- Prefer the dedicated topic refs when the question is primarily about language features, concurrency models, or performance engineering.
- Avoid pulling this page and all topic refs at once unless the task is a full C++ codebase review.
