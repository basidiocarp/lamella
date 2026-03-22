# Monitoring and Observability Setup

## Context

The user needs to implement or improve monitoring and observability. Focus on the three pillars of observability (metrics, logs, traces), setting up monitoring infrastructure, creating actionable dashboards, and establishing effective alerting strategies.

## Requirements

$ARGUMENTS

## Instructions

### 1. Prometheus & Metrics Setup

**Prometheus Configuration**

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  external_labels:
    cluster: "production"
# ... (25 lines trimmed)
        action: keep
        regex: true
```

**Custom Metrics Implementation**

```typescript
// metrics.ts
import { Counter, Histogram, Gauge, Registry } from "prom-client";

export class MetricsCollector {
  private registry: Registry;
  private httpRequestDuration: Histogram<string>;
# ... (48 lines trimmed)
  }
}
```

### 2. Grafana Dashboard Setup

**Dashboard Configuration**

```typescript
// dashboards/service-dashboard.ts
export const createServiceDashboard = (serviceName: string) => {
  return {
    title: `${serviceName} Service Dashboard`,
    uid: `${serviceName}-overview`,
    tags: ["service", serviceName],
# ... (47 lines trimmed)
  };
};
```

### 3. Distributed Tracing

**OpenTelemetry Configuration**

```typescript
// tracing.ts
import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { JaegerExporter } from "@opentelemetry/exporter-jaeger";
# ... (39 lines trimmed)
  }
}
```

### 4. Log Aggregation

**Fluentd Configuration**

```yaml
# fluent.conf
<source>
@type tail
path /var/log/containers/*.log
pos_file /var/log/fluentd-containers.log.pos
tag kubernetes.*
# ... (31 lines trimmed)
</buffer>
</match>
```

**Structured Logging Library**

```python
# structured_logging.py
import json
import logging
from datetime import datetime
from typing import Any, Dict, Optional

# ... (38 lines trimmed)
        log_msg = self._format_log('ERROR', message, context)
        self.logger.error(log_msg)
```

### 5. Alert Configuration

**Alert Rules**

```yaml
# alerts/application.yml
groups:
  - name: application
    interval: 30s
    rules:
      - alert: HighErrorRate
# ... (33 lines trimmed)
        labels:
          severity: critical
```

**Alertmanager Configuration**

```yaml
# alertmanager.yml
global:
  resolve_timeout: 5m
  slack_api_url: "$SLACK_API_URL"

route:
# ... (26 lines trimmed)
      - service_key: "$PAGERDUTY_SERVICE_KEY"
        description: "{{ .GroupLabels.alertname }}: {{ .Annotations.summary }}"
```

### 6. SLO Implementation

**SLO Configuration**

```typescript
// slo-manager.ts
interface SLO {
  name: string;
  target: number; // e.g., 99.9
  window: string; // e.g., '30d'
  burnRates: BurnRate[];
# ... (32 lines trimmed)
  }
}
```

### 7. Infrastructure as Code

**Terraform Configuration**

```hcl
# monitoring.tf
module "prometheus" {
  source = "./modules/prometheus"

  namespace = "monitoring"
  storage_size = "100Gi"
# ... (31 lines trimmed)
  })
}
```

## Output Format

1. **Infrastructure Assessment**: Current monitoring capabilities analysis
2. **Monitoring Architecture**: Complete monitoring stack design
3. **Implementation Plan**: Step-by-step deployment guide
4. **Metric Definitions**: Comprehensive metrics catalog
5. **Dashboard Templates**: Ready-to-use Grafana dashboards
6. **Alert Runbooks**: Detailed alert response procedures
7. **SLO Definitions**: Service level objectives and error budgets
8. **Integration Guide**: Service instrumentation instructions

Focus on creating a monitoring system that provides actionable insights, reduces MTTR, and enables proactive issue detection.
