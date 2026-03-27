# CloudWatch Alarms for ECS and SQS

These alarms cover service health and backlog behavior for containerized and
queue-based workloads.

## ECS

```typescript
new cloudwatch.Alarm(this, 'ECSTaskCountAlarm', {
  metric: new cloudwatch.Metric({
    namespace: 'ECS/ContainerInsights',
    metricName: 'RunningTaskCount',
    dimensionsMap: {
      ClusterName: cluster.clusterName,
      ServiceName: service.serviceName,
    },
    statistic: 'Minimum',
    period: Duration.minutes(5),
  }),
  threshold: 1,
  evaluationPeriods: 2,
  alarmDescription: 'ECS service has no running tasks',
});
```

```typescript
new cloudwatch.Alarm(this, 'ECSCpuAlarm', {
  metric: new cloudwatch.Metric({
    namespace: 'AWS/ECS',
    metricName: 'CPUUtilization',
    dimensionsMap: {
      ClusterName: cluster.clusterName,
      ServiceName: service.serviceName,
    },
    statistic: 'Average',
    period: Duration.minutes(5),
  }),
  threshold: 80,
  evaluationPeriods: 2,
  alarmDescription: 'ECS service CPU utilization high',
});
```

```typescript
new cloudwatch.Alarm(this, 'ECSMemoryAlarm', {
  metric: new cloudwatch.Metric({
    namespace: 'AWS/ECS',
    metricName: 'MemoryUtilization',
    dimensionsMap: {
      ClusterName: cluster.clusterName,
      ServiceName: service.serviceName,
    },
    statistic: 'Average',
    period: Duration.minutes(5),
  }),
  threshold: 85,
  evaluationPeriods: 2,
  alarmDescription: 'ECS service memory utilization high',
});
```

## SQS

```typescript
new cloudwatch.Alarm(this, 'SQSDepthAlarm', {
  metric: queue.metricApproximateNumberOfMessagesVisible({
    statistic: 'Maximum',
    period: Duration.minutes(5),
  }),
  threshold: 1000,
  evaluationPeriods: 2,
  alarmDescription: 'SQS queue depth exceeded threshold',
});
```

```typescript
new cloudwatch.Alarm(this, 'SQSAgeAlarm', {
  metric: queue.metricApproximateAgeOfOldestMessage({
    statistic: 'Maximum',
    period: Duration.minutes(5),
  }),
  threshold: 300,
  evaluationPeriods: 2,
  alarmDescription: 'Oldest SQS message age exceeded threshold',
});
```

## Rules

- Use task-count alarms as hard availability signals for ECS services.
- Pair ECS CPU and memory alarms with queue-depth or request-rate alarms when
  the service is load driven.
- For SQS, backlog depth and message age should usually be monitored together.
