# PromQL Best Practices from Validator Findings

This appendix captures the mistakes the validator catches most often. Use it as a quick fix guide, not a full PromQL handbook.

## Metric Type Checks

- counters need `rate()` or `increase()`
- gauges should not use `rate()`
- histogram quantiles need the right histogram shape
- summary quantiles should not be averaged

```promql
# Good
rate(http_requests_total[5m])

# Bad
http_requests_total
```

## Label and Aggregation Checks

- prefer exact label matches over regex when possible
- aggregate with an explicit `by()` or `without()`
- avoid high-cardinality labels in dashboards and alerts

```promql
sum by (job) (rate(http_requests_total{job="api"}[5m]))
```

## Range and Performance Checks

- keep `rate()` windows at least several scrape intervals wide
- avoid long expensive subqueries when a recording rule fits better
- use `topk` or recording rules for expensive repeated dashboards

```promql
# Better for long reuse
job:http_requests:rate5m
```

## Histogram and Native Histogram Checks

- classic histograms need the `_bucket` series and `le`
- native histograms do not use `_bucket` or `le`
- both still need `rate()` in most operational queries

## Alerting Checks

- keep alert expressions simple
- use `for` to reduce flapping
- move repeated complex logic into recording rules
