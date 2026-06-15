# Serverless Architecture Patterns

Practical AWS serverless patterns for APIs, event-driven systems, and
orchestration. Keep the examples small enough to adapt quickly.

## Core Patterns

### Serverless Microservice

Use when a service owns its own data and scales independently.

```ts
const ordersTable = new dynamodb.Table(this, "Orders", {
  partitionKey: { name: "orderId", type: dynamodb.AttributeType.STRING },
  billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
});

const ordersFn = new NodejsFunction(this, "OrdersHandler", {
  entry: "src/orders/handler.ts",
  environment: { TABLE_NAME: ordersTable.tableName },
});

ordersTable.grantReadWriteData(ordersFn);
```

### Serverless API Backend

Use API Gateway plus Lambda for straightforward REST APIs.

```ts
const api = new apigateway.RestApi(this, "Api", {
  deployOptions: { stageName: "prod", tracingEnabled: true },
});

const items = api.root.addResource("items");
items.addMethod("GET", new apigateway.LambdaIntegration(listItemsFn));
items.addMethod("POST", new apigateway.LambdaIntegration(createItemFn));
```

### Event-Driven Processing

Use EventBridge when multiple consumers should react to the same event.

```ts
const bus = new events.EventBus(this, "AppBus");

new events.Rule(this, "OrderCreatedRule", {
  eventBus: bus,
  eventPattern: {
    source: ["app.orders"],
    detailType: ["order.created"],
  },
  targets: [new targets.LambdaFunction(sendNotificationFn)],
});
```

## API Patterns

### Lambda Authorizer

```ts
const authorizer = new apigateway.TokenAuthorizer(this, "Authorizer", {
  handler: authFn,
});

items.addMethod("GET", new apigateway.LambdaIntegration(listItemsFn), {
  authorizer,
  authorizationType: apigateway.AuthorizationType.CUSTOM,
});
```

### Request Validation

```ts
const requestModel = api.addModel("CreateItemModel", {
  contentType: "application/json",
  schema: {
    type: apigateway.JsonSchemaType.OBJECT,
    required: ["name"],
    properties: {
      name: { type: apigateway.JsonSchemaType.STRING },
    },
  },
});
```

### Response Caching

Use API Gateway caching only for stable, cacheable reads.

```ts
const api = new apigateway.RestApi(this, "CachedApi", {
  deployOptions: {
    cachingEnabled: true,
    cacheTtl: Duration.minutes(5),
  },
});
```

## Data Processing Patterns

### S3 Event Processing

```ts
const bucket = new s3.Bucket(this, "Uploads");

bucket.addEventNotification(
  s3.EventType.OBJECT_CREATED,
  new s3n.LambdaDestination(processUploadFn),
  { prefix: "incoming/" },
);
```

### DynamoDB Streams

```ts
const table = new dynamodb.Table(this, "Events", {
  partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
  stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
});

new NodejsFunction(this, "Projector", {
  entry: "src/projector/handler.ts",
  events: [
    new DynamoEventSource(table, {
      startingPosition: lambda.StartingPosition.LATEST,
    }),
  ],
});
```

### Kinesis Consumers

Use Kinesis when ordered, high-throughput event streams matter.

```ts
const stream = new kinesis.Stream(this, "EventStream", {
  shardCount: 2,
});
```

## Integration Patterns

### API Gateway to SQS

Use this when request acceptance matters more than immediate completion.

```ts
const queue = new sqs.Queue(this, "RequestQueue");
// Direct API Gateway integrations work well for async ingestion paths.
```

### EventBridge to Step Functions

```ts
new events.Rule(this, "WorkflowTrigger", {
  eventPattern: {
    source: ["app.orders"],
    detailType: ["order.ready"],
  },
  targets: [new targets.SfnStateMachine(orderFlow)],
});
```

## Orchestration Patterns

### Sequential Workflow

Use Step Functions for multi-step business flows with retries and visibility.

```ts
const definition = new tasks.LambdaInvoke(this, "Validate", {
  lambdaFunction: validateFn,
  outputPath: "$.Payload",
}).next(
  new tasks.LambdaInvoke(this, "Charge", {
    lambdaFunction: chargeFn,
    outputPath: "$.Payload",
  }),
);
```

### Parallel Execution

Use `Parallel` for independent branches.

```ts
const parallel = new stepfunctions.Parallel(this, "RunChecks")
  .branch(new tasks.LambdaInvoke(this, "InventoryCheck", { lambdaFunction: inventoryFn }))
  .branch(new tasks.LambdaInvoke(this, "FraudCheck", { lambdaFunction: fraudFn }));
```

### Choice State

```ts
const route = new stepfunctions.Choice(this, "RouteOrder")
  .when(stepfunctions.Condition.stringEquals("$.priority", "high"), fastPath)
  .otherwise(standardPath);
```

## Anti-Patterns

### Lambda Monolith

Avoid one function that handles unrelated domains, routes, and event types.

### Recursive Lambda Chains

Avoid using Lambda-to-Lambda chains as a hidden workflow engine.

### Synchronous Waiting

Do not keep Lambda invocations open while waiting for long-running external
processes.

### Large Deployment Packages

Keep package size down to improve cold starts and deploy times.

## Performance Practices

### Cold Start Reduction

- keep handlers small
- trim dependencies
- prefer provisioned concurrency only where justified

### Right-Size Memory

Benchmark memory settings; more memory can reduce overall duration and lower
cost.

### Concurrency Controls

Use reserved concurrency, queue buffers, or backpressure when downstream systems
cannot absorb bursts safely.

## Testing Strategies

### Unit Tests

Keep business logic outside handlers so it can be tested without cloud
infrastructure.

### Integration Tests

Test event contracts, permissions, and failure handling against deployed or
ephemeral environments.

### Local Testing

Use SAM, LocalStack, or framework-specific emulators only as a fast feedback
loop, not as the final source of truth.

## Summary

- Prefer small, event-driven building blocks
- Use EventBridge and Step Functions for visible orchestration
- Design for retries, idempotency, and observability from the start
- Avoid hiding workflows inside Lambda chains
