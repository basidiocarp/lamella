# opt-codegen-units

> Set `codegen-units = 1` for maximum optimization in release builds

Lower codegen units only when the release-performance gain is worth the compile
time cost.

## Prefer

- `codegen-units = 1` for performance-sensitive release builds after measuring
- separate dev and release expectations
- documenting non-default profile tuning

## Avoid

- copying aggressive release settings into every crate blindly
- optimizing release profile settings without measuring the shipped binary
- forgetting the compile-time tradeoff

## See Also

- [opt-lto-release](./opt-lto-release.md) - Combine profile tuning intentionally
- [perf-release-profile](./perf-release-profile.md) - Treat release profile as part of performance policy
