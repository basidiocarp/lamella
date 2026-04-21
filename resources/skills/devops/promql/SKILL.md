---
name: promql
description: "Generates, validates, lints, and optimizes PromQL queries, alerting rules, and recording rules."
origin: lamella
---

# PromQL

## Contents

- [When to Use](#when-to-use)
- [Query Generation Workflow](#query-generation-workflow)
- [Validation Workflow](#validation-workflow)
- [Quick Reference Patterns](#quick-reference-patterns)
- [Anti-Patterns](#anti-patterns)
- [Key Rules](#key-rules)
- [Reference Files](#reference-files)

## When to Use

**Generation:** Creating PromQL queries, building dashboards, implementing alerting rules, recording rules, RED/USE metrics, SLO tracking.

**Validation:** Checking syntax, detecting anti-patterns, optimizing expressions, debugging alerting rules.

## Query Generation Workflow

### Stage 1: Understand Goal

Gather requirements (ask if not provided):
1. **Goal:** Request rate, error rate, latency, resource usage, availability?
2. **Use case:** Dashboard, alerting rule, ad-hoc analysis, recording rule, SLO?
3. **Context:** Service name, environment, naming conventions?

### Stage 2: Identify Metrics

1. **Metric names:** Follow naming patterns
2. **Metric type:** Counter (`_total`), Gauge (no suffix), Histogram (`_bucket`), Summary
3. **Labels:** job, instance, environment, endpoint, status_code

See [references/metric_types.md](references/metric_types.md) for metric-shape guidance.

### Stage 3: Present Query Plan

Before generating, present a plain-English plan:

```
**Goal**: [description]
**Query Structure**: Start with metric → filter labels → apply function → aggregate
**Expected Output**: [what the number means]
```

### Stage 4: Generate

Consult relevant references before writing:
- Histogram queries → [references/metric_types.md](references/metric_types.md)
- RED/USE patterns → [references/promql_patterns.md](references/promql_patterns.md)
- Optimization → [references/best_practices.md](references/best_practices.md)
- Functions → [references/aggregation-and-rate-functions.md](references/aggregation-and-rate-functions.md) or [references/time-and-experimental-functions.md](references/time-and-experimental-functions.md)
- SLO/burn rate → [references/slo-burn-rate.md](references/slo-burn-rate.md)
- Native histograms → [references/native-histograms.md](references/native-histograms.md)

### Stage 5: Validate

Run validation scripts:

```bash
python3 scripts/validate_syntax.py "<query>"
python3 scripts/check_best_practices.py "<query>"
```

### Stage 6: Deliver

Include: final query, explanation, usage instructions (dashboard/alert/recording rule syntax), and customization notes.

## Validation Workflow

### Step 1: Syntax Check

```bash
python3 scripts/validate_syntax.py "<query>"
```
Exit 0 = valid. Non-zero = failure with position info.

### Step 2: Best Practices Check

```bash
python3 scripts/check_best_practices.py "<query>"
```
Detects: cardinality issues, metric type misuse, regex misuse, missing rate(), averaging quantiles.

### Step 3: Explain the Query

Parse and explain in plain English:
- Metrics queried and their types
- Functions applied and why
- Output labels and result structure

### Step 4: Intent Verification

Ask clarifying questions:
1. What are you trying to measure?
2. Is this counter/gauge/histogram/summary?
3. What time range?
4. Aggregation needs?
5. Alerting, dashboarding, or analysis?

**⏸️ Wait for user response before proceeding to optimization.**

### Step 5: Optimize

Suggest improvements based on intent: efficient patterns, recording rules for complex/repeated queries, better label matchers, appropriate time ranges.

## Quick Reference Patterns

**Request Rate:**
```promql
sum(rate(http_requests_total{job="api"}[5m]))
```

**Error Rate (%):**
```promql
sum(rate(http_requests_total{status_code=~"5.."}[5m]))
/ sum(rate(http_requests_total[5m])) * 100
```

**P95 Latency:**
```promql
histogram_quantile(0.95,
  sum by (le) (rate(http_request_duration_seconds_bucket[5m])))
```

**Availability:**
```promql
(count(up{job="api"} == 1) / count(up{job="api"})) * 100
```

**Alerting Rule:**
```yaml
alert: HighErrorRate
expr: |
  sum(rate(http_requests_total{status_code=~"5.."}[5m]))
  / sum(rate(http_requests_total[5m])) > 0.05
for: 10m
labels:
  severity: warning
```

**Recording Rule:**
```yaml
- record: job:http_requests:rate5m
  expr: sum by (job) (rate(http_requests_total[5m]))
```

## Anti-Patterns

| Anti-Pattern | Bad | Good |
|-------------|-----|------|
| No label filters | `http_requests_total{}` | `http_requests_total{job="api"}` |
| Regex overuse | `{status=~"2.."}` | `{status="200"}` |
| Raw counter | `http_requests_total` | `rate(http_requests_total[5m])` |
| rate() on gauge | `rate(memory_usage_bytes[5m])` | `memory_usage_bytes` or `avg_over_time()` |
| Averaging quantiles | `avg(metric{quantile="0.95"})` | `histogram_quantile(0.95, sum by (le) (rate(...)))` |
| Excessive subquery | `rate(m[5m])[90d:1m]` | Use recording rules |
| irate() long range | `irate(m[1h])` | `rate(m[1h])` or `irate(m[5m])` |

## Key Rules

### Syntax
- Metric names: `[a-zA-Z_:][a-zA-Z0-9_:]*` or quoted (Prometheus 3.0+)
- Label matchers: `=`, `!=`, `=~`, `!~`
- Time durations: `[0-9]+(ms|s|m|h|d|w|y)`

### Semantic
- `rate()`/`irate()`: only on counters (_total, _count, _sum, _bucket)
- Counters: always use `rate()` or `increase()`, not raw
- Gauges: no `rate()`, use directly or `avg_over_time()`
- Histograms: `histogram_quantile()` with `le` label
- Summaries: don't average quantiles; use _sum/_count

### Performance
- Always use specific label matchers
- Rate range ≥ 4x scrape interval (typically [2m] minimum)
- Use recording rules for complex repeated queries

## Reference Files

### Core References
| File | Purpose |
|------|---------|
| [references/promql_functions.md](references/promql_functions.md) | Function routing guide |
| [references/aggregation-and-rate-functions.md](references/aggregation-and-rate-functions.md) | Aggregation, rate, and range-vector helpers |
| [references/time-and-experimental-functions.md](references/time-and-experimental-functions.md) | Time, histogram, label, and experimental functions |
| [references/promql_patterns.md](references/promql_patterns.md) | RED, USE, alerting patterns |
| [references/best_practices.md](references/best_practices.md) | Optimization, anti-patterns |
| [references/metric_types.md](references/metric_types.md) | Counter, Gauge, Histogram, Summary |

### Specialized References
| File | Purpose |
|------|---------|
| [references/native-histograms.md](references/native-histograms.md) | Prometheus 3.x+ native histograms |
| [references/slo-burn-rate.md](references/slo-burn-rate.md) | SLO, error budget, burn rate |
| [references/advanced-techniques.md](references/advanced-techniques.md) | Subqueries, offset, vector matching |

### Validation Docs
| File | Purpose |
|------|---------|
| [references/anti_patterns.md](references/anti_patterns.md) | Specific PromQL mistakes and unsafe patterns |
| [references/best_practices-from-promql-validator.md](references/best_practices-from-promql-validator.md) | Validator-driven appendix and findings |
| [scripts/test_validators.py](scripts/test_validators.py) | Validator test runner |
