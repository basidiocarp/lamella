# Monitoring and Observability Patterns

Use these patterns when the user is setting up alarms, interpreting CloudWatch signals, or tracing down latency and reliability problems.

## Pattern 1: Critical service monitoring

**When**: Every production-facing service.

**MCP server**: CloudWatch MCP

**Monitor these signal groups**:
- availability: health checks and uptime
- performance: p95 and p99 latency
- errors: failure rate and timeouts
- saturation: CPU, memory, disk, and queue depth

**Typical alarm thresholds**:
- error rate above 1 percent for 2 periods
- p99 latency above 1 second for 5 minutes
- CPU above 80 percent for 10 minutes
- memory above 85 percent for 5 minutes

## Pattern 2: Service-specific monitoring

**Lambda**:
- Invocations
- Errors
- Duration
- Throttles
- ConcurrentExecutions
- IteratorAge for stream consumers

**API Gateway**:
- Count
- 4XXError and 5XXError
- Latency percentiles
- IntegrationLatency
- CacheHitCount and CacheMissCount

**RDS**:
- CPUUtilization
- DatabaseConnections
- FreeableMemory
- ReadLatency and WriteLatency
- FreeStorageSpace

**DynamoDB**:
- ConsumedReadCapacityUnits
- ConsumedWriteCapacityUnits
- UserErrors
- SystemErrors
- ThrottledRequests

## Pattern 3: Logs and trace review

**MCP servers**: CloudWatch MCP, CloudWatch Application Signals MCP

**Log Insights starter queries**:
```text
# Recent errors
fields @timestamp, @message
| filter @message like /ERROR/
| sort @timestamp desc
| limit 50

# Error count by service
fields service_name, level
| filter level = "error"
| stats count() as error_count by service_name

# p99 latency by service
stats percentile(duration, 99) by service_name
```

**Tracing checks**:
1. Pull the service map.
2. Identify the slowest downstream edge.
3. Compare the latency spike to recent deploys and dependency changes.
4. Confirm whether the bottleneck is app code, data store, or network path.

## Pattern 4: Custom metrics

Use custom metrics when AWS defaults do not expose the KPI that matters, such as:
- orders per minute
- queue depth per tenant
- cache hit ratio
- revenue or job throughput

**Rules**:
- keep namespaces consistent
- add useful dimensions such as environment or version
- publish on an interval that matches the alerting need
- avoid high-cardinality labels unless there is a clear use case
