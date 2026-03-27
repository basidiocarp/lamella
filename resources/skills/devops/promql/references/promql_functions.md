# PromQL Functions Reference

Use this file as the routing layer for PromQL function selection.

## Load Order

| Need | Reference |
| --- | --- |
| Aggregation operators, counter functions, range-vector helpers, and common utility functions | `aggregation-and-rate-functions.md` |
| Time extraction, histogram helpers, label manipulation, and experimental features | `time-and-experimental-functions.md` |

## Core Rules

- Choose the function based on the metric type first, then on the desired
  output shape.
- Keep experimental functions out of default guidance unless the Prometheus
  version is known.
- Use the focused references instead of treating this page as a long catalog.
