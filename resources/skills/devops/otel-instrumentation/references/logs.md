# Logs

## Structured Logging

Emit logs as key-value records, never as interpolated strings. String interpolation destroys queryability.

```python
# Good
logger.info("order placed", extra={"order_id": order.id, "amount": order.total, "currency": "USD"})

# Bad
logger.info(f"order {order.id} placed for {order.total} USD")
```

```go
// Good
slog.Info("order placed", "order_id", order.ID, "amount", order.Total, "currency", "USD")

// Bad
log.Printf("order %s placed for %.2f USD", order.ID, order.Total)
```

## Severity Mapping

Map your logger's levels to OTel severity numbers when using the OTel Logs SDK:

| Logger level | OTel severity | Number |
|-------------|---------------|--------|
| TRACE | TRACE | 1–4 |
| DEBUG | DEBUG | 5–8 |
| INFO | INFO | 9–12 |
| WARN | WARN | 13–16 |
| ERROR | ERROR | 17–20 |
| FATAL | FATAL | 21–24 |

Most OTel log bridges (e.g., `opentelemetry-instrumentation-logging` for Python, `logback-opentelemetry-appender` for Java) handle this mapping automatically.

## Trace Correlation

Inject `trace_id` and `span_id` into every log record. This links logs to the trace that produced them in any backend that supports correlation.

### Python (with OTel log bridge)

```python
from opentelemetry.instrumentation.logging import LoggingInstrumentor
LoggingInstrumentor().instrument(set_logging_format=True)
# trace_id and span_id are now injected automatically into log records
```

### Go (with slog)

```go
import "go.opentelemetry.io/contrib/bridges/otelslog"

logger := otelslog.NewLogger("my-service")
// logger injects trace context from the active span automatically
```

### Node.js (with winston)

```javascript
import { context, trace } from '@opentelemetry/api';

const addTraceContext = winston.format((info) => {
  const span = trace.getActiveSpan();
  if (span) {
    const { traceId, spanId } = span.spanContext();
    info.trace_id = traceId;
    info.span_id = spanId;
  }
  return info;
});
```

### Java (Logback)

```xml
<!-- logback.xml — OTel appender handles correlation automatically -->
<appender name="OpenTelemetry" class="io.opentelemetry.instrumentation.logback.appender.v1_0.OpenTelemetryAppender"/>
```

## Safe Field Selection

| Safe to log | Requires evaluation (see sensitive-data.md) |
|-------------|---------------------------------------------|
| `order_id`, `user_id` (opaque identifiers) | Email addresses |
| HTTP status codes | IP addresses |
| Operation names | Request/response bodies |
| Duration, latency | Query parameters |
| Error type and message | Headers (may contain tokens) |

Never spread objects or request bodies into log fields without reviewing each key. See [sensitive-data.md](sensitive-data.md) for the full never-log list.
