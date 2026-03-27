# Prometheus Histograms and Summaries

This reference covers distribution-shaped metrics: latency, payload sizes, and
other observations that need more than a single scalar value.

## Histogram

Histograms expose bucket counts plus a `_sum` and `_count`. They are the
standard choice for service-level latency analysis because they aggregate well
across many instances.

For `http_request_duration_seconds`, Prometheus exposes:

```text
http_request_duration_seconds_bucket{le="0.1"}
http_request_duration_seconds_bucket{le="0.5"}
http_request_duration_seconds_bucket{le="1"}
http_request_duration_seconds_bucket{le="+Inf"}
http_request_duration_seconds_sum
http_request_duration_seconds_count
```

### Common Histogram Queries

```promql
# 95th percentile latency
histogram_quantile(
  0.95,
  sum by (le) (rate(http_request_duration_seconds_bucket[5m]))
)

# Average duration
rate(http_request_duration_seconds_sum[5m])
/
rate(http_request_duration_seconds_count[5m])

# Fraction of requests at or below 200ms
sum(rate(http_request_duration_seconds_bucket{le="0.2"}[5m]))
/
sum(rate(http_request_duration_seconds_count[5m]))
```

Rules:

- Aggregate buckets by `le` before calling `histogram_quantile`.
- Choose bucket boundaries that match real thresholds.
- Prefer histograms when the query must aggregate across instances or pods.

## Summary

Summaries calculate quantiles on the client side. They also expose `_sum` and
`_count`, but their quantiles do not aggregate well across many targets.

```promql
rpc_duration_seconds{quantile="0.95"}
rpc_duration_seconds_sum
rpc_duration_seconds_count
```

Rules:

- Use summaries when per-instance percentiles are enough.
- Avoid summaries for fleet-wide alerting where aggregation matters.

## Choosing Between Them

- Histogram: better default for shared service dashboards and alerting.
- Summary: acceptable for local process views or SDK-style instrumentation.
