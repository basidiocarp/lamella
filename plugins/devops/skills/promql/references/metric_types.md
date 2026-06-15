# Prometheus Metric Types

Use this file as the routing layer for Prometheus metric shape decisions.

## Load Order

| Need | Reference |
| --- | --- |
| Counters, gauges, and the functions that usually pair with them | `counter-and-gauge.md` |
| Histograms, summaries, percentiles, and latency-oriented query patterns | `histogram-and-summary.md` |

## Core Rules

- Pick the metric type before writing the query.
- Use counters for totals, gauges for current state, histograms for
  aggregatable distributions, and summaries only when client-side quantiles are
  acceptable.
- Fix bad instrumentation before adding clever PromQL around it.

## Quick Checks

- If you need `rate`, you probably want a counter.
- If the value can go up and down, you probably want a gauge.
- If you need fleet-level percentiles, prefer histograms over summaries.
