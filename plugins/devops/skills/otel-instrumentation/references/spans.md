# Spans

## Naming

Use `{verb} {noun}` at low cardinality. The verb is the operation; the noun is the resource type, not a specific instance.

| Good | Bad |
|------|-----|
| `GET /orders` | `GET /orders/8f3a2b` |
| `send email` | `send email to user@example.com` |
| `query users` | `SELECT * FROM users WHERE id=42` |
| `publish event` | `publish order.created.8f3a2b` |

**Parameterize paths** — replace dynamic segments before using them as span names:

```
/orders/{order_id}   not   /orders/8f3a2b
/users/{id}/profile  not   /users/42/profile
```

Keep the full URL or ID as a span *attribute* (`url.full`, `db.query.text`), not in the name.

## Span Kind

| Kind | Use When |
|------|----------|
| `SERVER` | Handling an inbound synchronous request |
| `CLIENT` | Making an outbound synchronous call (HTTP, gRPC, DB) |
| `PRODUCER` | Sending a message to a queue or topic |
| `CONSUMER` | Receiving and processing a message |
| `INTERNAL` | Work within the same process, not crossing a network boundary |

## Status Code

| Status | Set When |
|--------|----------|
| `UNSET` | Default — operation succeeded or error is already recorded on the exception |
| `OK` | Explicitly mark success only when the caller needs to distinguish from unset |
| `ERROR` | Operation failed in a way meaningful to the caller |

Set `ERROR` and record the exception. Do not set `ERROR` for expected business conditions (e.g., "not found" on a lookup by ID is usually not an error at the span level).

```python
# Python example
try:
    result = call_downstream()
except Exception as e:
    span.set_status(StatusCode.ERROR, str(e))
    span.record_exception(e)
    raise
```

## Key Attributes

Add attributes that let you filter and diagnose without reading logs:

| Category | Attributes |
|----------|-----------|
| HTTP | `http.request.method`, `http.response.status_code`, `url.path` |
| DB | `db.system`, `db.name`, `db.operation.name` |
| Messaging | `messaging.system`, `messaging.destination.name`, `messaging.operation.type` |
| RPC | `rpc.system`, `rpc.service`, `rpc.method` |

Use the [OTel semantic conventions attribute registry](https://opentelemetry.io/docs/specs/semconv/) before inventing names.

## Anti-Patterns

| Anti-pattern | Fix |
|-------------|-----|
| Span name includes a user ID or request ID | Move the value to an attribute |
| Span name is a function name like `processOrder` | Use the operation and resource: `process order` |
| Tracing every internal helper method | Instrument meaningful boundaries only |
| Setting `ERROR` for every non-200 response | Reserve `ERROR` for unhandled failures |
| Attributes with unbounded cardinality | Cap or parameterize the value |

## Sampling

Keep SDK sampling at **AlwaysOn**. Push sampling decisions to the OTel Collector using a `probabilistic`, `tail`, or `rule-based` sampler. This preserves the ability to adjust sample rates without redeploying services.

Never use `ParentBased` or `TraceIdRatioBased` in the SDK unless the collector cannot be configured — it makes tail sampling in the pipeline impossible.
