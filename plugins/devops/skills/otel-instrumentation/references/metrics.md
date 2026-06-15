# Metrics

## Check Auto-Instrumentation First

Before creating a custom metric, confirm the value is not already emitted by the auto-instrumentation package. Creating a duplicate wastes cardinality budget and confuses dashboards.

Common auto-instrumented metrics by ecosystem:

| Library / Runtime | Auto-emitted metrics |
|-------------------|---------------------|
| Node.js HTTP (`@opentelemetry/instrumentation-http`) | `http.server.request.duration`, `http.client.request.duration` |
| Go `net/http` | `http.server.request.duration`, `http.server.active_requests` |
| Python `opentelemetry-instrumentation-fastapi` | `http.server.request.duration` |
| Java Spring Boot Actuator + OTel | `http.server.request.duration`, `jvm.memory.used`, `jvm.gc.duration` |
| Rust `opentelemetry` + `tower` middleware | `http.server.request.duration` |

Check the instrumentation library's README for the full list before adding a custom instrument.

## Instrument Selection

| Instrument | Use When |
|-----------|----------|
| `Counter` | Value only increases (requests, errors, messages sent) |
| `Histogram` | Measuring distributions (latency, payload size) |
| `Gauge` | Point-in-time value that can go up or down (queue depth, active connections) |
| `UpDownCounter` | Cumulative value that can increase or decrease (concurrent requests) |

When in doubt between `Gauge` and `UpDownCounter`: use `Gauge` for observed values you did not cause (memory used, temperature), use `UpDownCounter` for values your code controls (items in a pool).

## Naming Conventions

Follow the OTel semantic conventions naming pattern:

```
{namespace}.{noun}.{verb_or_unit}
```

Examples:

| Good | Bad |
|------|-----|
| `order.items.count` | `orderItemCount` |
| `http.server.request.duration` | `httpRequestTime` |
| `db.client.connection.count` | `database_connections` |
| `messaging.message.body.size` | `msg_size_bytes` |

Rules:
- Lowercase, dot-separated
- No units in the name when the unit field carries them
- Use semantic convention names when they exist

## Units

Set units at instrument creation. Use the [UCUM](https://ucum.org/) standard:

| Measurement | Unit string |
|-------------|------------|
| Duration | `s` (seconds), `ms` (milliseconds) |
| Bytes | `By` |
| Count (dimensionless) | `{request}`, `{item}`, `{error}` — use `{noun}` notation |
| Ratio | `1` |

```python
# Python example
meter.create_histogram(
    name="order.processing.duration",
    unit="s",
    description="Time to process an order from receipt to confirmation",
)
```

## Cardinality Management

High cardinality destroys metric stores. Keep attribute values bounded:

| Safe | Dangerous |
|------|-----------|
| `http.response.status_code` (200, 404, 500) | User ID |
| `http.request.method` (GET, POST, ...) | Full URL with path parameters |
| `deployment.environment.name` | Request ID or trace ID |
| `db.system` (postgresql, redis) | Raw query text |

Guidelines:
- Each unique combination of attribute values creates a new time series.
- A histogram with 10 buckets costs 10× more than a counter per label set.
- Drop high-cardinality attributes at the collector before they reach the backend.
- Target fewer than 100 unique label combinations per metric in most cases.
