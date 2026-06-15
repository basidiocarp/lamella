---
name: distributed-tracing
description: "Implements distributed tracing with Jaeger, Tempo, and request analysis."
origin: lamella
---

# Distributed Tracing

Use this skill to make request flow visible across services. Reach for it when logs and metrics show symptoms but not the causal path between callers, downstream dependencies, and slow spans.

## When to Use

- Debugging latency spikes or cross-service failures
- Understanding service dependencies in a distributed system
- Adding OpenTelemetry instrumentation to an existing service
- Choosing sampling, propagation, or backend storage patterns

## Core Workflow

1. Instrument ingress, key downstream calls, and datastore boundaries.
2. Propagate context across every async or network boundary.
3. Export traces to Jaeger, Tempo, or an OpenTelemetry-compatible backend.
4. Start with conservative sampling and raise fidelity for hot paths when needed.
5. Correlate traces with logs and metrics for final diagnosis.

## Minimal Trace Model

```text
Trace
├── frontend span
├── api-gateway span
├── auth-service span
└── database span
```

## Key Decisions

| Area | Default Guidance |
|------|------------------|
| Instrumentation | OpenTelemetry first |
| Propagation | Standard `traceparent` / `tracestate` headers |
| Backend | Jaeger for quick setup, Tempo when aligned with Grafana |
| Sampling | Start low, then tune by service criticality and cost |

## Good Practice

- Name spans after real operations, not generic helper functions.
- Record enough attributes to filter by route, status, and dependency.
- Avoid tracing every internal helper; focus on meaningful boundaries.
- Pair tracing with correlated logs for fast root-cause work.

## Related Skills

- [../grafana-dashboards/SKILL.md](../grafana-dashboards/SKILL.md)
- [../prometheus-configuration/SKILL.md](../prometheus-configuration/SKILL.md)
- [../slo-implementation/SKILL.md](../slo-implementation/SKILL.md)
