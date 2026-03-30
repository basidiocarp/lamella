# opt-pgo-profile

> Use Profile-Guided Optimization (PGO) for maximum performance

Use PGO when the performance budget justifies a heavier build pipeline.

## Prefer

- realistic training workloads that match production behavior
- PGO for stable hot binaries where incremental runtime gains matter
- documenting how profiles are captured and applied

## Avoid

- PGO with synthetic or unrepresentative workloads
- adding PGO complexity before simpler wins are exhausted
- expecting PGO to fix poor algorithms or data layout

## See Also

- [perf-profile-first](./perf-profile-first.md) - Find the real hotspot first
- [opt-lto-release](./opt-lto-release.md) - Pair advanced profile tuning intentionally
