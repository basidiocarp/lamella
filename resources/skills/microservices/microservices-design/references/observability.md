# Observability in Microservices

Comprehensive guide for monitoring, tracing, and debugging distributed systems.

## The Three Pillars

### 1. Metrics

**Purpose:** Quantitative measurements of system behavior over time.

**Categories:**

**Business Metrics:**
```
Examples:
- Orders per minute
- Revenue per hour
- Active users
- Conversion rate
// ... (22 lines trimmed)
# In code
orders_total.labels(status='completed', payment_method='credit_card').inc()
order_value.observe(order.total_amount)
```

**System Metrics:**
```
Infrastructure:
- CPU usage
- Memory usage
- Disk I/O
- Network throughput
// ... (16 lines trimmed)
- Message processing rate
- Consumer lag
- Dead letter queue size
```

**The Four Golden Signals (Google SRE):**
```
1. Latency:
   - Time to serve requests
   - Track p50, p95, p99, p99.9
   - Separate success vs error latency

// ... (34 lines trimmed)
       'db_connection_pool_active',
       'Active database connections'
   )
```

**RED Method (for services):**
```
- Rate: Requests per second
- Errors: Failed requests per second
- Duration: Request latency distribution

Perfect for microservices dashboards
```

**USE Method (for resources):**
```
- Utilization: Percentage of time resource busy
- Saturation: Queue depth or waiting threads
- Errors: Error count

Perfect for infrastructure monitoring
```

### 2. Logs

**Purpose:** Discrete event records with context.

**Structured Logging:**
```json
{
  "timestamp": "2025-12-14T15:30:45.123Z",
  "level": "INFO",
  "service": "order-service",
  "version": "1.2.3",
// ... (9 lines trimmed)
  "method": "POST",
  "statusCode": 201
}
```

**Log Levels:**
```
ERROR:
- Application errors
- Failed operations
- Exceptions
Use: Alerts, immediate attention
// ... (18 lines trimmed)
TRACE:
- Very detailed debugging
Use: Deep troubleshooting (disabled in production usually)
```

**Correlation IDs:**
```
Request flow across services:

Client Request → API Gateway
                 ↓ (correlationId: corr-123)
                 Order Service
// ... (23 lines trimmed)
    response = await call_next(request)
    response.headers['X-Correlation-ID'] = correlation_id
    return response
```

**Log Aggregation:**
```
Services → Log Shipper → Centralized Log Storage → Visualization

Tools:
- ELK Stack (Elasticsearch, Logstash, Kibana)
- EFK Stack (Elasticsearch, Fluentd, Kibana)
// ... (10 lines trimmed)

# Find requests with specific correlation ID
correlationId:"corr-123"
```

### 3. Distributed Tracing

**Purpose:** Visualize request flow across services, identify bottlenecks.

**Concepts:**

**Trace:**
```
Entire request journey across all services

Example: User places order
Trace ID: trace-abc123
// ... (7 lines trimmed)

Total: 200ms (some parallel execution)
```

**Span:**
```
Single operation within a trace

Span attributes:
{
  "traceId": "trace-abc123",
// ... (23 lines trimmed)
    }
  ]
}
```

**Implementation (OpenTelemetry):**
```python
from opentelemetry import trace
from opentelemetry.exporter.jaeger.thrift import JaegerExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
// ... (29 lines trimmed)
            result = await payment_service.charge(order_id, order_data.total)

        return order_id
```

**Trace Visualization:**
```
Jaeger UI shows:

Timeline view:
|-- api-gateway (200ms) ----------------------------------|
// ... (7 lines trimmed)
Bottlenecks identified (payment-service taking 80ms)
Parallel operations visible
```

**Sampling Strategies:**
```
Problem: Tracing every request is expensive

Solutions:

1. Probabilistic Sampling:
// ... (37 lines trimmed)

        # Sample 1% of others
        return ParentBasedTraceIdRatioBased(0.01).should_sample(...)
```

## Service Level Objectives (SLOs)

### Defining SLOs

**SLI (Service Level Indicator):**
```
Quantitative measure of service level

Examples:
- Request latency: p99 < 200ms
- Availability: 99.9% of requests succeed
- Throughput: Handle 10,000 requests/sec
```

**SLO (Service Level Objective):**
```
Target value for SLI

Examples:
- 99.9% of requests complete in < 200ms
// ... (5 lines trimmed)
- Target: Threshold (99.9%, 200ms)
- Time window: Evaluation period (30 days, weekly)
```

**SLA (Service Level Agreement):**
```
Contract with consequences if SLO not met

Example:
- SLO: 99.9% availability
- SLA: If availability < 99.9%, customers get 10% credit

SLA ≤ SLO (leave buffer for incidents)
```

**Error Budget:**
```
Allowed failure to meet SLO = (100% - SLO target)

Example:
SLO: 99.9% availability
Error budget: 0.1% = 43.8 minutes downtime per month
// ... (12 lines trimmed)
- Balances innovation vs stability
- Data-driven deployment decisions
- Aligns engineering priorities
```

