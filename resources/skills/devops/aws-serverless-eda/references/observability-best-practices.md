# Serverless Observability Best Practices

Comprehensive observability patterns for serverless applications based on AWS best practices.

## Table of Contents

- [Three Pillars of Observability](#three-pillars-of-observability)
- [Metrics](#metrics)
- [Logging](#logging)
- [Tracing](#tracing)
- [Unified Observability](#unified-observability)
- [Alerting](#alerting)

## Three Pillars of Observability

### Metrics
**Numeric data measured at intervals (time series)**
- Request rate, error rate, duration
- CPU%, memory%, disk%
- Custom business metrics
- Service Level Indicators (SLIs)

### Logs
**Timestamped records of discrete events**
- Application events and errors
- State transformations
- Debugging information
- Audit trails

### Traces
**Single user's journey across services**
- Request flow through distributed system
- Service dependencies
- Latency breakdown
- Error propagation

## Metrics

### CloudWatch Metrics for Lambda

**Out-of-the-box metrics** (automatically available):
```
- Invocations
- Errors
- Throttles
- Duration
- ConcurrentExecutions
- IteratorAge (for streams)
```

**CDK Configuration**:
```typescript
const fn = new NodejsFunction(this, 'Function', {
  entry: 'src/handler.ts',
});

// Create alarms on metrics
// ... (14 lines trimmed)
  threshold: 1000, // 1 second
  evaluationPeriods: 2,
});
```

### Custom Metrics

**Use CloudWatch Embedded Metric Format (EMF)**:

```typescript
export const handler = async (event: any) => {
  const startTime = Date.now();

  try {
    const result = await processOrder(event);
// ... (35 lines trimmed)
    throw error;
  }
};
```

**Using Lambda Powertools**:

```typescript
import { Metrics, MetricUnits } from '@aws-lambda-powertools/metrics';

const metrics = new Metrics({
  namespace: 'MyApp',
  serviceName: 'OrderService',
// ... (19 lines trimmed)
    metrics.publishStoredMetrics();
  }
};
```

## Logging

### Structured Logging

**Use JSON format for logs**:

```typescript
// ✅ GOOD - Structured JSON logging
export const handler = async (event: any) => {
  console.log(JSON.stringify({
    level: 'INFO',
    message: 'Processing order',
// ... (34 lines trimmed)

// ❌ BAD - Unstructured logging
console.log('Processing order ' + orderId + ' for customer ' + customerId);
```

**Using Lambda Powertools Logger**:

```typescript
import { Logger } from '@aws-lambda-powertools/logger';

const logger = new Logger({
  serviceName: 'OrderService',
  logLevel: 'INFO',
// ... (25 lines trimmed)
    throw error;
  }
};
```

### Log Levels

**Use appropriate log levels**:
- **ERROR**: Errors requiring immediate attention
- **WARN**: Warnings or recoverable errors
- **INFO**: Important business events
- **DEBUG**: Detailed debugging information (disable in production)

```typescript
const logger = new Logger({
  serviceName: 'OrderService',
  logLevel: process.env.LOG_LEVEL || 'INFO',
});

logger.debug('Detailed processing info', { data });
logger.info('Business event occurred', { event });
logger.warn('Recoverable error', { error });
logger.error('Critical failure', { error });
```

### Log Insights Queries

**Common CloudWatch Logs Insights queries**:

```
# Find errors in last hour
fields @timestamp, @message, level, error.message
| filter level = "ERROR"
| sort @timestamp desc
| limit 100
// ... (15 lines trimmed)
fields @timestamp, @message, orderId
| filter customerId = "customer-123"
| sort @timestamp desc
```

## Tracing

### Enable X-Ray Tracing

**Configure X-Ray for Lambda**:

```typescript
const fn = new NodejsFunction(this, 'Function', {
  entry: 'src/handler.ts',
  tracing: lambda.Tracing.ACTIVE, // Enable X-Ray
});

// ... (9 lines trimmed)
  definition,
  tracingEnabled: true,
});
```

**Instrument application code**:

```typescript
import { captureAWSv3Client } from 'aws-xray-sdk-core';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

// Wrap AWS SDK clients
const client = captureAWSv3Client(new DynamoDBClient({}));
// ... (27 lines trimmed)
    throw error;
  }
};
```

**Using Lambda Powertools Tracer**:

```typescript
import { Tracer } from '@aws-lambda-powertools/tracer';

const tracer = new Tracer({ serviceName: 'OrderService' });

export const handler = async (event: any) => {
// ... (11 lines trimmed)

  return result;
};
```

### Service Map

**Visualize service dependencies** with X-Ray:
- Shows service-to-service communication
- Identifies latency bottlenecks
- Highlights error rates between services
- Tracks downstream dependencies

### Distributed Tracing Best Practices

1. **Enable tracing everywhere**: Lambda, API Gateway, Step Functions
2. **Use annotations for filtering**: Indexed fields for queries
3. **Use metadata for details**: Non-indexed detailed information
4. **Sample appropriately**: 100% for low traffic, sampled for high traffic
5. **Correlate with logs**: Include trace ID in log entries

## Unified Observability

### Correlation Between Pillars

**Include trace ID in logs**:

```typescript
export const handler = async (event: any, context: Context) => {
  const traceId = process.env._X_AMZN_TRACE_ID;

  console.log(JSON.stringify({
// ... (5 lines trimmed)
  }));
};
```

### CloudWatch ServiceLens

**Unified view of traces and metrics**:
- Automatically correlates X-Ray traces with CloudWatch metrics
- Shows service map with metrics overlay
- Identifies performance and availability issues
- Provides end-to-end request view

### Lambda Powertools Integration

**All three pillars in one**:

```typescript
import { Logger } from '@aws-lambda-powertools/logger';
import { Tracer } from '@aws-lambda-powertools/tracer';
import { Metrics, MetricUnits } from '@aws-lambda-powertools/metrics';

const logger = new Logger({ serviceName: 'OrderService' });
// ... (31 lines trimmed)
    metrics.publishStoredMetrics();
  }
};
```

## Alerting

### Effective Alerting Strategy

**Alert on what matters**:
- **Critical**: Customer-impacting issues (errors, high latency)
- **Warning**: Approaching thresholds (80% capacity)
- **Info**: Trends and anomalies (cost spikes)

**Alarm fatigue prevention**:
- Tune thresholds based on actual patterns
- Use composite alarms to reduce noise
- Set appropriate evaluation periods
- Include clear remediation steps

### CloudWatch Alarms

**Common alarm patterns**:

```typescript
// Error rate alarm
new cloudwatch.Alarm(this, 'ErrorRateAlarm', {
  metric: new cloudwatch.MathExpression({
    expression: 'errors / invocations * 100',
    usingMetrics: {
// ... (26 lines trimmed)
  evaluationPeriods: 1,
  alarmDescription: 'Approaching concurrency limit',
});
```

### Composite Alarms

**Reduce alert noise**:

```typescript
const errorAlarm = new cloudwatch.Alarm(this, 'Errors', {
  metric: fn.metricErrors(),
  threshold: 10,
  evaluationPeriods: 1,
});
// ... (20 lines trimmed)
  ),
  alarmDescription: 'Overall service health degraded',
});
```

## Dashboard Best Practices

### Service Dashboard Layout

**Recommended sections**:

1. **Overview**:
   - Total invocations
   - Error rate percentage
   - P50, P95, P99 latency
   - Availability percentage

2. **Resource Utilization**:
   - Concurrent executions
   - Memory utilization
   - Duration distribution
   - Throttles

3. **Business Metrics**:
   - Orders processed
   - Revenue per minute
   - Customer activity
   - Feature usage

4. **Errors and Alerts**:
   - Error count by type
   - Active alarms
   - DLQ message count
   - Failed transactions

### CloudWatch Dashboard CDK

```typescript
const dashboard = new cloudwatch.Dashboard(this, 'ServiceDashboard', {
  dashboardName: 'order-service',
});

dashboard.addWidgets(
// ... (37 lines trimmed)
    ],
  })
);
```

## Monitoring Serverless Architectures

### End-to-End Monitoring

**Monitor the entire flow**:

```
API Gateway → Lambda → DynamoDB → EventBridge → Lambda
     ↓           ↓          ↓            ↓           ↓
  Metrics    Traces     Metrics      Metrics     Logs
```

**Key metrics per service**:

| Service | Key Metrics |
|---------|-------------|
| API Gateway | Count, 4XXError, 5XXError, Latency, CacheHitCount |
| Lambda | Invocations, Errors, Duration, Throttles, ConcurrentExecutions |
| DynamoDB | ConsumedReadCapacity, ConsumedWriteCapacity, UserErrors, SystemErrors |
| SQS | NumberOfMessagesSent, NumberOfMessagesReceived, ApproximateAgeOfOldestMessage |
| EventBridge | Invocations, FailedInvocations, TriggeredRules |
| Step Functions | ExecutionsStarted, ExecutionsFailed, ExecutionTime |

### Synthetic Monitoring

**Use CloudWatch Synthetics for API monitoring**:

```typescript
import { Canary, Test, Code, Schedule } from '@aws-cdk/aws-synthetics-alpha';

new Canary(this, 'ApiCanary', {
  canaryName: 'api-health-check',
  schedule: Schedule.rate(Duration.minutes(5)),
// ... (18 lines trimmed)
  }),
  runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_6_2,
});
```

## OpenTelemetry Integration

### Amazon Distro for OpenTelemetry (ADOT)

**Use ADOT for vendor-neutral observability**:

```typescript
// Lambda Layer with ADOT
const adotLayer = lambda.LayerVersion.fromLayerVersionArn(
  this,
  'AdotLayer',
  `arn:aws:lambda:${this.region}:901920570463:layer:aws-otel-nodejs-amd64-ver-1-18-1:4`
// ... (8 lines trimmed)
    OPENTELEMETRY_COLLECTOR_CONFIG_FILE: '/var/task/collector.yaml',
  },
});
```

**Benefits of ADOT**:
- Vendor-neutral (works with Datadog, New Relic, Honeycomb, etc.)
- Automatic instrumentation
- Consistent format across services
- Export to multiple backends

## Best Practices Summary

### Metrics
- ✅ Use CloudWatch Embedded Metric Format (EMF)
- ✅ Track business metrics, not just technical metrics
- ✅ Set alarms on error rate, latency, and throughput
- ✅ Use p99 for latency, not average
- ✅ Create dashboards for key services

### Logging
- ✅ Use structured JSON logging
- ✅ Include correlation IDs (request ID, trace ID)
- ✅ Use appropriate log levels
- ✅ Never log sensitive data (PII, secrets)
- ✅ Use CloudWatch Logs Insights for analysis

### Tracing
- ✅ Enable X-Ray tracing on all services
- ✅ Instrument AWS SDK calls
- ✅ Add custom annotations for business context
- ✅ Use service map to understand dependencies
- ✅ Correlate traces with logs and metrics

### Alerting
- ✅ Alert on customer-impacting issues
- ✅ Tune thresholds to reduce false positives
- ✅ Use composite alarms to reduce noise
- ✅ Include clear remediation steps
- ✅ Escalate critical alarms appropriately

### Tools
- ✅ Use Lambda Powertools for unified observability
- ✅ Use CloudWatch ServiceLens for service view
- ✅ Use Synthetics for proactive monitoring
- ✅ Consider ADOT for vendor-neutral observability
