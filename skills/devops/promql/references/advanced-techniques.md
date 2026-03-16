# Advanced PromQL Query Techniques

Advanced query patterns for complex monitoring scenarios.

---

## Table of Contents

1. [Subqueries](#subqueries)
2. [Offset Modifier](#offset-modifier)
3. [@ Modifier (Timestamp Selection)](#-modifier-timestamp-selection)
4. [Binary Operators and Vector Matching](#binary-operators-and-vector-matching)
5. [Logical Operators](#logical-operators)
6. [Label Manipulation](#label-manipulation)
7. [Aggregation Strategies](#aggregation-strategies)

---

## Subqueries

Subqueries enable complex time-based calculations by running a range query over another range query.

### Syntax

```
<instant_query>[<range>:<resolution>]
```

- `<range>`: Time window to evaluate over
- `<resolution>`: Step size between evaluations (optional, defaults to global eval interval)

### Examples

```promql
# Maximum 5-minute rate over the past 30 minutes
max_over_time(
  rate(http_requests_total[5m])[30m:1m]
)

// ... (12 lines trimmed)
    sum by (le) (rate(http_request_duration_seconds_bucket[5m]))
  )[6h:5m]
)
```

### Common Subquery Patterns

```promql
# Detect if metric doubled in the last hour
max_over_time(rate(requests_total[5m])[1h:])
/
min_over_time(rate(requests_total[5m])[1h:]) > 2
// ... (6 lines trimmed)
  (rate(http_requests_total[5m]) > 1000)[1h:1m]
)
```

---

## Offset Modifier

Compare current data with historical data.

### Basic Offset

```promql
# Compare current rate with rate from 1 week ago
rate(http_requests_total[5m])
-
rate(http_requests_total[5m] offset 1w)

// ... (14 lines trimmed)
)
/
rate(http_requests_total[5m] offset 7d) * 100
```

### Week-over-Week Comparison

```promql
# Request rate comparison (this week vs last week)
sum(rate(http_requests_total[5m])) / sum(rate(http_requests_total[5m] offset 1w))

# Only alert if significantly higher than last week
sum(rate(http_requests_total[5m])) > 1.5 * sum(rate(http_requests_total[5m] offset 1w))
```

### Offset with Aggregations

```promql
# Error rate change by service
sum by (service) (rate(errors_total[5m]))
-
sum by (service) (rate(errors_total[5m] offset 1d))
```

---

## @ Modifier (Timestamp Selection)

Query metrics at specific timestamps. Useful for point-in-time comparisons.

### Syntax

```promql
metric @ <timestamp>
metric @ start()   # Start of the range query
metric @ end()     # End of the range query
```

### Examples

```promql
# Rate at the end of the range query
rate(http_requests_total[5m] @ end())

# Rate at specific Unix timestamp
rate(http_requests_total[5m] @ 1609459200)

# Compare start vs end of query range
rate(http_requests_total[5m] @ end())
-
rate(http_requests_total[5m] @ start())
```

### Combining @ with Offset

```promql
# Value at a specific time, offset by duration
http_requests_total @ 1609459200 offset 1h
```

---

## Binary Operators and Vector Matching

Control how labels are matched when combining metrics.

### Vector Matching Modes

| Mode | Description |
|------|-------------|
| One-to-one | Default, labels must match exactly |
| Many-to-one | Match multiple series to one, use `group_left` |
| One-to-many | Match one series to multiple, use `group_right` |

### One-to-One (Default)

```promql
# Labels must match exactly
metric_a + metric_b

# Only specific labels must match
metric_a + on (job, instance) metric_b

# All labels except specific ones must match
metric_a + ignoring (instance) metric_b
```

### Many-to-One with group_left

```promql
# Enrich request rate with version info
rate(http_requests_total[5m])
* on (job, instance) group_left (version)
  app_version_info

# Add metadata labels from info metric
sum by (pod) (rate(container_cpu_usage_seconds_total[5m]))
* on (pod) group_left (owner_kind, owner_name)
  kube_pod_owner
```

### One-to-Many with group_right

```promql
# Apply single multiplier to multiple series
config_multiplier
* on (job) group_right ()
  rate(http_requests_total[5m])
```

### Common Patterns

```promql
# Calculate ratio with different cardinality
sum by (job) (rate(errors_total[5m]))
/
sum by (job) (rate(requests_total[5m]))
// ... (8 lines trimmed)
and on (instance)
  up == 1
```

---

## Logical Operators

Filter or combine time series based on conditions.

### Comparison Operators

```promql
# Return series only where value > 100
http_requests_total > 100

# Return series where value is between 50 and 100
http_requests_total > 50 and http_requests_total < 100

# Return 1 (true) or nothing (vs returning original value)
http_requests_total > bool 100
```

### Set Operations

```promql
# AND: Return series present in both
metric_a and metric_b

# OR: Return series present in either
metric_a or metric_b

# UNLESS: Return series in A but not in B
metric_a unless metric_b
```

### Filtering Examples

```promql
# Only show services with error rate > 5%
(
  sum by (service) (rate(errors_total[5m]))
  /
  sum by (service) (rate(requests_total[5m]))
// ... (8 lines trimmed)
sum by (service) (rate(requests_total[5m])) > 0
unless
sum by (service) (rate(errors_total[5m])) > 0
```

---

## Label Manipulation

### label_replace()

Add or modify labels based on regex extraction.

```promql
# Extract environment from instance name
label_replace(
  up{job="api"},
  "environment",
  "$1",
// ... (9 lines trimmed)
  "",
  ""
)
```

### label_join()

Concatenate label values into a new label.

```promql
# Create combined identifier
label_join(
  up,
  "identifier",
  "-",
  "job",
  "instance"
)
```

---

## Aggregation Strategies

### Without vs By

```promql
# Keep only these labels
sum by (job, service) (rate(http_requests_total[5m]))

# Keep all labels except these
sum without (instance, pod) (rate(http_requests_total[5m]))
```

### TopK and BottomK

```promql
# Top 5 services by request rate
topk(5, sum by (service) (rate(http_requests_total[5m])))

# Bottom 3 instances by availability
// ... (6 lines trimmed)
  sum by (job, endpoint) (rate(requests_total[5m]))
)
```

### Quantile Aggregation

```promql
# 95th percentile of values across series
quantile(0.95, rate(http_requests_total[5m]))

# Distribution of request rates
quantile(0.5, sum by (instance) (rate(http_requests_total[5m])))  # Median instance
quantile(0.9, sum by (instance) (rate(http_requests_total[5m])))  # P90 instance
```

### Count and Group

```promql
# Count number of series matching criteria
count(up{job="api"} == 1)

# Count by label value
count by (status_code) (rate(http_requests_total[5m]))

# Group without aggregating values (preserves all series)
group by (job) (http_requests_total)
```
