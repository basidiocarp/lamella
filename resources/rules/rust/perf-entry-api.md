# perf-entry-api

> Use entry API for map insert-or-update

Use the map entry API when lookup and update should happen in one pass.

## Prefer

- `entry` for insert-or-modify logic
- one lookup path instead of contains-get-insert chains
- clear closures or branches when update logic is non-trivial

## Avoid

- double lookups in hot paths
- entry-based code that becomes harder to read than the simpler version
- using `entry` when plain insertion or retrieval is enough

## See Also

- [perf-extend-batch](./perf-extend-batch.md) - Insert in batches efficiently
- [perf-profile-first](./perf-profile-first.md) - Optimize the real hotspot
