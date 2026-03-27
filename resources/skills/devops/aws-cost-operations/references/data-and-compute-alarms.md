# CloudWatch Alarms for DynamoDB, EC2, and RDS

These alarms cover stateful and instance-oriented AWS services where capacity,
health, and exhaustion signals matter most.

## DynamoDB

```typescript
new cloudwatch.Alarm(this, 'DynamoDBReadThrottleAlarm', {
  metric: table.metricUserErrors({
    dimensions: { Operation: 'GetItem' },
    statistic: 'Sum',
    period: Duration.minutes(5),
  }),
  threshold: 5,
  evaluationPeriods: 1,
  alarmDescription: 'DynamoDB read operations being throttled',
});
```

```typescript
new cloudwatch.Alarm(this, 'DynamoDBWriteThrottleAlarm', {
  metric: table.metricUserErrors({
    dimensions: { Operation: 'PutItem' },
    statistic: 'Sum',
    period: Duration.minutes(5),
  }),
  threshold: 5,
  evaluationPeriods: 1,
  alarmDescription: 'DynamoDB write operations being throttled',
});
```

```typescript
new cloudwatch.Alarm(this, 'DynamoDBCapacityAlarm', {
  metric: table.metricConsumedReadCapacityUnits({
    statistic: 'Sum',
    period: Duration.minutes(5),
  }),
  threshold: provisionedCapacity * 0.8,
  evaluationPeriods: 2,
  alarmDescription: 'DynamoDB consumed capacity approaching limit',
});
```

## EC2

```typescript
new cloudwatch.Alarm(this, 'EC2CpuAlarm', {
  metric: new cloudwatch.Metric({
    namespace: 'AWS/EC2',
    metricName: 'CPUUtilization',
    dimensionsMap: { InstanceId: instance.instanceId },
    statistic: 'Average',
    period: Duration.minutes(5),
  }),
  threshold: 80,
  evaluationPeriods: 2,
  alarmDescription: 'EC2 CPU utilization high',
});
```

```typescript
new cloudwatch.Alarm(this, 'EC2StatusCheckAlarm', {
  metric: new cloudwatch.Metric({
    namespace: 'AWS/EC2',
    metricName: 'StatusCheckFailed',
    dimensionsMap: { InstanceId: instance.instanceId },
    statistic: 'Maximum',
    period: Duration.minutes(5),
  }),
  threshold: 1,
  evaluationPeriods: 1,
  alarmDescription: 'EC2 status check failed',
});
```

```typescript
new cloudwatch.Alarm(this, 'EC2DiskAlarm', {
  metric: new cloudwatch.Metric({
    namespace: 'CWAgent',
    metricName: 'disk_used_percent',
    dimensionsMap: { InstanceId: instance.instanceId, path: '/' },
    statistic: 'Average',
    period: Duration.minutes(5),
  }),
  threshold: 85,
  evaluationPeriods: 2,
  alarmDescription: 'EC2 disk space usage high',
});
```

## RDS

```typescript
new cloudwatch.Alarm(this, 'RDSCpuAlarm', {
  metric: new cloudwatch.Metric({
    namespace: 'AWS/RDS',
    metricName: 'CPUUtilization',
    dimensionsMap: { DBInstanceIdentifier: db.instanceIdentifier },
    statistic: 'Average',
    period: Duration.minutes(5),
  }),
  threshold: 80,
  evaluationPeriods: 2,
  alarmDescription: 'RDS CPU utilization high',
});
```

```typescript
new cloudwatch.Alarm(this, 'RDSConnectionAlarm', {
  metric: new cloudwatch.Metric({
    namespace: 'AWS/RDS',
    metricName: 'DatabaseConnections',
    dimensionsMap: { DBInstanceIdentifier: db.instanceIdentifier },
    statistic: 'Average',
    period: Duration.minutes(5),
  }),
  threshold: 0.8 * maxConnections,
  evaluationPeriods: 2,
  alarmDescription: 'RDS connection count approaching limit',
});
```

```typescript
new cloudwatch.Alarm(this, 'RDSStorageAlarm', {
  metric: new cloudwatch.Metric({
    namespace: 'AWS/RDS',
    metricName: 'FreeStorageSpace',
    dimensionsMap: { DBInstanceIdentifier: db.instanceIdentifier },
    statistic: 'Minimum',
    period: Duration.minutes(5),
  }),
  threshold: 10 * 1024 * 1024 * 1024,
  evaluationPeriods: 2,
  alarmDescription: 'RDS free storage space low',
});
```

## Rules

- Use separate alarms for throttling, saturation, and hard failure.
- Tie thresholds to known service limits or expected operating bands.
- Prefer minimum free-space alarms for storage exhaustion and average alarms for
  CPU or connection pressure.
