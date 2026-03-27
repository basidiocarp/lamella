# PromQL Aggregation and Rate Functions

This reference covers the functions used most often in day-to-day query writing:
aggregation, counter math, range-vector analysis, and the utility helpers that
support them.

## Aggregation Operators

```promql
sum by (job, endpoint) (http_requests_total)
avg by (environment) (cpu_usage_percent)
max(memory_usage_bytes)
count(up == 1)
topk(5, rate(http_requests_total[5m]))
quantile(0.95, response_time_seconds)
```

Use:

- `sum` for totals
- `avg` for typical values
- `max` or `min` for envelope checks
- `count` for active series counts
- `topk` and `bottomk` for hotspots
- `quantile` for simple non-histogram percentile calculations

## Counter Functions

```promql
rate(http_requests_total[5m])
irate(http_requests_total[5m])
increase(http_requests_total[1h])
resets(http_requests_total[1h])
```

Rules:

- `rate` is the normal default for counters.
- `irate` is for spike visibility.
- `increase` is for “how much happened in this window?”
- `resets` is useful when debugging restarts or bad instrumentation.

## Range-Vector Helpers

```promql
avg_over_time(memory_usage_bytes[5m])
max_over_time(queue_depth[1h])
count_over_time(up[5m])
deriv(queue_depth[10m])
predict_linear(disk_usage_bytes[6h], 3600)
double_exponential_smoothing(metric[1h], 0.2, 0.2)
```

Use `*_over_time` for gauges and windowed analysis, not for raw counters unless
the metric shape truly supports it.

## Utility Functions

```promql
abs(node_load1)
round(cpu_usage_percent, 0.1)
clamp(memory_pressure_ratio, 0, 1)
scalar(vector(5))
sort_desc(rate(http_requests_total[5m]))
group(up)
```

These are useful, but they should not be carrying the meaning of the query on
their own.

## Rules

- Aggregate after selecting the right metric and function, not before.
- Prefer short readable pipelines over dense one-liners.
- If the query is expensive and reused, move it into a recording rule.
