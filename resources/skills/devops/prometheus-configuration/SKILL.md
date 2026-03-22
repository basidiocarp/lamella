---
name: prometheus-configuration
description: Set up Prometheus for comprehensive metric collection, storage, and monitoring of infrastructure and applications. Use when implementing metrics collection, setting up monitoring infrastructure, or configuring alerting systems.
---

# Prometheus Configuration


## Contents

- [Purpose](#purpose)
- [When to Use](#when-to-use)
- [Prometheus Architecture](#prometheus-architecture)
- [Installation](#installation)
  - [Kubernetes with Helm](#kubernetes-with-helm)
  - [Docker Compose](#docker-compose)
- [Configuration File](#configuration-file)
- [Scrape Configurations](#scrape-configurations)
  - [Static Targets](#static-targets)
  - [File-based Service Discovery](#file-based-service-discovery)
  - [Kubernetes Service Discovery](#kubernetes-service-discovery)
- [Recording Rules](#recording-rules)
- [Alert Rules](#alert-rules)
- [Validation](#validation)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Reference Files](#reference-files)
- [Related Skills](#related-skills)


Complete guide to Prometheus setup, metric collection, scrape configuration, and recording rules.

## Purpose

Configure Prometheus for comprehensive metric collection, alerting, and monitoring of infrastructure and applications.

## When to Use

- Set up Prometheus monitoring
- Configure metric scraping
- Create recording rules
- Design alert rules
- Implement service discovery

## Prometheus Architecture

```
┌──────────────┐
│ Applications │ ← Instrumented with client libraries
└──────┬───────┘
       │ /metrics endpoint
       ↓
┌──────────────┐
│  Prometheus  │ ← Scrapes metrics periodically
│    Server    │
└──────┬───────┘
       │
       ├─→ AlertManager (alerts)
       ├─→ Grafana (visualization)
       └─→ Long-term storage (Thanos/Cortex)
```

## Installation

### Kubernetes with Helm

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  --set prometheus.prometheusSpec.retention=30d \
  --set prometheus.prometheusSpec.storageVolumeSize=50Gi
```

### Docker Compose

```yaml
version: "3.8"
services:
  prometheus:
    image: prom/prometheus:latest
    ports:
// ... (8 lines trimmed)

volumes:
  prometheus-data:
```

## Configuration File

**prometheus.yml:**

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  external_labels:
    cluster: "production"
// ... (67 lines trimmed)
      ca_file: /etc/prometheus/ca.crt
      cert_file: /etc/prometheus/client.crt
      key_file: /etc/prometheus/client.key
```

**Reference:** See `assets/prometheus.yml.template`

## Scrape Configurations

### Static Targets

```yaml
scrape_configs:
  - job_name: "static-targets"
    static_configs:
      - targets: ["host1:9100", "host2:9100"]
        labels:
          env: "production"
          region: "us-west-2"
```

### File-based Service Discovery

```yaml
scrape_configs:
  - job_name: "file-sd"
    file_sd_configs:
      - files:
          - /etc/prometheus/targets/*.json
          - /etc/prometheus/targets/*.yml
        refresh_interval: 5m
```

**targets/production.json:**

```json
[
  {
    "targets": ["app1:9090", "app2:9090"],
    "labels": {
      "env": "production",
      "service": "api"
    }
  }
]
```

### Kubernetes Service Discovery

```yaml
scrape_configs:
  - job_name: "kubernetes-services"
    kubernetes_sd_configs:
      - role: service
    relabel_configs:
// ... (10 lines trimmed)
        action: replace
        target_label: __metrics_path__
        regex: (.+)
```

**Reference:** See `references/scrape-configs.md`

## Recording Rules

Create pre-computed metrics for frequently queried expressions:

```yaml
# /etc/prometheus/rules/recording_rules.yml
groups:
  - name: api_metrics
    interval: 15s
    rules:
// ... (33 lines trimmed)
      - record: instance:node_disk:utilization
        expr: |
          100 - ((node_filesystem_avail_bytes / node_filesystem_size_bytes) * 100)
```

**Reference:** See `references/recording-rules.md`

## Alert Rules

```yaml
# /etc/prometheus/rules/alert_rules.yml
groups:
  - name: availability
    interval: 30s
    rules:
// ... (53 lines trimmed)
        annotations:
          summary: "Low disk space on {{ $labels.instance }}"
          description: "Disk usage is {{ $value }}%"
```

## Validation

```bash
# Validate configuration
promtool check config prometheus.yml

# Validate rules
promtool check rules /etc/prometheus/rules/*.yml

# Test query
promtool query instant http://localhost:9090 'up'
```

**Reference:** See `scripts/validate-prometheus.sh`

## Best Practices

1. **Use consistent naming** for metrics (prefix_name_unit)
2. **Set appropriate scrape intervals** (15-60s typical)
3. **Use recording rules** for expensive queries
4. **Implement high availability** (multiple Prometheus instances)
5. **Configure retention** based on storage capacity
6. **Use relabeling** for metric cleanup
7. **Monitor Prometheus itself**
8. **Implement federation** for large deployments
9. **Use Thanos/Cortex** for long-term storage
10. **Document custom metrics**

## Troubleshooting

**Check scrape targets:**

```bash
curl http://localhost:9090/api/v1/targets
```

**Check configuration:**

```bash
curl http://localhost:9090/api/v1/status/config
```

**Test query:**

```bash
curl 'http://localhost:9090/api/v1/query?query=up'
```

## Reference Files

- `assets/prometheus.yml.template` - Complete configuration template
- `references/scrape-configs.md` - Scrape configuration patterns
- `references/recording-rules.md` - Recording rule examples
- `scripts/validate-prometheus.sh` - Validation script

## Related Skills

- `grafana-dashboards` - For visualization
- `slo-implementation` - For SLO monitoring
- `distributed-tracing` - For request tracing
