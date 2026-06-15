# PromQL Time, Histogram, and Experimental Functions

This reference covers the functions that are powerful but less routine:
timestamp extraction, histogram helpers, label manipulation, and experimental
Prometheus features.

## Time Functions

```promql
time()
timestamp(up)
year(vector(time()))
month(vector(time()))
day_of_week(vector(time()))
hour(vector(time()))
minute(vector(time()))
days_in_month(vector(time()))
```

Use these when query logic genuinely depends on time metadata, not as a default
part of ordinary service dashboards.

## Histogram Functions

Classic histograms:

```promql
histogram_quantile(
  0.95,
  sum by (le) (rate(http_request_duration_seconds_bucket[5m]))
)

rate(http_request_duration_seconds_sum[5m])
/
rate(http_request_duration_seconds_count[5m])
```

Native histogram helpers:

```promql
histogram_count(rate(http_request_duration_seconds[5m]))
histogram_sum(rate(http_request_duration_seconds[5m]))
histogram_fraction(0, 0.5, rate(http_request_duration_seconds[5m]))
histogram_avg(rate(http_request_duration_seconds[5m]))
```

Rules:

- Keep classic and native histogram guidance separate in your reasoning.
- Aggregate buckets correctly before quantiles.

## Label Manipulation

```promql
label_replace(metric, "service", "$1", "job", "^(.*)-api$")
label_join(metric, "target", "/", "namespace", "pod")
```

Use label helpers as a last-mile repair, not as a substitute for good metric
design.

## Experimental Functions

Examples include:

```promql
ts_of_max_over_time(metric[1h])
ts_of_min_over_time(metric[1h])
ts_of_last_over_time(metric[1h])
first_over_time(metric[5m])
mad_over_time(metric[1h])
sort_by_label(metric, "service")
```

These require version awareness. Do not present them as baseline PromQL unless
the Prometheus version is known and the feature is enabled where necessary.

## Rules

- Verify Prometheus version before recommending experimental helpers.
- Prefer clear stable functions over clever feature-specific tricks.
- If a label transform is needed often, fix the instrumentation or add a
  recording rule.
