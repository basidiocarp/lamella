---
name: otel-collector
description: "Configures OpenTelemetry Collector pipelines for traces, metrics, and logs. Use when setting up receivers, processors, exporters, or service pipelines; choosing between agent and gateway deployment; applying sampling strategies; or transforming telemetry with OTTL."
origin: lamella
---

# OpenTelemetry Collector

Use this skill when configuring or reviewing an OpenTelemetry Collector deployment. It covers pipeline structure, component ordering, sampling decisions, OTTL transforms, and deployment patterns. Backend-agnostic: works with any OTLP-compatible destination.

## When to Use

- Setting up receivers for OTLP, Prometheus scrape, filelog, or host metrics
- Wiring receivers, processors, and exporters into a service pipeline
- Choosing agent (DaemonSet) vs gateway (Deployment) topology
- Configuring tail sampling or probabilistic sampling
- Transforming, filtering, or redacting telemetry with OTTL
- Exporting to any OTLP-compatible backend

## Core Workflow

1. Choose receivers for each signal (traces, metrics, logs).
2. Add `memory_limiter` as the first processor in every pipeline.
3. Add enrichment processors (`resourcedetection`, `k8sattributes`, `batch`) after memory_limiter.
4. Wire each signal into its own named pipeline in the `service` section.
5. Configure exporters with retry, queue, compression, and timeout.
6. Validate the config before deploying.
7. Confirm health via the health check endpoint.

## Key Principles

- `memory_limiter` goes first — always. It prevents OOM crashes under load.
- One pipeline per signal (`traces`, `metrics`, `logs`). Do not share pipelines across signal types.
- Every component declared in `receivers`, `processors`, or `exporters` must appear in at least one pipeline or the collector refuses to start.
- Add `batch` processor last, just before the exporter, to reduce export calls.
- Use `sending_queue` + `retry_on_failure` on all exporters for production resilience.

## Minimal Validation

```bash
# Validate config syntax and component wiring
otelcol validate --config=config.yaml

# Health check after startup (default port)
curl -s http://localhost:13133/

# Internal metrics (Prometheus format)
curl -s http://localhost:8888/metrics | grep otelcol_process
```

## Quick Reference

| Task | Reference |
|------|-----------|
| Receiver selection and config | [references/receivers.md](references/receivers.md) |
| Exporter config and backend table | [references/exporters.md](references/exporters.md) |
| Processor ordering and patterns | [references/processors.md](references/processors.md) |
| Service pipelines and connectors | [references/pipelines.md](references/pipelines.md) |
| Head vs tail sampling | [references/sampling.md](references/sampling.md) |
| OTTL transforms and filters | [references/ottl.md](references/ottl.md) |
| Agent vs gateway deployment | [references/deployment.md](references/deployment.md) |

## Related Skills

- [../distributed-tracing/SKILL.md](../distributed-tracing/SKILL.md)
- [../prometheus-configuration/SKILL.md](../prometheus-configuration/SKILL.md)
- [../grafana-dashboards/SKILL.md](../grafana-dashboards/SKILL.md)
