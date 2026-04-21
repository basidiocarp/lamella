---
name: grafana-dashboards
description: "Creates and manages production Grafana dashboards for real-time visualization of system and application metrics."
origin: lamella
---

# Grafana Dashboards

Use this skill to shape dashboards around operational decisions, not just metric availability. The generator and references should produce a first draft; final dashboards still need human tuning around panel order, thresholds, and audience.

## When to Use

- Creating a new service or infrastructure dashboard
- Turning Prometheus or Loki data into operator-facing views
- Drafting an SLO, RED, or USE-oriented dashboard
- Provisioning dashboards as code

## Core Workflow

1. Pick the dashboard audience: on-call, service owner, platform team, or leadership.
2. Start with the few metrics that answer the main operational questions.
3. Put critical single-value or threshold panels first.
4. Add time-series trends and drill-down panels below them.
5. Add templating only when it simplifies repeated use.
6. Add alerts separately from dashboard layout decisions.

## Drafting Shortcut

```bash
python3 scripts/dashboard_generator.py --input service-definition.json --output dashboard-spec.json
```

PowerShell:

```powershell
python scripts\dashboard_generator.py --input .\service-definition.json --output .\dashboard-spec.json
```

## Recommended Layout

| Layer | Purpose |
|-------|---------|
| Top row | Current health, saturation, and error signals |
| Middle rows | Trends over time and percentile views |
| Bottom rows | Tables, heatmaps, and debugging panels |

## Panel Rules

- Use RED for request-driven services.
- Use USE for infrastructure dashboards.
- Keep legends short and units explicit.
- Avoid panels that duplicate the same signal with different formatting.
- Use variables sparingly; too many turns a dashboard into a query builder.

## References

- [references/dashboard-best-practices.md](references/dashboard-best-practices.md)
- [`scripts/dashboard_generator.py`](scripts/dashboard_generator.py)
