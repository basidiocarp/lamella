# Helm Chart Structure Reference

Use this file as the routing layer for chart anatomy and packaging structure.

## Load Order

| Need | Reference |
| --- | --- |
| Chart directory layout, `Chart.yaml`, values files, and template placement | `chart-metadata-and-layout.md` |
| Dependencies, CRDs, tests, hooks, and packaging lifecycle | `chart-lifecycle-and-distribution.md` |

## Core Rules

- Keep the chart root recognizable at a glance.
- Separate metadata/layout guidance from release-lifecycle guidance.
- Use the routing pages to keep older links valid while the detailed examples
  move into focused references.
