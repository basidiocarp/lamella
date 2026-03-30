# opt-target-cpu

> Use `target-cpu=native` for maximum performance on known deployment targets

Tune `target-cpu` only when the deployment environment is controlled.

## Prefer

- `target-cpu=native` for private builds on known machines
- explicit conservative targets for distributed binaries
- documenting portability assumptions when target tuning changes

## Avoid

- shipping `native`-tuned binaries to unknown hardware
- hiding compatibility tradeoffs behind local benchmark wins
- target tuning before confirming CPU instructions are the bottleneck

## See Also

- [opt-simd-portable](./opt-simd-portable.md) - Keep vectorization portable where needed
- [perf-release-profile](./perf-release-profile.md) - Treat release tuning as a coherent policy
