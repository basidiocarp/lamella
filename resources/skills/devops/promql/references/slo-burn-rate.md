# SLO, Error Budget, and Burn Rate Patterns

Use this reference when converting SLO targets into PromQL alerts and recording
rules. The goal is to make budget consumption obvious, not merely to graph error
rate.

## Error Budget Fundamentals

Error budget is the allowed unreliability implied by an SLO target.

| SLO | Allowed Error Rate | Monthly Budget |
| --- | --- | --- |
| 99.99% | 0.01% | 4.32 minutes |
| 99.9% | 0.1% | 43.2 minutes |
| 99.5% | 0.5% | 3.6 hours |
| 99% | 1% | 7.2 hours |

For a 99.9% availability SLO, the allowed error rate is `0.001`.

```promql
# Availability over the last 30 days
sum(rate(http_requests_total{job="api", status_code!~"5.."}[30d]))
/
sum(rate(http_requests_total{job="api"}[30d]))

# Error-budget remaining for a 99.9% SLO
1 - (
  (
    sum(rate(http_requests_total{job="api", status_code=~"5.."}[30d]))
    /
    sum(rate(http_requests_total{job="api"}[30d]))
  ) / 0.001
)
```

## Burn Rate

Burn rate expresses how quickly the current error rate consumes the allowed
budget.

```promql
# One-hour burn rate for a 99.9% SLO
(
  sum(rate(http_requests_total{job="api", status_code=~"5.."}[1h]))
  /
  sum(rate(http_requests_total{job="api"}[1h]))
) / 0.001
```

Interpretation:

| Burn Rate | Meaning |
| --- | --- |
| `< 1` | Under budget |
| `1` | Spending budget exactly as planned |
| `> 1` | Overspending budget |
| `14.4` | Burning 2% of a 30-day budget in 1 hour |
| `6` | Burning 5% of a 30-day budget in 6 hours |

### Different Windows

```promql
# Fast but noisy
(
  sum(rate(http_requests_total{job="api", status_code=~"5.."}[5m]))
  /
  sum(rate(http_requests_total{job="api"}[5m]))
) / 0.001

# Slower but steadier
(
  sum(rate(http_requests_total{job="api", status_code=~"5.."}[6h]))
  /
  sum(rate(http_requests_total{job="api"}[6h]))
) / 0.001
```

## Multi-Window Multi-Burn-Rate Alerts

Use a long window plus a short window so alerts are both fast and credible.

### Page-Level Alert

For “2% of 30-day budget in 1 hour”, use burn rate `14.4`.

```promql
(
  (
    sum(rate(http_requests_total{job="api", status_code=~"5.."}[1h]))
    /
    sum(rate(http_requests_total{job="api"}[1h]))
  ) > 14.4 * 0.001
)
and
(
  (
    sum(rate(http_requests_total{job="api", status_code=~"5.."}[5m]))
    /
    sum(rate(http_requests_total{job="api"}[5m]))
  ) > 14.4 * 0.001
)
```

### Ticket-Level Alert

For “5% of 30-day budget in 6 hours”, use burn rate `6`.

```promql
(
  (
    sum(rate(http_requests_total{job="api", status_code=~"5.."}[6h]))
    /
    sum(rate(http_requests_total{job="api"}[6h]))
  ) > 6 * 0.001
)
and
(
  (
    sum(rate(http_requests_total{job="api", status_code=~"5.."}[30m]))
    /
    sum(rate(http_requests_total{job="api"}[30m]))
  ) > 6 * 0.001
)
```

### Common Window Pairs

| Severity | Burn Rate | Long Window | Short Window |
| --- | --- | --- | --- |
| Page | 14.4 | 1h | 5m |
| Page | 6 | 6h | 30m |
| Ticket | 3 | 24h | 2h |
| Ticket | 1 | 3d | 6h |

## Recording Rules

Pre-compute the ratios you will alert on.

```yaml
groups:
  - name: slo_recording_rules
    interval: 30s
    rules:
      - record: job:slo_errors_per_request:ratio_rate5m
        expr: |
          sum by (job) (rate(http_requests_total{status_code=~"5.."}[5m]))
          /
          sum by (job) (rate(http_requests_total[5m]))

      - record: job:slo_errors_per_request:ratio_rate1h
        expr: |
          sum by (job) (rate(http_requests_total{status_code=~"5.."}[1h]))
          /
          sum by (job) (rate(http_requests_total[1h]))

      - record: job:slo_burn_rate:ratio_rate1h
        expr: |
          job:slo_errors_per_request:ratio_rate1h / 0.001
```

Then alert from the recording rules:

```yaml
- alert: SLOBudgetBurn
  expr: |
    job:slo_burn_rate:ratio_rate1h{job="api"} > 14.4
    and
    (job:slo_errors_per_request:ratio_rate5m{job="api"} / 0.001) > 14.4
```

## Latency SLO Patterns

### Classic Histogram Buckets

```promql
# Fraction of requests faster than 200ms
sum(rate(http_request_duration_seconds_bucket{job="api", le="0.2"}[5m]))
/
sum(rate(http_request_duration_seconds_count{job="api"}[5m]))

# Fraction of requests slower than 500ms
(
  sum(rate(http_request_duration_seconds_count{job="api"}[5m]))
  -
  sum(rate(http_request_duration_seconds_bucket{job="api", le="0.5"}[5m]))
)
/
sum(rate(http_request_duration_seconds_count{job="api"}[5m]))
```

### Native Histograms

```promql
histogram_fraction(0, 0.2, rate(http_request_duration_seconds[5m]))

1 - histogram_fraction(0, 0.5, rate(http_request_duration_seconds[5m]))
```

## Rules

- Always convert SLO targets into explicit allowed error rates before writing
  alerts.
- Use paired long and short windows; single-window burn alerts are too noisy.
- Prefer recording rules for repeated SLO math.
- Keep availability and latency SLO queries separate unless the service truly
  treats them as one objective.
