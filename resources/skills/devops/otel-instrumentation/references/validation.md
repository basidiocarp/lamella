# Validation

Run these checks after deploying instrumented code. Work through them in order — earlier checks are prerequisites for later ones.

## Pre-Flight Checks

Confirm the SDK can reach the collector before generating any traffic.

```bash
# Verify required env vars are set
echo $OTEL_SERVICE_NAME           # must be non-empty
echo $OTEL_EXPORTER_OTLP_ENDPOINT # must point to a reachable collector

# Test collector reachability (gRPC default port 4317, HTTP 4318)
curl -f http://collector:4318/v1/traces --max-time 5 \
  -H "Content-Type: application/json" -d '{}' 2>&1 | head -5
# Expect: 400 (bad payload) or 200 — not a connection refused

# For gRPC
grpc_health_probe -addr=collector:4317 2>/dev/null || \
  echo "grpc_health_probe not installed — check collector logs instead"
```

Confirm the collector is configured to accept the protocol your SDK uses (`grpc` vs `http/protobuf`). A mismatch is the most common pre-flight failure.

## Collector Confirmation

Check collector logs or metrics to confirm data is arriving:

```bash
# If running otelcol locally
journalctl -u otelcol --since "5 minutes ago" | grep -E "(error|receiver|exporter)"

# If the collector exposes its own Prometheus metrics
curl -s http://collector:8888/metrics | grep -E "otelcol_(receiver|exporter)_"
# otelcol_receiver_accepted_spans_total > 0  → spans are arriving
# otelcol_exporter_sent_spans_total > 0      → spans are being forwarded
# otelcol_exporter_send_failed_spans_total   → non-zero means export failures
```

## Backend Validation Checklist

After generating real traffic (at least one request through an instrumented path):

- [ ] Service appears in the backend's service list by its correct `service.name`
- [ ] Resource attributes are present on spans: `service.name`, `service.version`, `deployment.environment.name`
- [ ] Span names are low-cardinality (no user IDs, request IDs, or raw query text visible in span names)
- [ ] Span attributes are populated: HTTP spans have `http.request.method` and `http.response.status_code`; DB spans have `db.system` and `db.operation.name`
- [ ] Trace IDs connect spans across service boundaries (check a trace that crosses two services)
- [ ] Logs include `trace_id` and `span_id` fields and they match the corresponding trace

## Attribute Coverage Check

Spot-check a sample span for the minimum expected attributes:

```text
Span: GET /orders
  service.name          = "checkout-api"       ✓ resource attribute
  service.version       = "2.4.1"              ✓ resource attribute
  deployment.environment.name = "production"   ✓ resource attribute
  http.request.method   = "GET"                ✓ semantic convention
  http.response.status_code = 200              ✓ semantic convention
  url.path              = "/orders/{order_id}" ✓ parameterized
  span.kind             = SERVER               ✓ correct kind
  status                = UNSET                ✓ success — not ERROR
```

## Common Failures

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Service does not appear in backend | `OTEL_SERVICE_NAME` not set or SDK not initialized | Check env var and SDK init order |
| Spans arrive but no resource attributes | SDK initialized after first span is created | Move SDK init to the very start of the process |
| Trace IDs do not link across services | Propagation headers stripped by a proxy or load balancer | Enable `traceparent` passthrough on all intermediate components |
| No data in collector | Protocol mismatch (gRPC vs HTTP) | Align `OTEL_EXPORTER_OTLP_PROTOCOL` with collector receiver config |
| High-cardinality span names | Span name includes dynamic value | Parameterize or move value to attribute |
| Logs missing trace context | Log bridge not initialized or initialized before SDK | Initialize OTel SDK, then the log bridge, then the logger |
