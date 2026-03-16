# SLO, Error Budget, and Burn Rate Patterns

Service Level Objectives (SLOs) are critical for modern SRE practices. This reference covers SLO-based monitoring and alerting patterns.

---

## Table of Contents

1. [Error Budget Fundamentals](#error-budget-fundamentals)
2. [Burn Rate Calculation](#burn-rate-calculation)
3. [Multi-Window Multi-Burn-Rate Alerts](#multi-window-multi-burn-rate-alerts)
4. [SLO Recording Rules](#slo-recording-rules)
5. [Latency SLO Queries](#latency-slo-queries)
6. [Burn Rate Reference Table](#burn-rate-reference-table)
7. [Complete SLO Implementation Example](#complete-slo-implementation-example)

---

## Error Budget Fundamentals

### What is Error Budget?

Error budget = The allowed amount of unreliability within your SLO.

- **99.9% SLO** → 0.1% error budget (43.2 minutes/month downtime allowed)
- **99.5% SLO** → 0.5% error budget (3.6 hours/month downtime allowed)
- **99% SLO** → 1% error budget (7.2 hours/month downtime allowed)

### Error Budget Remaining Query

```promql
# Error budget remaining (for 99.9% SLO over 30 days)
# Returns value between 0 and 1 (1 = full budget, 0 = exhausted)
1 - (
  sum(rate(http_requests_total{job="api", status_code=~"5.."}[30d]))
  /
  sum(rate(http_requests_total{job="api"}[30d]))
) / 0.001  # 0.001 = 1 - 0.999 (allowed error rate)

# Simplified: Availability over 30 days
sum(rate(http_requests_total{job="api", status_code!~"5.."}[30d]))
/
sum(rate(http_requests_total{job="api"}[30d]))
```

### Error Budget Calculation by SLO Target

| SLO | Allowed Error Rate | Monthly Budget | Daily Budget |
|-----|-------------------|----------------|--------------|
| 99.99% | 0.01% | 4.32 min | 8.6 sec |
| 99.9% | 0.1% | 43.2 min | 1.44 min |
| 99.5% | 0.5% | 3.6 hours | 7.2 min |
| 99% | 1% | 7.2 hours | 14.4 min |

---

## Burn Rate Calculation

Burn rate measures how fast you're consuming error budget. A burn rate of 1 means you'll exhaust the budget exactly at the end of the SLO window.

### Basic Burn Rate Query

```promql
# Current burn rate (1 hour window, 99.9% SLO)
# Burn rate = (current error rate) / (allowed error rate)
(
  sum(rate(http_requests_total{job="api", status_code=~"5.."}[1h]))
  /
  sum(rate(http_requests_total{job="api"}[1h]))
) / 0.001  # 0.001 = allowed error rate for 99.9% SLO
```

### Burn Rate Interpretation

| Burn Rate | Meaning |
|-----------|---------|
| 1 | Consuming budget exactly as planned |
| < 1 | Under budget (good) |
| > 1 | Over budget (concerning) |
| 14.4 | Consuming 2% of monthly budget per hour |
| 36 | Consuming 5% of monthly budget per hour |

### Burn Rate Over Different Windows

```promql
# Short window burn rate (fast detection, noisy)
(
  sum(rate(http_requests_total{job="api", status_code=~"5.."}[5m]))
  /
  sum(rate(http_requests_total{job="api"}[5m]))
// ... (12 lines trimmed)
  /
  sum(rate(http_requests_total{job="api"}[6h]))
) / 0.001
```

---

## Multi-Window Multi-Burn-Rate Alerts

The recommended approach for SLO alerting uses multiple windows to balance detection speed and precision. This pattern is documented in Google's SRE book.

### Page-Level Alert (2% Budget in 1 Hour)

```promql
# Burn rate 14.4: Long window (1h) AND short window (5m) must both exceed threshold
(
  (
    sum(rate(http_requests_total{job="api", status_code=~"5.."}[1h]))
    /
// ... (8 lines trimmed)
    sum(rate(http_requests_total{job="api"}[5m]))
  ) > 14.4 * 0.001
)
```

### Ticket-Level Alert (5% Budget in 6 Hours)

```promql
# Burn rate 6: Long window (6h) AND short window (30m)
(
  (
    sum(rate(http_requests_total{job="api", status_code=~"5.."}[6h]))
    /
// ... (8 lines trimmed)
    sum(rate(http_requests_total{job="api"}[30m]))
  ) > 6 * 0.001
)
```

### Complete Multi-Window Alert Configuration

```yaml
groups:
  - name: slo_alerts
    rules:
      # Page: 2% budget consumed in 1 hour (burn rate 14.4)
      - alert: SLOBudgetBurn_Page
// ... (34 lines trimmed)
        annotations:
          summary: "Elevated error budget burn rate"
          description: "Consuming error budget at 6x normal rate"
```

---

## SLO Recording Rules

Pre-compute SLO metrics for efficient alerting:

```yaml
groups:
  - name: slo_recording_rules
    interval: 30s
    rules:
      # Error ratio over different windows
// ... (24 lines trimmed)
      - record: job:slo_burn_rate:ratio_rate1h
        expr: |
          job:slo_errors_per_request:ratio_rate1h / 0.001
```

### Using Recording Rules in Alerts

```yaml
# Simplified alert using pre-computed metrics
- alert: SLOBudgetBurn
  expr: |
    job:slo_burn_rate:ratio_rate1h{job="api"} > 14.4
    and
    (job:slo_errors_per_request:ratio_rate5m{job="api"} / 0.001) > 14.4
```

---

## Latency SLO Queries

### Percentage Meeting Latency Target

```promql
# Percentage of requests faster than SLO target (200ms)
(
  sum(rate(http_request_duration_seconds_bucket{le="0.2", job="api"}[5m]))
  /
  sum(rate(http_request_duration_seconds_count{job="api"}[5m]))
) * 100
```

### Requests Violating Latency SLO

```promql
# Fraction of requests slower than 500ms
(
  sum(rate(http_request_duration_seconds_count{job="api"}[5m]))
  -
  sum(rate(http_request_duration_seconds_bucket{le="0.5", job="api"}[5m]))
)
/
sum(rate(http_request_duration_seconds_count{job="api"}[5m]))
```

### Latency SLO with Native Histograms

```promql
# Fraction faster than 200ms (native histogram)
histogram_fraction(0, 0.2, rate(http_request_duration_seconds[5m]))

# Fraction violating SLO (slower than 500ms)
1 - histogram_fraction(0, 0.5, rate(http_request_duration_seconds[5m]))
```

---

## Burn Rate Reference Table

Standard burn rates for 30-day SLO windows:

| Burn Rate | Budget Consumed | Time to Exhaust 30-day Budget | Alert Severity | Detection Time |
|-----------|-----------------|-------------------------------|----------------|----------------|
| 1 | 100% over 30d | 30 days | None | - |
| 2 | 100% over 15d | 15 days | Low | Days |
| 6 | 5% in 6h | 5 days | Ticket | Hours |
| 14.4 | 2% in 1h | ~2 days | Page | Minutes |
| 36 | 5% in 1h | ~20 hours | Page (urgent) | Minutes |

### Window Pairs for Multi-Burn-Rate Alerts

| Alert Type | Burn Rate | Long Window | Short Window | Budget Consumed |
|------------|-----------|-------------|--------------|-----------------|
| Page | 14.4 | 1h | 5m | 2% in 1h |
| Page | 6 | 6h | 30m | 5% in 6h |
| Ticket | 3 | 24h | 2h | 10% in 24h |
| Ticket | 1 | 3d | 6h | 10% in 3d |

---

## Complete SLO Implementation Example

### Recording Rules

```yaml
groups:
  - name: api_slo
    interval: 30s
    rules:
      # Total requests (for denominator)
// ... (15 lines trimmed)
        expr: sum by (job) (rate(http_requests_total{status_code=~"5.."}[1h]))
      - record: job:http_requests:error_ratio_rate1h
        expr: job:http_requests_errors:rate1h / job:http_requests:rate1h
```

### Alerting Rules

```yaml
groups:
  - name: api_slo_alerts
    rules:
      - alert: APIHighBurnRate
        expr: |
          (job:http_requests:error_ratio_rate1h{job="api"} / 0.001) > 14.4
          and
          (job:http_requests:error_ratio_rate5m{job="api"} / 0.001) > 14.4
        for: 2m
        labels:
          severity: critical
          slo: availability
        annotations:
          summary: "API error budget burning too fast"
          runbook_url: "https://runbooks.example.com/slo-burn-rate"
```

### Dashboard Queries

```promql
# Error budget remaining (percentage)
(1 - (job:http_requests:error_ratio_rate30d{job="api"} / 0.001)) * 100

# Current burn rate
job:http_requests:error_ratio_rate1h{job="api"} / 0.001

# SLO compliance (percentage)
(1 - job:http_requests:error_ratio_rate30d{job="api"}) * 100
```
