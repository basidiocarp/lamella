# Modern C++20/23 Features

This reference is now a routing layer for the feature sets most often loaded independently.

## Reference Map

| Need | Load |
|------|------|
| Concepts, ranges, and three-way comparison | [concepts-ranges-and-comparison.md](concepts-ranges-and-comparison.md) |
| Coroutines and modules | [coroutines-and-modules.md](coroutines-and-modules.md) |
| Designated initializers, constexpr improvements, and `std::format` | [constexpr-format-and-initializers.md](constexpr-format-and-initializers.md) |

## When to Reach for This Ref

- You are reviewing whether a solution should use a C++20/23 feature instead of an older pattern.
- You need a compact map of modern language features before diving into examples.
- You want to separate language-feature questions from template-heavy or concurrency-heavy questions.

## Version Snapshot

| Feature | C++17 | C++20 | C++23 |
|---------|-------|-------|-------|
| Concepts | - | yes | yes |
| Ranges | - | yes | yes |
| Coroutines | - | yes | yes |
| Modules | - | yes | yes |
| Spaceship | - | yes | yes |
| `std::format` | - | yes | yes |
| `std::expected` | - | - | yes |
| `std::print` | - | - | yes |
| Deducing `this` | - | - | yes |
