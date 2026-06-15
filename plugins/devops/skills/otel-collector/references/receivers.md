# Receivers

Receivers are the entry point for telemetry. Pick the receiver that matches your source.

## Receiver Selection

| Source | Receiver | Signal(s) |
|--------|----------|-----------|
| SDK-instrumented app (gRPC) | `otlp` (grpc) | traces, metrics, logs |
| SDK-instrumented app (HTTP) | `otlp` (http) | traces, metrics, logs |
| Prometheus-scraped endpoint | `prometheus` | metrics |
| Log files on disk | `filelog` | logs |
| Host CPU/memory/disk/network | `hostmetrics` | metrics |
| Kubernetes pod/node metrics | `kubeletstats` | metrics |
| Existing Jaeger agent | `jaeger` | traces |
| Existing Zipkin app | `zipkin` | traces |

## OTLP Receiver

The most common receiver. Accepts data from any OpenTelemetry SDK.

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318
        # Optional: CORS for browser SDKs
        cors:
          allowed_origins:
            - "https://*.example.com"
```

Use gRPC for server-side workloads. Use HTTP when you need browser or Lambda compatibility.

## Prometheus Receiver

Scrapes Prometheus-format endpoints. Supports the same `scrape_configs` shape as Prometheus itself.

```yaml
receivers:
  prometheus:
    config:
      scrape_configs:
        - job_name: my-service
          scrape_interval: 30s
          static_configs:
            - targets: ["localhost:9090"]
          # Optional relabeling
          metric_relabel_configs:
            - source_labels: [__name__]
              regex: "go_.*"
              action: drop
```

## Filelog Receiver

Tails log files and parses structured or unstructured lines.

```yaml
receivers:
  filelog:
    include:
      - /var/log/app/*.log
    start_at: end
    operators:
      - type: json_parser
        timestamp:
          parse_from: attributes.time
          layout: "%Y-%m-%dT%H:%M:%S.%fZ"
      - type: severity_parser
        parse_from: attributes.level
```

## Host Metrics Receiver

Collects system-level metrics. Scrapers are opt-in.

```yaml
receivers:
  hostmetrics:
    collection_interval: 30s
    scrapers:
      cpu: {}
      disk: {}
      filesystem: {}
      load: {}
      memory: {}
      network: {}
      processes: {}
```

## Decision Notes

- Prefer `otlp` grpc over HTTP when latency matters; HTTP is fine for low-volume or browser sources.
- Do not run `prometheus` and `hostmetrics` for the same metrics — pick one source of truth per signal.
- `filelog` requires the collector to have read access to the target log path; account for this in container mounts or DaemonSet volumes.
