# opt-lto-release

> Enable LTO in release builds

Use LTO when the shipped binary benefits enough to justify slower builds.

## Prefer

- LTO in release profiles for performance-sensitive binaries and libraries
- measuring binary size and runtime impact before standardizing the setting
- documenting the chosen LTO mode in the project profile

## Avoid

- assuming LTO is always worth the compile-time cost
- copying full-fat release profiles into every crate without validation
- treating LTO as a substitute for algorithmic or allocation fixes

## See Also

- [opt-codegen-units](./opt-codegen-units.md) - Tune codegen units intentionally
- [perf-release-profile](./perf-release-profile.md) - Keep release profile policy coherent
