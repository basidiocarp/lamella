# Recording Rules

Use recording rules for queries that are expensive, reused often, or needed by alerts and dashboards.

## Good Uses

- request rate rollups
- latency percentile helpers
- per-instance saturation aggregates

## Guardrails

- Keep names consistent and readable.
- Avoid over-producing derived series that no one uses.
- Validate rules with `promtool` before rollout.
