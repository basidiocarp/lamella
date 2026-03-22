---
name: aws-serverless-eda
description: AWS serverless and event-driven architecture. Lambda, API Gateway, DynamoDB, Step Functions, EventBridge, SQS, SNS patterns. Use when designing AWS serverless architectures, implementing Lambda/API Gateway, or building event-driven systems with EventBridge/SQS/SNS.
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
---
# AWS Serverless & Event-Driven Architecture


## Contents

- [AWS Documentation Requirement](#aws-documentation-requirement)
- [Serverless MCP Servers](#serverless-mcp-servers)
- [When to Use This Skill](#when-to-use-this-skill)
- [AWS Well-Architected Serverless Design Principles](#aws-well-architected-serverless-design-principles)
  - [1. Speedy, Simple, Singular](#1-speedy-simple-singular)
  - [2. Think Concurrent Requests, Not Total Requests](#2-think-concurrent-requests-not-total-requests)
  - [3. Share Nothing](#3-share-nothing)
  - [4. Assume No Hardware Affinity](#4-assume-no-hardware-affinity)
  - [5. Orchestrate with State Machines, Not Function Chaining](#5-orchestrate-with-state-machines-not-function-chaining)
  - [6. Use Events to Trigger Transactions](#6-use-events-to-trigger-transactions)
  - [7. Design for Failures and Duplicates](#7-design-for-failures-and-duplicates)
- [Architecture Patterns](#architecture-patterns)
  - [Event-Driven Architecture Patterns](#event-driven-architecture-patterns)
  - [Serverless Architecture Patterns](#serverless-architecture-patterns)
- [Best Practices](#best-practices)
  - [Error Handling](#error-handling)
  - [Dead Letter Queues](#dead-letter-queues)
  - [Observability](#observability)
- [Using MCP Servers Effectively](#using-mcp-servers-effectively)
- [Additional Resources](#additional-resources)


This skill provides comprehensive guidance for building serverless applications and event-driven architectures on AWS based on Well-Architected Framework principles.

## AWS Documentation Requirement

Always verify AWS facts using MCP tools (`mcp__aws-mcp__*` or `mcp__*awsdocs*__*`) before answering. The `aws-mcp-setup` dependency is auto-loaded — if MCP tools are unavailable, guide the user through that skill's setup flow.

## Serverless MCP Servers

This skill leverages the CDK MCP server (provided via `aws-cdk-development` dependency) and AWS Documentation MCP for serverless guidance.

> **Note**: The following AWS MCP servers are available separately via the Full AWS MCP Server (see `aws-mcp-setup` skill) and are not bundled with this plugin:
> - AWS Serverless MCP — SAM CLI lifecycle (init, deploy, local test)
> - AWS Lambda Tool MCP — Direct Lambda invocation
> - AWS Step Functions MCP — Workflow orchestration
> - Amazon SNS/SQS MCP — Messaging and queue management

## When to Use This Skill

Use this skill when:
- Building serverless applications with Lambda
- Designing event-driven architectures
- Implementing microservices patterns
- Creating asynchronous processing workflows
- Orchestrating multi-service transactions
- Building real-time data processing pipelines
- Implementing saga patterns for distributed transactions
- Designing for scale and resilience

## AWS Well-Architected Serverless Design Principles

### 1. Speedy, Simple, Singular

**Functions should be concise and single-purpose**

```typescript
// ✅ GOOD - Single purpose, focused function
export const processOrder = async (event: OrderEvent) => {
  // Only handles order processing
  const order = await validateOrder(event);
// ... (8 lines trimmed)
  // Too many responsibilities
};
```

**Keep functions environmentally efficient and cost-aware**:
- Minimize cold start times
- Optimize memory allocation
- Use provisioned concurrency only when needed
- Leverage connection reuse

### 2. Think Concurrent Requests, Not Total Requests

**Design for concurrency, not volume**

Lambda scales horizontally - design considerations should focus on:
- Concurrent execution limits
- Downstream service throttling
- Shared resource contention
- Connection pool sizing

```typescript
// Consider concurrent Lambda executions accessing DynamoDB
const table = new dynamodb.Table(this, 'Table', {
  billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // Auto-scales with load
});
// ... (9 lines trimmed)
table.autoScaleReadCapacity({ minCapacity: 5, maxCapacity: 100 });
table.autoScaleWriteCapacity({ minCapacity: 5, maxCapacity: 100 });
```

### 3. Share Nothing

**Function runtime environments are short-lived**

```typescript
// ❌ BAD - Relying on local file system
export const handler = async (event: any) => {
  fs.writeFileSync('/tmp/data.json', JSON.stringify(data)); // Lost after execution
};
// ... (7 lines trimmed)
  });
};
```

**State management**:
- Use DynamoDB for persistent state
- Use Step Functions for workflow state
- Use ElastiCache for session state
- Use S3 for file storage

### 4. Assume No Hardware Affinity

**Applications must be hardware-agnostic**

Infrastructure can change without notice:
- Lambda functions can run on different hardware
- Container instances can be replaced
- No assumption about underlying infrastructure

**Design for portability**:
- Use environment variables for configuration
- Avoid hardware-specific optimizations
- Test across different environments

### 5. Orchestrate with State Machines, Not Function Chaining

**Use Step Functions for orchestration**

```typescript
// ❌ BAD - Lambda function chaining
export const handler1 = async (event: any) => {
  const result = await processStep1(event);
  await lambda.invoke({
    FunctionName: 'handler2',
// ... (9 lines trimmed)
    .next(shipOrder)
    .next(sendConfirmation),
});
```

**Benefits of Step Functions**:
- Visual workflow representation
- Built-in error handling and retries
- Execution history and debugging
- Parallel and sequential execution
- Service integrations without code

### 6. Use Events to Trigger Transactions

**Event-driven over synchronous request/response**

```typescript
// Pattern: Event-driven processing
const bucket = new s3.Bucket(this, 'DataBucket');

bucket.addEventNotification(
  s3.EventType.OBJECT_CREATED,
// ... (10 lines trimmed)
});

rule.addTarget(new targets.LambdaFunction(processOrderFunction));
```

**Benefits**:
- Loose coupling between services
- Asynchronous processing
- Better fault tolerance
- Independent scaling

### 7. Design for Failures and Duplicates

**Operations must be idempotent**

```typescript
// ✅ GOOD - Idempotent operation
export const handler = async (event: SQSEvent) => {
  for (const record of event.Records) {
    const orderId = JSON.parse(record.body).orderId;

// ... (18 lines trimmed)
    });
  }
};
```

**Implement retry logic with exponential backoff**:
```typescript
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
// ... (5 lines trimmed)
  throw new Error('Max retries exceeded');
}
```

## Architecture Patterns

For detailed implementation patterns with full code examples, see the reference documentation:

### Event-Driven Architecture Patterns
**File**: `references/eda-patterns.md`
- Event Router with EventBridge (custom event bus, schema registry, rule-based routing)
- Queue-Based Processing with SQS (standard/FIFO, DLQ, Lambda consumers)
- Pub/Sub Fan-Out with SNS + SQS (multi-consumer, filtering)
- Saga Pattern with Step Functions (distributed transactions, compensating actions)
- Event Sourcing with DynamoDB Streams (append-only event store, projections)

### Serverless Architecture Patterns
**File**: `references/serverless-patterns.md`
- API-Driven Microservices (REST API + Lambda backend)
- Stream Processing with Kinesis (real-time, batch windowing, bisect on error)
- Async Task Processing with SQS (background jobs, concurrency control)
- Scheduled Jobs with EventBridge (cron/rate schedules)
- Webhook Processing (signature validation, async queue forwarding)

> **Important**: When using CDK code examples from references, avoid hardcoding resource names (e.g., `restApiName`, `eventBusName`). Let CDK generate unique names automatically to enable reusability and parallel deployments. See `aws-cdk-development` skill for details.

## Best Practices

### Error Handling

**Implement comprehensive error handling**:

```typescript
export const handler = async (event: SQSEvent) => {
  const failures: SQSBatchItemFailure[] = [];

  for (const record of event.Records) {
// ... (9 lines trimmed)
  return { batchItemFailures: failures };
};
```

### Dead Letter Queues

**Always configure DLQs for error handling**:

```typescript
const dlq = new sqs.Queue(this, 'DLQ', {
  retentionPeriod: Duration.days(14),
});

const queue = new sqs.Queue(this, 'Queue', {
// ... (10 lines trimmed)
  evaluationPeriods: 1,
  alarmDescription: 'Messages in DLQ require attention',
});
```

### Observability

**Enable tracing and monitoring**:

```typescript
new NodejsFunction(this, 'Function', {
  entry: 'src/handler.ts',
  tracing: lambda.Tracing.ACTIVE, // X-Ray tracing
  environment: {
    POWERTOOLS_SERVICE_NAME: 'order-service',
    POWERTOOLS_METRICS_NAMESPACE: 'MyApp',
    LOG_LEVEL: 'INFO',
  },
});
```

## Using MCP Servers Effectively

Use the CDK MCP server (via `aws-cdk-development` dependency) for construct recommendations and CDK-specific guidance when building serverless infrastructure.

Use AWS Documentation MCP to verify service features, regional availability, and API specifications before implementing.

## Additional Resources

This skill includes comprehensive reference documentation based on AWS best practices:

- **Serverless Patterns**: `references/serverless-patterns.md`
  - Core serverless architectures and API patterns
  - Data processing and integration patterns
  - Orchestration with Step Functions
  - Anti-patterns to avoid

- **Event-Driven Architecture Patterns**: `references/eda-patterns.md`
  - Event routing and processing patterns
  - Event sourcing and saga patterns
  - Idempotency and error handling
  - Message ordering and deduplication

- **Security Best Practices**: `references/security-best-practices.md`
  - Shared responsibility model
  - IAM least privilege patterns
  - Data protection and encryption
  - Network security with VPC

- **Observability Best Practices**: `references/observability-best-practices.md`
  - Three pillars: metrics, logs, traces
  - Structured logging with Lambda Powertools
  - X-Ray distributed tracing
  - CloudWatch alarms and dashboards

- **Performance Optimization**: `references/performance-optimization.md`
  - Cold start optimization techniques
  - Memory and CPU optimization
  - Package size reduction
  - Provisioned concurrency patterns

- **Deployment Best Practices**: `references/deployment-best-practices.md`
  - CI/CD pipeline design
  - Testing strategies (unit, integration, load)
  - Deployment strategies (canary, blue/green)
  - Rollback and safety mechanisms

**External Resources**:
- **AWS Well-Architected Serverless Lens**: https://docs.aws.amazon.com/wellarchitected/latest/serverless-applications-lens/
- **ServerlessLand.com**: Pre-built serverless patterns
- **AWS Serverless Workshops**: https://serverlessland.com/learn?type=Workshops

For detailed implementation patterns, anti-patterns, and code examples, refer to the comprehensive references in the skill directory.
