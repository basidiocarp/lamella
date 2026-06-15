# Advanced PromQL Query Techniques

Use this reference when the basic `rate`, `sum by`, and ratio patterns are not
enough. These techniques are the ones that usually decide whether a PromQL
query is merely valid or actually useful in production.

## Subqueries

Subqueries run a range query over the result of another range or instant query.
They are useful when you need a second layer of time-based reasoning.

```promql
# Highest 5m request rate observed during the last 30m
max_over_time(
  rate(http_requests_total[5m])[30m:1m]
)

# 95th percentile latency computed from 5m bucket rates,
# then evaluated across a 6h window
max_over_time(
  histogram_quantile(
    0.95,
    sum by (le) (rate(http_request_duration_seconds_bucket[5m]))
  )[6h:5m]
)
```

Common pattern:

```promql
# Detect whether traffic more than doubled within the last hour
max_over_time(rate(requests_total[5m])[1h:])
/
min_over_time(rate(requests_total[5m])[1h:]) > 2

# Count how many minutes in the last hour traffic exceeded 1000 rps
sum_over_time(
  (rate(http_requests_total[5m]) > 1000)[1h:1m]
)
```

## Offset Modifier

`offset` compares the current result with an earlier point in time.

```promql
# Difference from the same query one week ago
rate(http_requests_total[5m])
-
rate(http_requests_total[5m] offset 1w)

# Percentage change from the same time yesterday
(
  rate(http_requests_total[5m])
  -
  rate(http_requests_total[5m] offset 1d)
)
/
rate(http_requests_total[5m] offset 1d) * 100

# Error-rate change by service
sum by (service) (rate(errors_total[5m]))
-
sum by (service) (rate(errors_total[5m] offset 1d))
```

Use `offset` for trend comparison, not for long-term forecasting.

## `@` Modifier

`@` evaluates the selector at a specific timestamp instead of “now”.

```promql
# Value at the end of the query range
rate(http_requests_total[5m] @ end())

# Compare query start vs query end
rate(http_requests_total[5m] @ end())
-
rate(http_requests_total[5m] @ start())

# Fixed historical point
rate(http_requests_total[5m] @ 1704067200)
```

`@` is most useful in dashboards or range queries where a stable reference point
matters.

## Binary Operators and Vector Matching

Most advanced PromQL failures come from mismatched labels. Explicit vector
matching makes the intent visible.

### One-to-One Matching

```promql
# Exact label match
metric_a + metric_b

# Only these labels must match
metric_a + on (job, instance) metric_b

# Match on every label except instance
metric_a + ignoring (instance) metric_b
```

### Many-to-One with `group_left`

```promql
# Attach version metadata to request-rate series
rate(http_requests_total[5m])
* on (job, instance) group_left (version)
  app_version_info

# Add owner metadata to pod CPU series
sum by (pod) (rate(container_cpu_usage_seconds_total[5m]))
* on (pod) group_left (owner_kind, owner_name)
  kube_pod_owner
```

### One-to-Many with `group_right`

```promql
config_multiplier
* on (job) group_right ()
  rate(http_requests_total[5m])
```

### Ratio Pattern

```promql
sum by (job) (rate(errors_total[5m]))
/
sum by (job) (rate(requests_total[5m]))
```

Keep label sets aligned before building ratios. If numerator and denominator do
not aggregate the same way, the result usually lies.

## Logical Operators

Logical operators are useful when a query should return only the series that
meet a condition.

```promql
# Return only services above 5% error rate
(
  sum by (service) (rate(errors_total[5m]))
  /
  sum by (service) (rate(requests_total[5m]))
) > 0.05

# Return active instances only
rate(http_requests_total[5m])
and on (instance)
  up == 1

# Return services with traffic but no errors
sum by (service) (rate(requests_total[5m])) > 0
unless
sum by (service) (rate(errors_total[5m])) > 0
```

Use `bool` only when you explicitly need `0` or `1` as the result.

## Label Manipulation and Aggregation

Use label helpers sparingly. They are powerful, but they can also hide a bad
metric model.

```promql
# Extract method from a compound label
label_replace(
  http_requests_total,
  "method",
  "$1",
  "route",
  "^(GET|POST|PUT|DELETE).*"
)

# Aggregate without one noisy label
sum without (instance) (rate(http_requests_total[5m]))

# Aggregate into service-level traffic
sum by (service) (rate(http_requests_total[5m]))
```

## Rules

- Reach for subqueries when you need time-on-time analysis, not for routine
  single-window rates.
- Use `offset` for historical comparison, not as a substitute for recording
  rules.
- Make vector matching explicit any time label cardinality differs.
- Prefer fixing metric shape over relying on heavy label manipulation.
