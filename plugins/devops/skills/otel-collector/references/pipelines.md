# Pipelines

The `service` section wires components together. A pipeline is a named signal path from receiver(s) through processor(s) to exporter(s).

## Rules

- One pipeline per signal type (`traces`, `metrics`, `logs`).
- Every component declared in the top-level `receivers`, `processors`, `exporters` blocks must appear in at least one pipeline. Unused components cause a startup error.
- Pipelines can share receivers but should not share processors if ordering requirements differ between signals.

## Service Section Structure

```yaml
service:
  extensions: [health_check, pprof, zpages]
  pipelines:
    traces:
      receivers: [otlp]
      processors: [memory_limiter, resourcedetection, batch]
      exporters: [otlp]
    metrics:
      receivers: [otlp, prometheus]
      processors: [memory_limiter, resourcedetection, batch]
      exporters: [otlp]
    logs:
      receivers: [otlp, filelog]
      processors: [memory_limiter, resourcedetection, batch]
      exporters: [otlp]
  telemetry:
    logs:
      level: warn
    metrics:
      level: basic
      address: 0.0.0.0:8888
```

## Extensions

Declare extensions in the top-level `extensions` block and list them in `service.extensions`.

```yaml
extensions:
  health_check:
    endpoint: 0.0.0.0:13133
  pprof:
    endpoint: 0.0.0.0:1777
  zpages:
    endpoint: 0.0.0.0:55679
```

`health_check` is recommended for Kubernetes liveness/readiness probes.

## Connectors

Connectors link two pipelines. The output of pipeline A becomes the input of pipeline B. Use them to derive metrics from traces (span metrics) without a separate scrape.

```yaml
connectors:
  spanmetrics:
    histogram:
      explicit:
        buckets: [2ms, 4ms, 6ms, 10ms, 100ms, 250ms]
    dimensions:
      - name: http.method
      - name: http.status_code

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [memory_limiter, batch]
      exporters: [otlp, spanmetrics]   # spanmetrics is both an exporter here...
    metrics:
      receivers: [spanmetrics]          # ...and a receiver here
      processors: [memory_limiter, batch]
      exporters: [otlp]
```

## Complete Working Config

```yaml
extensions:
  health_check:
    endpoint: 0.0.0.0:13133

receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

processors:
  memory_limiter:
    check_interval: 1s
    limit_mib: 512
    spike_limit_mib: 128
  resourcedetection:
    detectors: [env, system]
    timeout: 5s
  batch:
    send_batch_size: 1000
    timeout: 5s

exporters:
  otlp:
    endpoint: <OTLP_ENDPOINT>
    headers:
      Authorization: "Bearer ${env:AUTH_TOKEN}"
    compression: gzip
    retry_on_failure:
      enabled: true
    sending_queue:
      enabled: true

service:
  extensions: [health_check]
  pipelines:
    traces:
      receivers: [otlp]
      processors: [memory_limiter, resourcedetection, batch]
      exporters: [otlp]
    metrics:
      receivers: [otlp]
      processors: [memory_limiter, resourcedetection, batch]
      exporters: [otlp]
    logs:
      receivers: [otlp]
      processors: [memory_limiter, resourcedetection, batch]
      exporters: [otlp]
  telemetry:
    logs:
      level: warn
    metrics:
      level: basic
      address: 0.0.0.0:8888
```

## Internal Telemetry

The collector exposes its own metrics on port `8888` (Prometheus format) and logs to stderr. Use `telemetry.logs.level: warn` in production to reduce noise. Use `telemetry.metrics.level: detailed` when debugging collector performance.
