# Prometheus Counters and Gauges

This reference covers the two simplest Prometheus metric types and the query
patterns they usually need.

## Counter

Counters represent totals since process start. They only increase, except when
the process restarts and the value resets.

```promql
http_requests_total
errors_total
db_queries_total{operation="select"}
```

### Functions That Belong with Counters

```promql
# Requests per second
rate(http_requests_total[5m])

# Instantaneous spike-sensitive rate
irate(http_requests_total[5m])

# Total requests during the last hour
increase(http_requests_total[1h])
```

Rules:

- Counter names should usually end in `_total`.
- Use `rate` for dashboards and SLO math.
- Use `increase` for “how many happened in this window?”

## Gauge

Gauges represent current state and can move in either direction.

```promql
memory_usage_bytes
queue_depth{service="worker"}
disk_available_bytes
```

### Functions That Belong with Gauges

```promql
# Average memory over 5m
avg_over_time(memory_usage_bytes[5m])

# Maximum queue depth over 1h
max_over_time(queue_depth[1h])

# Rate of change in queue depth
deriv(queue_depth[10m])
```

Rules:

- Include units where practical, such as `_bytes` or `_seconds`.
- Use `_over_time` helpers for trend analysis.
- Avoid `rate` on gauges unless the metric is actually mis-instrumented.

## Choosing Between Them

- Counter: “how many events have happened?”
- Gauge: “what is the current level right now?”

If the metric is accumulating events, it is a counter. If it is describing
state, it is a gauge.
