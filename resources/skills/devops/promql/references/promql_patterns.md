# PromQL Query Patterns

Use these patterns as the starting point for common monitoring questions.

## RED Method

For request-driven services, focus on:
- rate
- errors
- duration

### Request Rate

```promql
sum(rate(http_requests_total{job="api-server"}[5m]))
sum by (endpoint) (rate(http_requests_total{job="api-server"}[5m]))
```

### Error Ratio

```promql
sum(rate(http_requests_total{job="api-server", status_code=~"5.."}[5m]))
/
sum(rate(http_requests_total{job="api-server"}[5m]))
```

### Latency Percentiles

```promql
histogram_quantile(
  0.95,
  sum by (le) (rate(http_request_duration_seconds_bucket{job="api-server"}[5m]))
)
```

## USE Method

For resources, focus on:
- utilization
- saturation
- errors

### Utilization

```promql
(1 - avg(rate(node_cpu_seconds_total{mode="idle"}[5m]))) * 100
```

### Saturation

```promql
node_load1 / count without (cpu, mode) (node_cpu_seconds_total{mode="idle"})
```

### Resource Errors

```promql
rate(node_network_receive_errs_total[5m])
rate(node_vmstat_oom_kill[5m])
```

## Request and Error Patterns

```promql
sum(increase(http_requests_total[1h]))
topk(10, sum by (endpoint) (rate(http_requests_total[5m])))
sum(rate(errors_total[5m])) / sum(rate(requests_total[5m]))
```

Use:
- `increase()` for totals over a period
- `rate()` for current throughput
- `topk()` for the hottest endpoints or error sources

## Latency and SLO Patterns

Average latency:

```promql
sum(rate(request_duration_seconds_sum[5m]))
/
sum(rate(request_duration_seconds_count[5m]))
```

SLO compliance:

```promql
sum(rate(request_duration_seconds_bucket{le="0.2"}[5m]))
/
sum(rate(request_duration_seconds_count[5m]))
```

## Default Querying Rules

```text
Use rate/increase for counters
Prefer histogram_quantile for percentile latency
Aggregate after filtering, not before
Keep label sets deliberate so dashboards stay fast
```
