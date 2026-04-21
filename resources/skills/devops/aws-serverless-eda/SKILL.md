---
name: aws-serverless-eda
description: "Designs AWS serverless event-driven architectures with core managed services."
metadata:
  context: fork
  skills:
  - aws-mcp-setup
  - aws-cdk-development
  hooks:
    PreToolUse:
    - matcher: Bash(sam deploy*)
      command: aws sts get-caller-identity --query Account --output text
      once: true
origin: lamella
---

# AWS Serverless & Event-Driven Architecture

Use this skill for Lambda-first, event-driven AWS systems. Verify unstable AWS details through the AWS MCP tooling before giving implementation advice or making design calls.

## When to Use

- Designing Lambda, API Gateway, Step Functions, EventBridge, SQS, or SNS flows
- Choosing between synchronous APIs and event-driven processing
- Modeling retries, DLQs, idempotency, and fan-out
- Reviewing a serverless design for scale, resilience, or cost issues

## Core Principles

1. Keep functions single-purpose and small.
2. Design for concurrency spikes, not just average request counts.
3. Keep state in managed services, not local runtime storage.
4. Prefer Step Functions over ad hoc function chaining.
5. Treat duplicate delivery as normal and make handlers idempotent.
6. Use events for decoupling and asynchronous work.

## Core Workflow

1. Confirm the main entry mode: API, event, stream, or schedule.
2. Choose the service boundary and event contract.
3. Define idempotency, retry, timeout, and DLQ behavior.
4. Add observability and failure handling before optimization.
5. Tune concurrency, throughput, and cost only after the flow is correct.

## Common Building Blocks

| Need | Default Choice |
|------|----------------|
| Public HTTP API | API Gateway + Lambda |
| Orchestration | Step Functions |
| Durable async queue | SQS |
| Fan-out event routing | EventBridge or SNS |
| Persistent low-latency state | DynamoDB |
| File-triggered processing | S3 event notifications |

## References

- [references/eda-patterns.md](references/eda-patterns.md)
- [references/serverless-patterns.md](references/serverless-patterns.md)
- [references/deployment-best-practices.md](references/deployment-best-practices.md)
- [references/observability-best-practices.md](references/observability-best-practices.md)
- [references/security-best-practices.md](references/security-best-practices.md)
- [references/performance-optimization.md](references/performance-optimization.md)
