# AgentCore Observability Service

Use this service guide when tracing, monitoring, or debugging Bedrock AgentCore workloads in production.

## What It Covers

- distributed tracing across AgentCore services
- metrics for latency, errors, throughput, and token cost
- centralized structured logging
- dashboards and alerts
- OpenTelemetry-compatible instrumentation

## Core Workflow

1. Enable tracing, metrics, and logs for the target agent.
2. Confirm correlation and context propagation across service boundaries.
3. Start with traces for request-level debugging.
4. Use metrics for trend, burn, and capacity analysis.
5. Add alerts only after the signal is stable and actionable.

## Useful Commands

```shell
aws xray get-trace-summaries --start-time <START> --end-time <END>
aws xray batch-get-traces --trace-ids <TRACE_ID>
aws cloudwatch get-metric-statistics --namespace AWS/BedrockAgentCore --metric-name TargetInvocations
```

## Watch For

- high tail latency
- rising token spend without output quality gain
- retry storms or correlated service errors
- logs without stable correlation IDs
