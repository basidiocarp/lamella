# Serverless Observability Best Practices

Observability in serverless systems must connect logs, metrics, traces, and event identifiers across short-lived compute and asynchronous boundaries.

## What to Capture

For each Lambda or event consumer, capture:
- request or event ID
- correlation ID
- function name and version
- downstream dependency timing
- outcome and error class

## Logs

Prefer structured logs:

```json
{
  "level": "INFO",
  "service": "order-handler",
  "requestId": "abc-123",
  "correlationId": "corr-789",
  "status": "processed"
}
```

Rules:
- do not log secrets
- keep event identifiers stable across retries
- log the business outcome, not only the technical action

## Metrics

Track at least:
- invocation count
- error count
- duration
- throttles
- DLQ depth or failure counts
- queue lag / age where applicable

Service metrics matter more than just raw Lambda runtime metrics.

## Tracing

Enable tracing when:
- requests hop across Lambda, EventBridge, SQS, DynamoDB, and Step Functions
- latency or failure attribution is hard

Trace goals:
- identify which hop failed
- measure where latency accumulates
- correlate retries and duplicates

## Event Correlation

Carry a correlation ID through:
- API entrypoint
- emitted events
- downstream functions
- workflow executions

Without this, async debugging becomes guesswork.

## Alerting

Alert on:
- sustained function errors
- concurrency throttles
- queue backlog or age growth
- DLQ activity
- failed workflow executions

Avoid paging on:
- isolated transient retries
- raw log volume spikes without service impact

## Dashboards

Build views for:
- request path health
- async pipeline health
- per-function latency and error rate
- queue and DLQ state
- business event completion rates

## Default Rule

```text
Logs explain what happened
Metrics show how often and how badly
Traces show where it broke
Correlation IDs tie the story together
```
