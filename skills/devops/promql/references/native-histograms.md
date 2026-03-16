# Native Histograms (Prometheus 3.x+)

Native histograms are now **stable** in Prometheus 3.0+ (released November 2024). They offer significant advantages over classic histograms:
- Sparse bucket representation with near-zero cost for empty buckets
- No configuration of bucket boundaries during instrumentation
- Coverage of the full float64 range
- Efficient mergeability across histograms
- Simpler query syntax

> **Important**: Starting with Prometheus v3.8.0, native histograms are fully stable. However, scraping native histograms still requires explicit activation via the `scrape_native_histograms` configuration setting. Starting with v3.9, no feature flag is needed but `scrape_native_histograms` must be set explicitly.

---

## Table of Contents

1. [Native vs Classic Histogram Syntax](#native-vs-classic-histogram-syntax)
2. [Native Histogram Functions](#native-histogram-functions)
3. [Detecting Native vs Classic Histograms](#detecting-native-vs-classic-histograms)
4. [Custom Bucket Native Histograms (NHCB)](#custom-bucket-native-histograms-nhcb)
5. [Migration Strategies](#migration-strategies)

---

## Native vs Classic Histogram Syntax

```promql
# Classic histogram (requires _bucket suffix and le label)
histogram_quantile(0.95,
  sum by (job, le) (rate(http_request_duration_seconds_bucket[5m]))
)

# Native histogram (simpler - no _bucket suffix, no le label needed)
histogram_quantile(0.95,
  sum by (job) (rate(http_request_duration_seconds[5m]))
)
```

### Key Differences

| Aspect | Classic Histogram | Native Histogram |
|--------|-------------------|------------------|
| Metric suffix | `_bucket`, `_sum`, `_count` | None (single metric) |
| Label for buckets | `le` (less-than-or-equal) | None |
| Bucket configuration | At instrumentation time | Auto-configured |
| Query complexity | More complex | Simpler |
| Storage efficiency | Multiple series | Single series |
| Mergeability | Need matching buckets | Always mergeable |

---

## Native Histogram Functions

### histogram_count() - Get Observation Count

```promql
# Get observation count rate from native histogram
histogram_count(rate(http_request_duration_seconds[5m]))

# Total observations per minute
histogram_count(rate(http_request_duration_seconds[5m])) * 60
```

### histogram_sum() - Get Sum of Observations

```promql
# Get sum of observations from native histogram
histogram_sum(rate(http_request_duration_seconds[5m]))

# Average request duration from native histogram
histogram_sum(rate(http_request_duration_seconds[5m]))
/
histogram_count(rate(http_request_duration_seconds[5m]))
```

### histogram_fraction() - Fraction Between Values

```promql
# Calculate fraction of observations between two values
histogram_fraction(0, 0.1, rate(http_request_duration_seconds[5m]))

# Fraction slower than 500ms
1 - histogram_fraction(0, 0.5, rate(http_request_duration_seconds[5m]))

# Fraction between 100ms and 500ms
histogram_fraction(0.1, 0.5, rate(http_request_duration_seconds[5m]))
```

### histogram_quantile() - Calculate Percentiles

```promql
# 95th percentile (native histogram)
histogram_quantile(0.95,
  sum by (job) (rate(http_request_duration_seconds[5m]))
)

# Multiple percentiles
histogram_quantile(0.50, sum by (job) (rate(http_request_duration_seconds[5m])))  # Median
histogram_quantile(0.90, sum by (job) (rate(http_request_duration_seconds[5m])))  # P90
histogram_quantile(0.99, sum by (job) (rate(http_request_duration_seconds[5m])))  # P99
```

---

## Detecting Native vs Classic Histograms

Native histograms are identified by:
- **No `_bucket` suffix** on the metric name
- **No `le` label** in the time series
- The metric stores histogram data directly (not separate bucket counters)

### Check Prometheus Configuration

```yaml
# prometheus.yml - Enable native histogram scraping
scrape_configs:
  - job_name: 'my-app'
    scrape_native_histogram: true  # Prometheus 3.x+
```

### Query to Check Available Histograms

```promql
# Check if metric has _bucket suffix (classic)
{__name__=~".*_bucket"}

# Check for le label presence (classic)
http_request_duration_seconds_bucket{le=~".+"}
```

---

## Custom Bucket Native Histograms (NHCB)

Prometheus 3.4+ supports custom bucket native histograms (schema -53), allowing classic histogram to native histogram conversion. This is a key migration path for users with existing classic histograms.

### Benefits of NHCB

- Keep existing instrumentation (no code changes needed)
- Store classic histograms as native histograms for lower costs
- Query with native histogram syntax
- Improved reliability and compression

### Configuration (Prometheus 3.4+)

```yaml
# prometheus.yml - Convert classic histograms to NHCB on scrape
global:
  scrape_configs:
    - job_name: 'my-app'
      convert_classic_histograms_to_nhcb: true  # Prometheus 3.4+
```

### Querying NHCB

```promql
# Query NHCB metrics the same way as native histograms
histogram_quantile(0.95, sum by (job) (rate(http_request_duration_seconds[5m])))

# histogram_fraction also works with NHCB (Prometheus 3.4+)
histogram_fraction(0, 0.2, rate(http_request_duration_seconds[5m]))
```

**Note**: Schema -53 indicates custom bucket boundaries. These histograms with different custom bucket boundaries are generally not mergeable with each other.

---

## Migration Strategies

### Strategy 1: Dual Exposure (Recommended for Gradual Migration)

Expose both classic and native histograms during transition:

```yaml
# Application-side configuration
metrics:
  histogram:
    native_histogram_enabled: true
    classic_histogram_enabled: true  # Keep during migration
```

### Strategy 2: NHCB Conversion (No Application Changes)

Use Prometheus-side conversion for zero-downtime migration:

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'my-app'
    convert_classic_histograms_to_nhcb: true
```

### Strategy 3: Direct Native (New Applications)

For new applications, use native histograms directly:

```go
// Go example with prometheus/client_golang
histogram := prometheus.NewHistogram(prometheus.HistogramOpts{
    Name:                        "http_request_duration_seconds",
    Help:                        "Request duration",
    NativeHistogramBucketFactor: 1.1,  // Enables native histogram
})
```

### Verifying Migration

```promql
# Check native histogram is being used
histogram_count(http_request_duration_seconds) > 0

# Compare classic vs native (during dual exposure)
histogram_quantile(0.95, sum by (le) (rate(http_request_duration_seconds_bucket[5m])))
-
histogram_quantile(0.95, sum by () (rate(http_request_duration_seconds[5m])))
```
