---
name: prometheus-configuration
description: "Sets up Prometheus for metric collection, storage, and monitoring of infrastructure and applications."
origin: lamella
---

# Prometheus Configuration

Use this skill to stand up or review Prometheus collection, rule design, and alerting behavior. Keep the main skill as the routing layer for scrape strategy, rule shape, and operational guardrails.

## When to Use

- Bootstrapping Prometheus in Kubernetes or Compose
- Designing scrape jobs and service discovery
- Adding recording rules for expensive queries
- Reviewing alert noise before production rollout

## Core Workflow

1. Define scrape targets and intervals.
2. Choose the service-discovery pattern.
3. Add recording rules for repeated expensive queries.
4. Add alerts only after the raw metrics and rules behave correctly.
5. Validate config and rules before reload or deploy.

## Minimal Validation

```bash
promtool check config prometheus.yml
promtool check rules /etc/prometheus/rules/*.yml
promtool query instant http://localhost:9090 'up'
```

## Review Helper

```bash
python3 scripts/alert_optimizer.py --input alerts.json --analyze-only
```

PowerShell:

```powershell
python scripts\alert_optimizer.py --input .\alerts.json --analyze-only
```

## References

- [references/scrape-configs.md](references/scrape-configs.md)
- [references/recording-rules.md](references/recording-rules.md)
- [references/alert-design-patterns.md](references/alert-design-patterns.md)
- [`scripts/alert_optimizer.py`](scripts/alert_optimizer.py)
