# Exporters

Exporters send telemetry to a backend. Use OTLP/gRPC or OTLP/HTTP for any OTLP-compatible destination.

## OTLP/gRPC Exporter (preferred)

```yaml
exporters:
  otlp:
    endpoint: <OTLP_ENDPOINT>        # host:port, no scheme
    headers:
      Authorization: "Bearer <AUTH_TOKEN>"
    tls:
      insecure: false
    compression: gzip
    timeout: 30s
    retry_on_failure:
      enabled: true
      initial_interval: 5s
      max_interval: 30s
      max_elapsed_time: 300s
    sending_queue:
      enabled: true
      num_consumers: 10
      queue_size: 1000
```

## OTLP/HTTP Exporter

Use when the backend requires HTTP or you need per-signal URLs.

```yaml
exporters:
  otlphttp:
    endpoint: https://<OTLP_ENDPOINT>   # full URL with scheme
    headers:
      Authorization: "Bearer <AUTH_TOKEN>"
    compression: gzip
    timeout: 30s
    retry_on_failure:
      enabled: true
      initial_interval: 5s
      max_interval: 30s
      max_elapsed_time: 300s
    sending_queue:
      enabled: true
      num_consumers: 10
      queue_size: 1000
```

## Common Backends

| Backend | Protocol | Endpoint Pattern | Auth |
|---------|----------|-----------------|------|
| Datadog | OTLP/gRPC | `<DD_AGENT_HOST>:4317` (via agent) or `https://otlp.datadoghq.com` | `DD-Api-Key: <DD_API_KEY>` header |
| Grafana Cloud | OTLP/gRPC | `<INSTANCE>.grafana.net:443` | Basic auth: `<INSTANCE_ID>:<GRAFANA_API_KEY>` |
| Honeycomb | OTLP/gRPC | `api.honeycomb.io:443` | `x-honeycomb-team: <API_KEY>` header |
| Jaeger (self-hosted) | OTLP/gRPC | `jaeger-collector:4317` | None (or mTLS in production) |
| Grafana Tempo (self-hosted) | OTLP/gRPC | `tempo:4317` | None (or bearer token) |
| Generic OTLP | OTLP/gRPC or HTTP | `<OTLP_ENDPOINT>` | `Authorization: Bearer <AUTH_TOKEN>` |

For backends that use Basic auth over OTLP/HTTP:

```yaml
exporters:
  otlphttp:
    endpoint: https://<OTLP_ENDPOINT>
    auth:
      authenticator: basicauth
extensions:
  basicauth:
    client_auth:
      username: "<USERNAME>"
      password: "<PASSWORD>"
```

## Debug Exporter

Useful during development. Prints telemetry to stdout. Remove before production.

```yaml
exporters:
  debug:
    verbosity: detailed
```

## Production Checklist

- Enable `retry_on_failure` — transient network errors are common.
- Set `sending_queue` with a queue size proportional to your burst volume.
- Use `compression: gzip` to reduce egress cost and latency.
- Set `timeout` to at least 10s; 30s is safe for most backends.
- Never hardcode auth tokens in config files. Use environment variable substitution:

```yaml
headers:
  Authorization: "Bearer ${env:AUTH_TOKEN}"
```
