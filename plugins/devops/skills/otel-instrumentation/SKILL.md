---
name: otel-instrumentation
description: "Instruments services with the OpenTelemetry SDK to emit traces, metrics, and logs. Use when adding OTel to a new service, reviewing telemetry quality, or choosing SDK setup across Node.js, Go, Python, Java, or Rust."
origin: lamella
---

# OTel Instrumentation

Use this skill to add or review OpenTelemetry SDK instrumentation. It covers traces, metrics, and logs together — semantic conventions are folded into each signal's reference, not treated separately.

## When to Use

- Instrumenting a service with OTel for the first time
- Adding manual spans or custom metrics to auto-instrumented code
- Reviewing telemetry quality: cardinality, naming, attribute coverage
- Choosing SDK setup and configuration across languages
- Correlating logs with trace context

## Core Workflow

1. **Resolve config** — set `OTEL_SERVICE_NAME`, `OTEL_EXPORTER_OTLP_ENDPOINT`, and `OTEL_RESOURCE_ATTRIBUTES` via environment variables.
2. **Set resource attributes** — `service.name`, `service.version`, `deployment.environment.name` first. Add k8s attributes via downward API if running in Kubernetes.
3. **Auto-instrument** — enable the language auto-instrumentation package before writing any manual spans.
4. **Add manual spans** — instrument ingress, downstream calls, and datastore boundaries. Name spans `{verb} {noun}` at low cardinality.
5. **Add custom metrics** — check what auto-instrumentation already emits before creating custom instruments.
6. **Correlate logs** — inject `trace_id` and `span_id` into every log record. Use structured key-value fields, never string interpolation.
7. **Validate** — confirm the service appears in the backend, resource attributes are present, and span names and attributes are populated.

## Key Principles

- **Signal density over volume** — a few high-quality attributes beat many low-value ones.
- **Sample in the pipeline, not the SDK** — keep SDK sampling at AlwaysOn; push sampling decisions to the collector.
- **Resource attributes are the highest-impact change** — `service.name` is required. Without it, traces and metrics are unfilterable.
- **Semantic conventions first** — check the OTel attribute registry before inventing custom attribute names.
- **Never instrument sensitive data** — credentials, PII, and financial values must not appear in any signal.

## Quick Reference

| Task | Reference |
|------|-----------|
| Resource attribute setup | [references/resources.md](references/resources.md) |
| Span naming, kind, status, sampling | [references/spans.md](references/spans.md) |
| Metric instrument selection, naming, cardinality | [references/metrics.md](references/metrics.md) |
| Structured logging and trace correlation | [references/logs.md](references/logs.md) |
| Sensitive data — what to never instrument | [references/sensitive-data.md](references/sensitive-data.md) |
| SDK bootstrap per language | [references/sdks.md](references/sdks.md) |
| Post-deployment validation checklist | [references/validation.md](references/validation.md) |

## Related Skills

- [../otel-collector/SKILL.md](../otel-collector/SKILL.md)
- [../distributed-tracing/SKILL.md](../distributed-tracing/SKILL.md)
- [../prometheus-configuration/SKILL.md](../prometheus-configuration/SKILL.md)
