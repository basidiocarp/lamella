---
name: distributed-tracing
description: Implements distributed tracing with Jaeger and Tempo to track requests across microservices and identify performance bottlenecks. Use when debugging microservices, analyzing request flows, or implementing observability for distributed systems.
---

# Distributed Tracing


## Contents

- [Purpose](#purpose)
- [When to Use](#when-to-use)
- [Distributed Tracing Concepts](#distributed-tracing-concepts)
  - [Trace Structure](#trace-structure)
  - [Key Components](#key-components)
- [Jaeger Setup](#jaeger-setup)
  - [Kubernetes Deployment](#kubernetes-deployment)
  - [Docker Compose](#docker-compose)
- [Application Instrumentation](#application-instrumentation)
  - [OpenTelemetry (Recommended)](#opentelemetry-recommended)
- [Context Propagation](#context-propagation)
  - [HTTP Headers](#http-headers)
  - [Propagation in HTTP Requests](#propagation-in-http-requests)
- [Tempo Setup (Grafana)](#tempo-setup-grafana)
  - [Kubernetes Deployment](#kubernetes-deployment)
- [Sampling Strategies](#sampling-strategies)
  - [Probabilistic Sampling](#probabilistic-sampling)
  - [Rate Limiting Sampling](#rate-limiting-sampling)
  - [Adaptive Sampling](#adaptive-sampling)
- [Trace Analysis](#trace-analysis)
  - [Finding Slow Requests](#finding-slow-requests)
  - [Finding Errors](#finding-errors)
  - [Service Dependency Graph](#service-dependency-graph)
- [Best Practices](#best-practices)
- [Integration with Logging](#integration-with-logging)
  - [Correlated Logs](#correlated-logs)
- [Troubleshooting](#troubleshooting)
- [Reference Files](#reference-files)
- [Related Skills](#related-skills)


Implement distributed tracing with Jaeger and Tempo for request flow visibility across microservices.

## Purpose

Track requests across distributed systems to understand latency, dependencies, and failure points.

## When to Use

- Debug latency issues
- Understand service dependencies
- Identify bottlenecks
- Trace error propagation
- Analyze request paths
- Pair with `slo-implementation`, `prometheus-configuration`, and `grafana-dashboards` when designing full observability coverage

## Distributed Tracing Concepts

### Trace Structure

```
Trace (Request ID: abc123)
  ↓
Span (frontend) [100ms]
  ↓
Span (api-gateway) [80ms]
  ├→ Span (auth-service) [10ms]
  └→ Span (user-service) [60ms]
      └→ Span (database) [40ms]
```

### Key Components

- **Trace** - End-to-end request journey
- **Span** - Single operation within a trace
- **Context** - Metadata propagated between services
- **Tags** - Key-value pairs for filtering
- **Logs** - Timestamped events within a span

## Jaeger Setup

### Kubernetes Deployment

```bash
# Deploy Jaeger Operator
kubectl create namespace observability
kubectl create -f https://github.com/jaegertracing/jaeger-operator/releases/download/v1.51.0/jaeger-operator.yaml -n observability

# Deploy Jaeger instance
// ... (13 lines trimmed)
  ingress:
    enabled: true
EOF
```

### Docker Compose

```yaml
version: "3.8"
services:
  jaeger:
    image: jaegertracing/all-in-one:latest
// ... (9 lines trimmed)
    environment:
      - COLLECTOR_ZIPKIN_HOST_PORT=:9411
```

**Reference:** See `references/jaeger-setup.md`

## Application Instrumentation

### OpenTelemetry (Recommended)

#### Python (Flask)

```python
from opentelemetry import trace
from opentelemetry.exporter.jaeger.thrift import JaegerExporter
from opentelemetry.sdk.resources import SERVICE_NAME, Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
// ... (32 lines trimmed)
        span.set_attribute("db.statement", "SELECT * FROM users")
        # Database query
        return query_database()
```

#### Node.js (Express)

```javascript
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
const { JaegerExporter } = require("@opentelemetry/exporter-jaeger");
const { BatchSpanProcessor } = require("@opentelemetry/sdk-trace-base");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
// ... (33 lines trimmed)
    span.end();
  }
});
```

#### Go

```go
package main

import (
    "context"
    "go.opentelemetry.io/otel"
// ... (39 lines trimmed)
    span.SetAttributes(attribute.Int("user.count", len(users)))
    return users, nil
}
```

**Reference:** See `references/instrumentation.md`

## Context Propagation

### HTTP Headers

```
traceparent: 00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01
tracestate: congo=t61rcWkgMzE
```

### Propagation in HTTP Requests

#### Python

```python
from opentelemetry.propagate import inject

headers = {}
inject(headers)  # Injects trace context

response = requests.get('http://downstream-service/api', headers=headers)
```

#### Node.js

```javascript
const { propagation } = require("@opentelemetry/api");

const headers = {};
propagation.inject(context.active(), headers);

axios.get("http://downstream-service/api", { headers });
```

## Tempo Setup (Grafana)

### Kubernetes Deployment

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: tempo-config
data:
// ... (43 lines trimmed)
        - name: config
          configMap:
            name: tempo-config
```

**Reference:** See `assets/jaeger-config.yaml.template`

## Sampling Strategies

### Probabilistic Sampling

```yaml
# Sample 1% of traces
sampler:
  type: probabilistic
  param: 0.01
```

### Rate Limiting Sampling

```yaml
# Sample max 100 traces per second
sampler:
  type: ratelimiting
  param: 100
```

### Adaptive Sampling

```python
from opentelemetry.sdk.trace.sampling import ParentBased, TraceIdRatioBased

# Sample based on trace ID (deterministic)
sampler = ParentBased(root=TraceIdRatioBased(0.01))
```

## Trace Analysis

### Finding Slow Requests

**Jaeger Query:**

```
service=my-service
duration > 1s
```

### Finding Errors

**Jaeger Query:**

```
service=my-service
error=true
tags.http.status_code >= 500
```

### Service Dependency Graph

Jaeger automatically generates service dependency graphs showing:

- Service relationships
- Request rates
- Error rates
- Average latencies

## Best Practices

1. **Sample appropriately** (1-10% in production)
2. **Add meaningful tags** (user_id, request_id)
3. **Propagate context** across all service boundaries
4. **Log exceptions** in spans
5. **Use consistent naming** for operations
6. **Monitor tracing overhead** (<1% CPU impact)
7. **Set up alerts** for trace errors
8. **Implement distributed context** (baggage)
9. **Use span events** for important milestones
10. **Document instrumentation** standards

## Integration with Logging

### Correlated Logs

```python
import logging
from opentelemetry import trace

logger = logging.getLogger(__name__)
// ... (7 lines trimmed)
        extra={"trace_id": format(trace_id, '032x')}
    )
```

## Troubleshooting

**No traces appearing:**

- Check collector endpoint
- Verify network connectivity
- Check sampling configuration
- Review application logs

**High latency overhead:**

- Reduce sampling rate
- Use batch span processor
- Check exporter configuration

## Reference Files

- `references/jaeger-setup.md` - Jaeger installation
- `references/instrumentation.md` - Instrumentation patterns
- `assets/jaeger-config.yaml.template` - Jaeger configuration

## Related Skills

- `prometheus-configuration` - For metrics
- `grafana-dashboards` - For visualization
- `slo-implementation` - For latency SLOs
