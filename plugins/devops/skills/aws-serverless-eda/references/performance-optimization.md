# Serverless Performance Optimization

Optimize AWS serverless systems by reducing cold-start cost, limiting unnecessary work, and designing for asynchronous scale where it helps.

## Lambda Performance Priorities

Focus on:
- package size
- initialization time
- memory sizing
- downstream latency

These usually matter more than micro-optimizing handler code.

## Cold Start Reduction

Use:
- smaller deployment packages
- fewer runtime dependencies
- runtime-appropriate memory sizing
- provisioned concurrency only for latency-sensitive paths

Avoid:
- bundling unnecessary libraries
- loading large SDK clients repeatedly inside the handler body

## Memory and CPU Tuning

Lambda memory also affects CPU allocation. Measure cost and latency together.

Practical rule:
- increase memory for CPU-bound or initialization-heavy functions
- keep a smaller footprint for lightly used async processors

## Batch and Queue Tuning

For queue consumers, tune:
- batch size
- visibility timeout
- reserved concurrency
- retry and DLQ settings

This controls throughput and protects downstream systems from floods.

## API Performance

For API-facing serverless paths:
- validate input early
- cache safe reads where appropriate
- avoid synchronous fan-out to many dependencies
- move slow work behind queues or workflows

## Event Pipeline Performance

Prefer:
- EventBridge for flexible routing
- SQS for backpressure and retry control
- Step Functions for long workflows instead of chained Lambdas

Use asynchronous buffering when end-user latency does not require immediate completion.

## Data and Dependency Efficiency

Reduce repeated work by:
- reusing SDK clients outside the handler
- minimizing over-fetching from DynamoDB or external APIs
- writing event payloads with only necessary fields

## Measurement

Track:
- cold vs warm latency
- p95 / p99 duration
- downstream call latency
- queue age and backlog
- cost per invocation or per completed workflow

## Default Optimization Rule

```text
Shrink packages
Tune memory with data, not instinct
Buffer slow work asynchronously
Protect downstreams with queue and concurrency controls
Measure latency and cost together
```
