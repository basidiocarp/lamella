# Sampling

Sampling reduces telemetry volume. Choose head or tail sampling based on what information is available at decision time.

## Decision Table

| Factor | Head sampling | Tail sampling |
|--------|--------------|---------------|
| Decision point | Trace start | Trace complete |
| Keeps all errors | No (sampled before outcome known) | Yes |
| Infrastructure cost | Low | High (must buffer full trace) |
| Good for | High-volume, low-criticality traffic | SLO enforcement, error capture, latency outliers |
| Collector requirement | Any collector | Dedicated tail sampling gateway with load balancing |

## Head Sampling: probabilistic_sampler

Samples a fixed percentage of all traces at ingestion time.

```yaml
processors:
  probabilistic_sampler:
    sampling_percentage: 10   # keep 10% of all traces
```

Use this when you want simple volume reduction and can tolerate missing some errors.

## Tail Sampling: tail_sampling Processor

Evaluates policies after the full trace arrives. Keeps traces that match any policy.

```yaml
processors:
  tail_sampling:
    decision_wait: 10s          # wait up to 10s for all spans
    num_traces: 50000           # max traces buffered in memory
    expected_new_traces_per_sec: 100
    policies:
      # Keep all traces with an error
      - name: keep-errors
        type: status_code
        status_code: {status_codes: [ERROR]}

      # Keep slow traces (p99 > 1s)
      - name: keep-slow
        type: latency
        latency: {threshold_ms: 1000}

      # Keep 5% of healthy fast traces for baseline
      - name: baseline-sample
        type: probabilistic
        probabilistic: {sampling_percentage: 5}

      # Drop health check noise
      - name: drop-health
        type: ottl_condition
        ottl_condition:
          error_mode: ignore
          span: ['attributes["http.route"] == "/healthz"']
        decision: drop
```

Policy evaluation order: policies are evaluated in order and the first match wins. Put high-priority keeps (errors, slow) before catch-all drops.

## Tail Sampling Architecture

Tail sampling requires all spans for a trace to arrive at the same collector instance. Use a load-balancing gateway in front of your tail-sampling collectors.

```
SDK → load-balancing collector (routes by trace ID) → tail-sampling collector → backend
```

```yaml
# Load-balancing collector config (gateway tier)
exporters:
  loadbalancing:
    protocol:
      otlp:
        tls:
          insecure: true
    resolver:
      static:
        hostnames:
          - tail-sampler-0:4317
          - tail-sampler-1:4317
          - tail-sampler-2:4317
```

The `loadbalancing` exporter routes each trace ID to a consistent downstream collector so all spans for a trace land on the same instance.

## Sizing Tail Sampling Collectors

- `num_traces`: set to at least `(expected_new_traces_per_sec × decision_wait_seconds × 2)`.
- Memory: each buffered trace uses memory proportional to span count and attribute size. Start with 2 GiB and monitor `otelcol_processor_tail_sampling_sampling_decision_*` metrics.
- Scale horizontally behind the load-balancing gateway when a single instance cannot keep up.