### Implementing SLO Monitoring

**Prometheus + Grafana:**
```
# SLI: Availability
availability_sli = (
    sum(rate(http_requests_total{status!~"5.."}[30d]))
    /
    sum(rate(http_requests_total[30d]))
// ... (18 lines trimmed)
annotations:
  summary: "Error budget critically low"
  description: "Only 10% error budget remaining. Freeze deployments."
```

## Alerting Strategies

### Alert Levels

**Critical (Page immediately):**
```
Conditions:
- Service completely down
- Error rate > 50%
- Data loss occurring
- SLO burn rate critical
// ... (8 lines trimmed)
expr: up{service="payment-service"} == 0
for: 1m
severity: critical
```

**Warning (Investigate soon):**
```
Conditions:
- Elevated error rate (5-10%)
- Latency degraded (p99 > 500ms)
- Queue depth increasing
- Error budget < 25%
// ... (8 lines trimmed)
expr: rate(http_requests_total{status="500"}[5m]) > 0.05
for: 10m
severity: warning
```

**Info (Awareness):**
```
Conditions:
- Deployment completed
- Scaling event
- Configuration changed
- Capacity threshold reached

Actions:
- Log to monitoring system
- Dashboard annotation
- Optional Slack notification
```

### Alert Best Practices

**Actionable Alerts:**
```
Bad Alert:
"High CPU usage"

Good Alert:
// ... (9 lines trimmed)
✓ Runbook link
✓ Suggested actions
```

**Avoid Alert Fatigue:**
```
Problems:
- Too many alerts
- False positives
- Non-actionable alerts
- Duplicate alerts
// ... (11 lines trimmed)
group_by: [service]  # Aggregate per service
group_wait: 30s  # Wait before sending
group_interval: 5m  # Batch notifications
```

## Observability Stack

### Recommended Tools

**Metrics:**
```
Collection: Prometheus
- Pull-based metrics
- Time-series database
- Powerful query language (PromQL)
// ... (7 lines trimmed)

Alternative: Datadog, New Relic, CloudWatch
```

**Logs:**
```
Aggregation: ELK Stack
- Elasticsearch (storage & search)
- Logstash / Fluentd (collection)
- Kibana (visualization)
// ... (5 lines trimmed)

Alternative: Splunk, Datadog, CloudWatch Logs
```

**Tracing:**
```
Backend: Jaeger or Zipkin
- Trace storage
- Trace visualization
- Dependency graphs
// ... (7 lines trimmed)

Alternative: Datadog APM, New Relic, Lightstep
```

**All-in-One:**
```
Observability platforms:
- Datadog (metrics, logs, traces, RUM)
- New Relic (APM, logs, infrastructure)
- Dynatrace (auto-instrumentation, AI)
// ... (8 lines trimmed)
- Higher cost
- Less flexibility
```

### Implementation Checklist

**For Each Service:**
```
✓ Structured logging with correlation IDs
✓ Metrics exported (Prometheus format)
✓ Distributed tracing instrumented
✓ Health check endpoints (/health/live, /health/ready)
✓ Graceful shutdown handling
✓ Resource limits set (CPU, memory)
✓ Alerts configured for critical paths
✓ Dashboards created
✓ Runbooks documented
✓ On-call rotation established
```

**For System-Wide:**
```
✓ Centralized log aggregation
✓ Distributed tracing backend
✓ Metrics aggregation and storage
✓ Unified dashboards (service overview)
✓ Alert routing configured
✓ Incident management process
✓ Post-mortem template
✓ SLO definitions and tracking
✓ Dependency mapping
✓ Chaos engineering experiments
```

## Troubleshooting Workflow

**Incident Response:**
```
1. Detect (Alert fires)
   - Check dashboard
   - Verify alert is valid
   - Assess impact

// ... (27 lines trimmed)
   - Root cause analysis
   - Action items
   - Update runbooks
```

**Using Traces to Debug:**
```
Scenario: API returning 500 errors

1. Find failing trace:
   - Filter: status = error, service = api-gateway
   - Sort by timestamp (most recent)
// ... (17 lines trimmed)
   - Rollback order-service
   - Verify errors stopped
   - Create ticket for bug fix
```

## Summary

Observability is non-negotiable in microservices:

**Must-Haves:**
- Structured logging with correlation IDs
- Metrics (RED/USE methodology)
- Distributed tracing (OpenTelemetry)
- Centralized log aggregation
- SLO tracking with error budgets
- Actionable alerts with runbooks

**Best Practices:**
- Correlate metrics, logs, and traces
- Define SLOs based on user experience
- Alert on symptoms, not causes
- Maintain runbooks for common issues
- Regular post-mortems and learning
- Practice incident response with game days

Without observability, you're flying blind in production.
