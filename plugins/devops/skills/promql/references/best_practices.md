# PromQL Best Practices

Use this reference as the main checklist for writing PromQL that is correct,
efficient, and maintainable. It intentionally avoids re-explaining full metric
type theory or every function category; those live in the focused references.

## Label Filters and Cardinality

- Add at least one workload-scoping label such as `job`, `service`,
  `environment`, or `cluster`.
- Prefer exact matches over regex when the value is known.
- Avoid grouping by high-cardinality labels such as user IDs, request IDs, or
  raw URLs.

```promql
# Good
rate(http_requests_total{job="api", environment="production"}[5m])

# Bad
rate(http_requests_total[5m])
```

## Match Metric Type to Function

- Counters: `rate`, `irate`, or `increase`
- Gauges: direct use or `*_over_time`
- Histograms: aggregate buckets by `le`, then use `histogram_quantile`
- Summaries: use `_sum` and `_count` for averages; do not average quantiles

```promql
rate(http_requests_total[5m])

avg_over_time(memory_usage_bytes[5m])

histogram_quantile(
  0.95,
  sum by (service, le) (rate(http_request_duration_seconds_bucket[5m]))
)
```

## Aggregation Rules

- Use `by(...)` when you know exactly which labels should remain.
- Use `without(...)` when you need to drop a small set of noisy labels.
- Aggregate before calculating histogram quantiles.

```promql
sum by (service) (rate(http_requests_total[5m]))

sum without (instance, pod) (rate(http_requests_total[5m]))
```

## Time Range Selection

- Use at least `4x` the scrape interval for `rate`.
- Default to `[5m]` unless you have a reason to be faster or slower.
- Use `irate` only when you want spike sensitivity.

```promql
rate(requests_total[5m])
irate(requests_total[5m])
```

## Performance and Recording Rules

- Large ranges and deep subqueries cost more than most dashboards need.
- Precompute expensive repeated queries with recording rules.
- Prefer a recorded metric over repeatedly re-running a long histogram query.

```yaml
- record: job:http_requests:rate5m
  expr: sum by (job) (rate(http_requests_total[5m]))

- record: service:http_request_duration:p95
  expr: |
    histogram_quantile(
      0.95,
      sum by (service, le) (rate(http_request_duration_seconds_bucket[5m]))
    )
```

## Alerting Rules

- Make alert expressions clearly boolean.
- Use `for:` to suppress short-lived noise.
- Keep dashboard-oriented smoothing and alert-oriented sensitivity separate.

```yaml
alert: HighErrorRate
expr: |
  sum(rate(http_requests_total{status_code=~"5.."}[5m]))
  /
  sum(rate(http_requests_total[5m])) > 0.05
for: 10m
```

## Review Checklist

- Are label filters specific enough?
- Does the function match the metric type?
- Is the aggregation shape explicit?
- Is the time range appropriate for the scrape interval and use case?
- Should this query become a recording rule?
