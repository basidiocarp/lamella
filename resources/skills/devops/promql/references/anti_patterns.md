# PromQL Anti-Patterns

These mistakes make Prometheus slower, noisier, or simply wrong.

## High Cardinality Mistakes

Bad:

```promql
http_requests_total
http_requests_total{}
http_requests_total{user_id="12345"}
```

Better:

```promql
http_requests_total{job="api-service", environment="production"}
```

Avoid querying on labels like:
- user IDs
- request IDs
- trace IDs
- raw URLs

## Wrong Function for Metric Type

### Missing `rate()` on Counters

Bad:

```promql
http_requests_total{job="api"}
sum(http_requests_total)
```

Better:

```promql
rate(http_requests_total{job="api"}[5m])
increase(http_requests_total{job="api"}[1h])
```

### Using `rate()` on Gauges

Bad:

```promql
rate(node_memory_usage_bytes[5m])
```

Better:

```promql
node_memory_usage_bytes
delta(cpu_temperature_celsius[5m])
```

## Performance Anti-Patterns

### Huge Subqueries

Bad:

```promql
max_over_time(rate(http_requests_total[5m])[95d:1m])
```

Prefer:
- shorter windows
- recording rules for repeated expensive expressions

### Regex When Exact Match Works

Bad:

```promql
http_requests_total{status=~"200"}
http_requests_total{job=~"api-service"}
```

Better:

```promql
http_requests_total{status="200"}
http_requests_total{job="api-service"}
```

Use regex only when you truly need pattern matching or alternatives.

### Filtering After Aggregation

Bad:

```promql
sum(rate(http_requests_total[5m])) and {job="api"}
```

Better:

```promql
sum(rate(http_requests_total{job="api"}[5m]))
```

Filter early so Prometheus processes fewer time series.

## Practical Review Checklist

```text
Did the query narrow the label set enough?
Is the metric type matched to the right function?
Could exact match replace regex?
Should a recording rule replace this repeated complex query?
Is filtering happening before aggregation?
```
