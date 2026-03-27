# CloudWatch Alarms for Lambda and API Gateway

These alarms cover the failure and latency patterns most common in serverless
request paths.

## Lambda

### Error Alarm

```typescript
new cloudwatch.Alarm(this, 'LambdaErrorAlarm', {
  metric: lambdaFunction.metricErrors({
    statistic: 'Sum',
    period: Duration.minutes(5),
  }),
  threshold: 10,
  evaluationPeriods: 1,
  treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
  alarmDescription: 'Lambda error count exceeded threshold',
});
```

### Duration Alarm

```typescript
new cloudwatch.Alarm(this, 'LambdaDurationAlarm', {
  metric: lambdaFunction.metricDuration({
    statistic: 'Maximum',
    period: Duration.minutes(5),
  }),
  threshold: lambdaFunction.timeout.toMilliseconds() * 0.8,
  evaluationPeriods: 2,
  alarmDescription: 'Lambda duration approaching timeout',
});
```

### Throttle and Concurrency Alarms

```typescript
new cloudwatch.Alarm(this, 'LambdaThrottleAlarm', {
  metric: lambdaFunction.metricThrottles({
    statistic: 'Sum',
    period: Duration.minutes(5),
  }),
  threshold: 5,
  evaluationPeriods: 1,
  alarmDescription: 'Lambda function is being throttled',
});
```

```typescript
new cloudwatch.Alarm(this, 'LambdaConcurrencyAlarm', {
  metric: new cloudwatch.Metric({
    namespace: 'AWS/Lambda',
    metricName: 'ConcurrentExecutions',
    statistic: 'Maximum',
    period: Duration.minutes(5),
  }),
  threshold: 900,
  evaluationPeriods: 2,
  alarmDescription: 'Lambda concurrent executions high',
});
```

## API Gateway

### 5XX and 4XX Alarms

```typescript
new cloudwatch.Alarm(this, 'Api5xxAlarm', {
  metric: api.metricServerError({
    statistic: 'Sum',
    period: Duration.minutes(5),
  }),
  threshold: 10,
  evaluationPeriods: 1,
  alarmDescription: 'API Gateway 5XX errors exceeded threshold',
});
```

```typescript
new cloudwatch.Alarm(this, 'Api4xxAlarm', {
  metric: api.metricClientError({
    statistic: 'Sum',
    period: Duration.minutes(5),
  }),
  threshold: 50,
  evaluationPeriods: 2,
  alarmDescription: 'API Gateway 4XX errors exceeded threshold',
});
```

### Latency Alarm

```typescript
new cloudwatch.Alarm(this, 'ApiLatencyAlarm', {
  metric: api.metricLatency({
    statistic: 'p99',
    period: Duration.minutes(5),
  }),
  threshold: 2000,
  evaluationPeriods: 2,
  alarmDescription: 'API Gateway p99 latency exceeded threshold',
});
```

## Rules

- Error alarms should usually page faster than cost or optimization alarms.
- Tie Lambda duration alarms to configured timeout, not a hardcoded millisecond
  number.
- Separate client-error and server-error thresholds for API Gateway.
