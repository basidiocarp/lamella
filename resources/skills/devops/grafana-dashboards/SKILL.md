---
name: grafana-dashboards
description: Creates and manages production Grafana dashboards for real-time visualization of system and application metrics. Use when building monitoring dashboards, visualizing metrics, or creating operational observability interfaces.
---

# Grafana Dashboards


## Contents

- [Purpose](#purpose)
- [When to Use](#when-to-use)
- [Dashboard Design Principles](#dashboard-design-principles)
  - [1. Hierarchy of Information](#1-hierarchy-of-information)
  - [2. RED Method (Services)](#2-red-method-services)
  - [3. USE Method (Resources)](#3-use-method-resources)
- [Dashboard Structure](#dashboard-structure)
  - [API Monitoring Dashboard](#api-monitoring-dashboard)
- [Panel Types](#panel-types)
  - [1. Stat Panel (Single Value)](#1-stat-panel-single-value)
  - [2. Time Series Graph](#2-time-series-graph)
  - [3. Table Panel](#3-table-panel)
  - [4. Heatmap](#4-heatmap)
- [Variables](#variables)
  - [Query Variables](#query-variables)
  - [Use Variables in Queries](#use-variables-in-queries)
- [Alerts in Dashboards](#alerts-in-dashboards)
- [Dashboard Provisioning](#dashboard-provisioning)
- [Common Dashboard Patterns](#common-dashboard-patterns)
  - [Infrastructure Dashboard](#infrastructure-dashboard)
  - [Database Dashboard](#database-dashboard)
  - [Application Dashboard](#application-dashboard)
- [Best Practices](#best-practices)
- [Dashboard as Code](#dashboard-as-code)
  - [Terraform Provisioning](#terraform-provisioning)
  - [Ansible Provisioning](#ansible-provisioning)
- [Reference Files](#reference-files)
- [Related Skills](#related-skills)


Create and manage production-ready Grafana dashboards for comprehensive system observability.

## Purpose

Design effective Grafana dashboards for monitoring applications, infrastructure, and business metrics.

## When to Use

- Visualize Prometheus metrics
- Create custom dashboards
- Implement SLO dashboards
- Monitor infrastructure
- Track business KPIs
- Generate a draft dashboard spec before hand-tuning panels

## Dashboard Drafting

Start with the script when you need a fast first cut for a service or audience:

```bash
python3 scripts/dashboard_generator.py --input service-definition.json --output dashboard-spec.json
```

PowerShell:

```powershell
python scripts\dashboard_generator.py --input .\service-definition.json --output .\dashboard-spec.json
```

## Dashboard Design Principles

### 1. Hierarchy of Information

```
┌─────────────────────────────────────┐
│  Critical Metrics (Big Numbers)     │
├─────────────────────────────────────┤
│  Key Trends (Time Series)           │
├─────────────────────────────────────┤
│  Detailed Metrics (Tables/Heatmaps) │
└─────────────────────────────────────┘
```

### 2. RED Method (Services)

- **Rate** - Requests per second
- **Errors** - Error rate
- **Duration** - Latency/response time

### 3. USE Method (Resources)

- **Utilization** - % time resource is busy
- **Saturation** - Queue length/wait time
- **Errors** - Error count

## Dashboard Structure

### API Monitoring Dashboard

```json
{
  "dashboard": {
    "title": "API Monitoring",
    "tags": ["api", "production"],
    "timezone": "browser",
// ... (45 lines trimmed)
    ]
  }
}
```

**Reference:** See `assets/api-dashboard.json`

## Panel Types

### 1. Stat Panel (Single Value)

```json
{
  "type": "stat",
  "title": "Total Requests",
  "targets": [
    {
// ... (22 lines trimmed)
    }
  }
}
```

### 2. Time Series Graph

```json
{
  "type": "graph",
  "title": "CPU Usage",
  "targets": [
// ... (7 lines trimmed)
  ]
}
```

### 3. Table Panel

```json
{
  "type": "table",
  "title": "Service Status",
  "targets": [
    {
// ... (17 lines trimmed)
    }
  ]
}
```

### 4. Heatmap

```json
{
  "type": "heatmap",
  "title": "Latency Heatmap",
  "targets": [
// ... (8 lines trimmed)
  }
}
```

## Variables

### Query Variables

```json
{
  "templating": {
    "list": [
      {
        "name": "namespace",
// ... (14 lines trimmed)
    ]
  }
}
```

### Use Variables in Queries

```
sum(rate(http_requests_total{namespace="$namespace", service=~"$service"}[5m]))
```

## Alerts in Dashboards

```json
{
  "alert": {
    "name": "High Error Rate",
    "conditions": [
      {
// ... (17 lines trimmed)
    "notifications": [{ "uid": "slack-channel" }]
  }
}
```

## Dashboard Provisioning

**dashboards.yml:**

```yaml
apiVersion: 1

providers:
  - name: "default"
// ... (6 lines trimmed)
    options:
      path: /etc/grafana/dashboards
```

## Common Dashboard Patterns

### Infrastructure Dashboard

**Key Panels:**

- CPU utilization per node
- Memory usage per node
- Disk I/O
- Network traffic
- Pod count by namespace
- Node status

**Reference:** See `assets/infrastructure-dashboard.json`

### Database Dashboard

**Key Panels:**

- Queries per second
- Connection pool usage
- Query latency (P50, P95, P99)
- Active connections
- Database size
- Replication lag
- Slow queries

**Reference:** See `assets/database-dashboard.json`

### Application Dashboard

**Key Panels:**

- Request rate
- Error rate
- Response time (percentiles)
- Active users/sessions
- Cache hit rate
- Queue length

## Best Practices

1. **Start with templates** (Grafana community dashboards)
2. **Use consistent naming** for panels and variables
3. **Group related metrics** in rows
4. **Set appropriate time ranges** (default: Last 6 hours)
5. **Use variables** for flexibility
6. **Add panel descriptions** for context
7. **Configure units** correctly
8. **Set meaningful thresholds** for colors
9. **Use consistent colors** across dashboards
10. **Test with different time ranges**

## Dashboard as Code

### Terraform Provisioning

```hcl
resource "grafana_dashboard" "api_monitoring" {
  config_json = file("${path.module}/dashboards/api-monitoring.json")
  folder      = grafana_folder.monitoring.id
}

resource "grafana_folder" "monitoring" {
  title = "Production Monitoring"
}
```

### Ansible Provisioning

```yaml
- name: Deploy Grafana dashboards
  copy:
    src: "{{ item }}"
    dest: /etc/grafana/dashboards/
  with_fileglob:
    - "dashboards/*.json"
  notify: restart grafana
```

## Reference Files

- `assets/api-dashboard.json` - API monitoring dashboard
- `assets/infrastructure-dashboard.json` - Infrastructure dashboard
- `assets/database-dashboard.json` - Database monitoring dashboard
- `references/dashboard-design.md` - Dashboard design guide

## Related Skills

- `prometheus-configuration` - For metric collection
- `slo-implementation` - For SLO dashboards
