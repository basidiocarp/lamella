# Observability in Microservices

Compact guide for metrics, logs, tracing, and reliability targets.

## The Three Pillars

### Metrics

```text
Track:
- business metrics: orders, revenue, conversions
- service metrics: request rate, error rate, latency
- infrastructure metrics: CPU, memory, queue depth, connection pools
```

Key patterns:
- use RED for services: rate, errors, duration
- use USE for resources: utilization, saturation, errors
- split latency by success and failure path

Minimal example:

```python
orders_total.labels(status="completed").inc()
request_duration.labels(route="/orders").observe(0.132)
db_pool_active.set(12)
```

### Logs

Use structured logs by default:

```json
{
  "timestamp": "2026-03-26T15:30:45Z",
  "level": "INFO",
  "service": "order-service",
  "correlationId": "corr-123",
  "route": "POST /orders",
  "statusCode": 201
}
```

Operational rules:
- `ERROR` for failed user-visible operations
- `WARN` for degraded but recoverable behavior
- `INFO` for major business and lifecycle events
- `DEBUG` and `TRACE` only for temporary or sampled investigation

### Distributed Tracing

```text
Trace:
- one request across many services

Span:
- one operation inside that trace
```

Use traces to answer:
- where latency accumulates
- which downstream dependency failed
- whether work happened in series or parallel

## Correlation IDs

```python
correlation_id = request.headers.get("X-Correlation-ID", str(uuid.uuid4()))
request.state.correlation_id = correlation_id
response.headers["X-Correlation-ID"] = correlation_id
```

Carry the same ID through:
- gateway
- service logs
- async job metadata
- emitted events

## OpenTelemetry Default

```python
provider = TracerProvider()
provider.add_span_processor(BatchSpanProcessor(exporter))
trace.set_tracer_provider(provider)
FastAPIInstrumentor.instrument_app(app)
```

Default recommendation:
- auto-instrument HTTP, DB, and message clients
- add custom spans only around important business operations
- sample heavily in production unless the traffic volume is small

## SLO Basics

```text
SLI: what you measure
SLO: the target
SLA: the external commitment
```

Good starting SLOs:
- availability: `99.9%`
- latency: `p99 < 200ms` for interactive APIs
- queue freshness or processing delay for async systems

Error budget:

```text
100% - SLO target = allowed failure
99.9% availability => 0.1% monthly failure budget
```

Use the budget to decide:
- whether to keep shipping fast
- when to freeze risky changes
- which reliability fixes outrank feature work

## Alerting Rules

Alert on symptoms, not just causes:
- sustained error-rate spikes
- latency breaches at user-visible routes
- backlog growth or consumer lag
- near-exhausted error budget

Avoid:
- alerting on every single host metric
- paging on non-actionable noise
- duplicating the same alert across layers

## Default Dashboard Set

```text
Per service:
- request volume
- success/error split
- latency percentiles
- dependency latency
- queue depth or consumer lag
- saturation indicators
```

Cross-service:
- end-to-end request traces
- top failing routes
- top slow downstream calls
- error budget burn
