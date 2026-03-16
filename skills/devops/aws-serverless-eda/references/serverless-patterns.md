# Serverless Architecture Patterns

Comprehensive patterns for building serverless applications on AWS based on Well-Architected Framework principles.

## Table of Contents

- [Core Serverless Patterns](#core-serverless-patterns)
- [API Patterns](#api-patterns)
- [Data Processing Patterns](#data-processing-patterns)
- [Integration Patterns](#integration-patterns)
- [Orchestration Patterns](#orchestration-patterns)
- [Anti-Patterns](#anti-patterns)

## Core Serverless Patterns

### Pattern: Serverless Microservices

**Use case**: Independent, scalable services with separate databases

**Architecture**:
```
API Gateway → Lambda Functions → DynamoDB/RDS
              ↓ (events)
         EventBridge → Other Services
```

**CDK Implementation**:
```typescript
// User Service
const userTable = new dynamodb.Table(this, 'Users', {
  partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
  billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
});
// ... (23 lines trimmed)

orderTable.grantReadWriteData(orderFunction);
eventBus.grantPutEventsTo(orderFunction);
```

**Benefits**:
- Independent deployment and scaling
- Database per service (data isolation)
- Technology diversity
- Fault isolation

### Pattern: Serverless API Backend

**Use case**: REST or GraphQL API with serverless compute

**REST API with API Gateway**:
```typescript
const api = new apigateway.RestApi(this, 'Api', {
  restApiName: 'serverless-api',
  deployOptions: {
    stageName: 'prod',
    tracingEnabled: true,
// ... (16 lines trimmed)
item.addMethod('GET', new apigateway.LambdaIntegration(getFunction));
item.addMethod('PUT', new apigateway.LambdaIntegration(updateFunction));
item.addMethod('DELETE', new apigateway.LambdaIntegration(deleteFunction));
```

**GraphQL API with AppSync**:
```typescript
const api = new appsync.GraphqlApi(this, 'Api', {
  name: 'serverless-graphql-api',
  schema: appsync.SchemaFile.fromAsset('schema.graphql'),
  authorizationConfig: {
    defaultAuthorization: {
// ... (10 lines trimmed)
  typeName: 'Query',
  fieldName: 'getItem',
});
```

### Pattern: Serverless Data Lake

**Use case**: Ingest, process, and analyze large-scale data

**Architecture**:
```
S3 (raw data) → Lambda (transform) → S3 (processed)
                  ↓ (catalog)
               AWS Glue → Athena (query)
```

**Implementation**:
```typescript
const rawBucket = new s3.Bucket(this, 'RawData');
const processedBucket = new s3.Bucket(this, 'ProcessedData');

// Trigger Lambda on file upload
rawBucket.addEventNotification(
// ... (24 lines trimmed)
    });
  }
};
```

## API Patterns

### Pattern: Authorizer Pattern

**Use case**: Custom authentication and authorization

```typescript
// Lambda authorizer
const authorizer = new apigateway.TokenAuthorizer(this, 'Authorizer', {
  handler: authorizerFunction,
  identitySource: 'method.request.header.Authorization',
// ... (6 lines trimmed)
  authorizer,
});
```

### Pattern: Request Validation

**Use case**: Validate requests before Lambda invocation

```typescript
const requestModel = api.addModel('RequestModel', {
  contentType: 'application/json',
  schema: {
    type: apigateway.JsonSchemaType.OBJECT,
    required: ['name', 'email'],
// ... (14 lines trimmed)
    'application/json': requestModel,
  },
});
```

### Pattern: Response Caching

**Use case**: Reduce backend load and improve latency

```typescript
const api = new apigateway.RestApi(this, 'Api', {
  deployOptions: {
    cachingEnabled: true,
    cacheTtl: Duration.minutes(5),
    cacheClusterEnabled: true,
// ... (10 lines trimmed)
    },
  }],
});
```

## Data Processing Patterns

### Pattern: S3 Event Processing

**Use case**: Process files uploaded to S3

```typescript
const bucket = new s3.Bucket(this, 'DataBucket');

// Process images
bucket.addEventNotification(
  s3.EventType.OBJECT_CREATED,
// ... (14 lines trimmed)
  new s3n.SfnDestination(processingStateMachine),
  { prefix: 'large-files/' }
);
```

### Pattern: DynamoDB Streams Processing

**Use case**: React to database changes

```typescript
const table = new dynamodb.Table(this, 'Table', {
  partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
  stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
});

// ... (26 lines trimmed)
    }
  }
};
```

### Pattern: Kinesis Stream Processing

**Use case**: Real-time data streaming and analytics

```typescript
const stream = new kinesis.Stream(this, 'EventStream', {
  shardCount: 2,
  streamMode: kinesis.StreamMode.PROVISIONED,
});

// ... (16 lines trimmed)
    }),
  ],
});
```

## Integration Patterns

### Pattern: Service Integration with EventBridge

**Use case**: Decouple services with events

```typescript
const eventBus = new events.EventBus(this, 'AppBus');

// Service A publishes events
const serviceA = new NodejsFunction(this, 'ServiceA', {
  entry: 'src/services/a/handler.ts',
// ... (23 lines trimmed)
  },
  targets: [new targets.LambdaFunction(serviceCFunction)],
});
```

### Pattern: API Gateway + SQS Integration

**Use case**: Async API requests without Lambda

```typescript
const queue = new sqs.Queue(this, 'RequestQueue');

const api = new apigateway.RestApi(this, 'Api');

// Direct SQS integration (no Lambda)
// ... (18 lines trimmed)
api.root.addMethod('POST', sqsIntegration, {
  methodResponses: [{ statusCode: '200' }],
});
```

### Pattern: EventBridge + Step Functions

**Use case**: Event-triggered workflow orchestration

```typescript
// State machine for order processing
const orderStateMachine = new stepfunctions.StateMachine(this, 'OrderFlow', {
  definition: /* ... */,
});
// ... (7 lines trimmed)
  targets: [new targets.SfnStateMachine(orderStateMachine)],
});
```

## Orchestration Patterns

### Pattern: Sequential Workflow

**Use case**: Multi-step process with dependencies

```typescript
const definition = new tasks.LambdaInvoke(this, 'Step1', {
  lambdaFunction: step1Function,
  outputPath: '$.Payload',
})
  .next(new tasks.LambdaInvoke(this, 'Step2', {
// ... (8 lines trimmed)
new stepfunctions.StateMachine(this, 'Sequential', {
  definition,
});
```

### Pattern: Parallel Execution

**Use case**: Execute independent tasks concurrently

```typescript
const parallel = new stepfunctions.Parallel(this, 'ParallelProcessing');

parallel.branch(new tasks.LambdaInvoke(this, 'ProcessA', {
  lambdaFunction: functionA,
}));
// ... (11 lines trimmed)
}));

new stepfunctions.StateMachine(this, 'Parallel', { definition });
```

### Pattern: Map State (Dynamic Parallelism)

**Use case**: Process array of items in parallel

```typescript
const mapState = new stepfunctions.Map(this, 'ProcessItems', {
  maxConcurrency: 10,
  itemsPath: '$.items',
});
// ... (6 lines trimmed)
  lambdaFunction: finalizeFunction,
}));
```

### Pattern: Choice State (Conditional Logic)

**Use case**: Branching logic based on input

```typescript
const choice = new stepfunctions.Choice(this, 'OrderType');

choice.when(
  stepfunctions.Condition.stringEquals('$.orderType', 'STANDARD'),
// ... (7 lines trimmed)

choice.otherwise(defaultProcessing);
```

### Pattern: Wait State

**Use case**: Delay between steps or wait for callbacks

```typescript
// Fixed delay
const wait = new stepfunctions.Wait(this, 'Wait30Seconds', {
  time: stepfunctions.WaitTime.duration(Duration.seconds(30)),
});

// ... (11 lines trimmed)
    data: stepfunctions.JsonPath.entirePayload,
  }),
});
```

## Anti-Patterns

### ❌ Lambda Monolith

**Problem**: Single Lambda handling all operations

```typescript
// BAD
export const handler = async (event: any) => {
  switch (event.operation) {
    case 'createUser': return createUser(event);
// ... (5 lines trimmed)
  }
};
```

**Solution**: Separate Lambda functions per operation

```typescript
// GOOD - Separate functions
export const createUser = async (event: any) => { /* ... */ };
export const getUser = async (event: any) => { /* ... */ };
export const updateUser = async (event: any) => { /* ... */ };
```

### ❌ Recursive Lambda Pattern

**Problem**: Lambda invoking itself (runaway costs)

```typescript
// BAD
export const handler = async (event: any) => {
  await processItem(event);

// ... (6 lines trimmed)
  }
};
```

**Solution**: Use SQS or Step Functions

```typescript
// GOOD - Use SQS for iteration
export const handler = async (event: SQSEvent) => {
  for (const record of event.Records) {
    await processItem(record);
  }
  // SQS handles iteration automatically
};
```

### ❌ Lambda Chaining

**Problem**: Lambda directly invoking another Lambda

```typescript
// BAD
export const handler1 = async (event: any) => {
  const result = await processStep1(event);

  // Directly invoking next Lambda
  await lambda.invoke({
    FunctionName: 'handler2',
    Payload: JSON.stringify(result),
  });
};
```

**Solution**: Use EventBridge, SQS, or Step Functions

```typescript
// GOOD - Publish to EventBridge
export const handler1 = async (event: any) => {
  const result = await processStep1(event);

// ... (6 lines trimmed)
  });
};
```

### ❌ Synchronous Waiting in Lambda

**Problem**: Lambda waiting for slow operations

```typescript
// BAD - Blocking on slow operation
export const handler = async (event: any) => {
  await startBatchJob(); // Returns immediately

// ... (5 lines trimmed)
  }
};
```

**Solution**: Use Step Functions with callback pattern

```typescript
// GOOD - Step Functions waits, not Lambda
const waitForJob = new tasks.LambdaInvoke(this, 'StartJob', {
  lambdaFunction: startJobFunction,
  integrationPattern: stepfunctions.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
  payload: stepfunctions.TaskInput.fromObject({
    token: stepfunctions.JsonPath.taskToken,
  }),
});
```

### ❌ Large Deployment Packages

**Problem**: Large Lambda packages increase cold start time

**Solution**:
- Use layers for shared dependencies
- Externalize AWS SDK
- Minimize bundle size

```typescript
new NodejsFunction(this, 'Function', {
  entry: 'src/handler.ts',
  bundling: {
    minify: true,
    externalModules: ['@aws-sdk/*'], // Provided by runtime
    nodeModules: ['only-needed-deps'], // Selective bundling
  },
});
```

## Performance Optimization

### Cold Start Optimization

**Techniques**:
1. Minimize package size
2. Use provisioned concurrency for critical paths
3. Lazy load dependencies
4. Reuse connections outside handler
5. Use Lambda SnapStart (Java)

```typescript
// For latency-sensitive APIs
const apiFunction = new NodejsFunction(this, 'ApiFunction', {
  entry: 'src/api.ts',
  memorySize: 1769, // 1 vCPU for faster initialization
// ... (7 lines trimmed)
  utilizationTarget: 0.7,
});
```

### Right-Sizing Memory

**Test different memory configurations**:

```typescript
// CPU-bound workload
new NodejsFunction(this, 'ComputeFunction', {
  memorySize: 1769, // 1 vCPU
  timeout: Duration.seconds(30),
});
// ... (9 lines trimmed)
  memorySize: 256,
  timeout: Duration.seconds(10),
});
```

### Concurrent Execution Control

```typescript
// Protect downstream services
new NodejsFunction(this, 'Function', {
  reservedConcurrentExecutions: 10, // Max 10 concurrent
});

// Unreserved concurrency (shared pool)
new NodejsFunction(this, 'Function', {
  // Uses unreserved account concurrency
});
```

## Testing Strategies

### Unit Testing

Test business logic separate from AWS services:

```typescript
// handler.ts
export const processOrder = async (order: Order): Promise<Result> => {
  // Business logic (easily testable)
  const validated = validateOrder(order);
  const priced = calculatePrice(validated);
// ... (13 lines trimmed)
  const result = processOrder(order);
  expect(result.total).toBe(20);
});
```

### Integration Testing

Test with actual AWS services:

```typescript
// integration.test.ts
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';

test('Lambda processes order correctly', async () => {
// ... (8 lines trimmed)
  expect(result.statusCode).toBe(200);
});
```

### Local Testing with SAM

```bash
# Test API locally
sam local start-api

# Invoke function locally
sam local invoke MyFunction -e events/test-event.json

# Generate sample event
sam local generate-event apigateway aws-proxy > event.json
```

## Summary

- **Single Purpose**: One function, one responsibility
- **Concurrent Design**: Think concurrency, not volume
- **Stateless**: Use external storage for state
- **State Machines**: Orchestrate with Step Functions
- **Event-Driven**: Use events over direct calls
- **Idempotent**: Handle failures and duplicates gracefully
- **Observability**: Enable tracing and structured logging
