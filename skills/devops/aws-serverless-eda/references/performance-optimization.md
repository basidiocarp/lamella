# Serverless Performance Optimization

Performance optimization best practices for AWS Lambda and serverless architectures.

## Table of Contents

- [Lambda Execution Lifecycle](#lambda-execution-lifecycle)
- [Cold Start Optimization](#cold-start-optimization)
- [Memory and CPU Optimization](#memory-and-cpu-optimization)
- [Package Size Optimization](#package-size-optimization)
- [Initialization Optimization](#initialization-optimization)
- [Runtime Performance](#runtime-performance)

## Lambda Execution Lifecycle

### Execution Environment Phases

**Three phases of Lambda execution**:

1. **Init Phase** (Cold Start):
   - Download and unpack function package
   - Create execution environment
   - Initialize runtime
   - Execute initialization code (outside handler)

2. **Invoke Phase**:
   - Execute handler code
   - Return response
   - Freeze execution environment

3. **Shutdown Phase**:
   - Runtime shutdown (after period of inactivity)
   - Execution environment destroyed

### Concurrency and Scaling

**Key concepts**:
- **Concurrency**: Number of execution environments serving requests simultaneously
- **One event per environment**: Each environment processes one event at a time
- **Automatic scaling**: Lambda creates new environments as needed
- **Environment reuse**: Warm starts reuse existing environments

**Example**:
- Function takes 100ms to execute
- Single environment can handle 10 requests/second
- 100 concurrent requests = 10 environments needed
- Default account limit: 1,000 concurrent executions (can be raised)

## Cold Start Optimization

### Understanding Cold Starts

**Cold start components**:
```
Total Cold Start = Download Package + Init Environment + Init Code + Handler
```

**Cold start frequency**:
- Development: Every code change creates new environments (frequent)
- Production: Typically < 1% of invocations
- Optimize for p95/p99 latency, not average

### Package Size Optimization

**Minimize deployment package**:

```typescript
new NodejsFunction(this, 'Function', {
  entry: 'src/handler.ts',
  bundling: {
    minify: true, // Minify production code
// ... (5 lines trimmed)
  },
});
```

**Tools for optimization**:
- **esbuild**: Automatic tree-shaking and minification
- **Webpack**: Bundle optimization
- **Maven**: Dependency analysis
- **Gradle**: Unused dependency detection

**Best practices**:
1. Avoid monolithic functions
2. Bundle only required dependencies
3. Use tree-shaking to remove unused code
4. Minify production code
5. Exclude AWS SDK (provided by runtime)

### Provisioned Concurrency

**Pre-initialize environments for predictable latency**:

```typescript
const fn = new NodejsFunction(this, 'Function', {
  entry: 'src/handler.ts',
});

// Static provisioned concurrency
// ... (15 lines trimmed)
target.scaleOnUtilization({
  utilizationTarget: 0.7, // 70% utilization
});
```

**When to use**:
- **Consistent traffic patterns**: Predictable load
- **Latency-sensitive APIs**: Sub-100ms requirements
- **Cost consideration**: Compare cold start frequency vs. provisioned cost

**Cost comparison**:
- **On-demand**: Pay only for actual usage
- **Provisioned**: Pay for provisioned capacity + invocations
- **Breakeven**: When cold starts > ~20% of invocations

### Lambda SnapStart (Java)

**Instant cold starts for Java**:

```typescript
new lambda.Function(this, 'JavaFunction', {
  runtime: lambda.Runtime.JAVA_17,
  code: lambda.Code.fromAsset('target/function.jar'),
  handler: 'com.example.Handler::handleRequest',
  snapStart: lambda.SnapStartConf.ON_PUBLISHED_VERSIONS,
});
```

**Benefits**:
- Up to 10x faster cold starts for Java
- No code changes required
- Works with published versions
- No additional cost

## Memory and CPU Optimization

### Memory = CPU Allocation

**Key principle**: Memory and CPU are proportionally allocated

| Memory | vCPU |
|--------|------|
| 128 MB | 0.07 vCPU |
| 512 MB | 0.28 vCPU |
| 1,024 MB | 0.57 vCPU |
| 1,769 MB | 1.00 vCPU |
| 3,538 MB | 2.00 vCPU |
| 10,240 MB | 6.00 vCPU |

### Cost vs. Performance Balancing

**Example - Compute-intensive function**:

| Memory | Duration | Cost |
|--------|----------|------|
| 128 MB | 11.72s | $0.0246 |
| 256 MB | 6.68s | $0.0280 |
| 512 MB | 3.19s | $0.0268 |
| 1024 MB | 1.46s | $0.0246 |

**Key insight**: More memory = faster execution = similar or lower cost

**Formula**:
```
Duration = Allocated Memory (GB) × Execution Time (seconds)
Cost = Duration × Number of Invocations × Price per GB-second
```

### Finding Optimal Memory

**Use Lambda Power Tuning**:

```bash
# Deploy power tuning state machine
sam deploy --template-file template.yml --stack-name lambda-power-tuning

# Run power tuning
aws lambda invoke \
  --function-name powerTuningFunction \
  --payload '{"lambdaARN": "arn:aws:lambda:...", "powerValues": [128, 256, 512, 1024, 1536, 3008]}' \
  response.json
```

**Manual testing approach**:
1. Test function at different memory levels
2. Measure execution time at each level
3. Calculate cost for each configuration
4. Choose optimal balance for your use case

### Multi-Core Optimization

**Leverage multiple vCPUs** (at 1,769 MB+):

```typescript
// Use Worker Threads for parallel processing
import { Worker } from 'worker_threads';

export const handler = async (event: any) => {
  const items = event.items;
// ... (13 lines trimmed)
  const results = await Promise.all(workers);
  return results;
};
```

**Python multiprocessing**:

```python
import multiprocessing as mp

def handler(event, context):
    items = event['items']

    # Use multiple cores for CPU-bound work
    with mp.Pool(mp.cpu_count()) as pool:
        results = pool.map(process_item, items)

    return {'results': results}
```

## Initialization Optimization

### Code Outside Handler

**Initialize once, reuse across invocations**:

```typescript
// ✅ GOOD - Initialize outside handler
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { S3Client } from '@aws-sdk/client-s3';

// Initialized once per execution environment
// ... (19 lines trimmed)
  const s3 = new S3Client({}); // Created every invocation
  // ...
};
```

### Lazy Loading

**Load dependencies only when needed**:

```typescript
// ✅ GOOD - Conditional loading
export const handler = async (event: any) => {
  if (event.operation === 'generatePDF') {
    // Load heavy PDF library only when needed
    const pdfLib = await import('./pdf-generator');
// ... (19 lines trimmed)
    return pdfLib.generatePDF(event.data);
  }
};
```

### Connection Reuse

**Enable connection reuse**:

```typescript
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({
  // Enable keep-alive for connection reuse
// ... (6 lines trimmed)
// For Node.js AWS SDK
process.env.AWS_NODEJS_CONNECTION_REUSE_ENABLED = '1';
```

## Runtime Performance

### Choose the Right Runtime

**Runtime comparison**:

| Runtime | Cold Start | Execution Speed | Ecosystem | Best For |
|---------|------------|-----------------|-----------|----------|
| Node.js 20 | Fast | Fast | Excellent | APIs, I/O-bound |
| Python 3.12 | Fast | Medium | Excellent | Data processing |
| Java 17 + SnapStart | Fast (w/SnapStart) | Fast | Good | Enterprise apps |
| .NET 8 | Medium | Fast | Good | Enterprise apps |
| Go | Very Fast | Very Fast | Good | High performance |
| Rust | Very Fast | Very Fast | Growing | High performance |

### Optimize Handler Code

**Efficient code patterns**:

```typescript
// ✅ GOOD - Batch operations
const items = ['item1', 'item2', 'item3'];

// Single batch write
await dynamodb.batchWriteItem({
// ... (11 lines trimmed)
    Item: item,
  }); // Slow, multiple round trips
}
```

### Async Processing

**Use async/await effectively**:

```typescript
// ✅ GOOD - Parallel async operations
const [userData, orderData, inventoryData] = await Promise.all([
  getUserData(userId),
  getOrderData(orderId),
// ... (5 lines trimmed)
const orderData = await getOrderData(orderId); // Waits unnecessarily
const inventoryData = await getInventoryData(productId); // Waits unnecessarily
```

### Caching Strategies

**Cache frequently accessed data**:

```typescript
// In-memory cache (persists in warm environments)
const cache = new Map<string, any>();

export const handler = async (event: any) => {
  const key = event.key;
// ... (12 lines trimmed)

  return data;
};
```

**ElastiCache for shared cache**:

```typescript
import Redis from 'ioredis';

// Initialize once
const redis = new Redis({
  host: process.env.REDIS_HOST,
// ... (17 lines trimmed)

  return data;
};
```

## Performance Testing

### Load Testing

**Use Artillery for load testing**:

```yaml
# load-test.yml
config:
  target: https://api.example.com
  phases:
// ... (8 lines trimmed)
            orderId: "{{ $randomString() }}"
            amount: "{{ $randomNumber(10, 1000) }}"
```

```bash
artillery run load-test.yml
```

### Benchmarking

**Test different configurations**:

```typescript
// benchmark.ts
import { Lambda } from '@aws-sdk/client-lambda';

const lambda = new Lambda({});

// ... (24 lines trimmed)

  console.log(`${config.memory}MB - Avg: ${avg}ms, p99: ${p99}ms`);
}
```

## Cost Optimization

### Right-Sizing Memory

**Balance cost and performance**:

**CPU-bound workloads**:
- More memory = more CPU = faster execution
- Often results in lower cost overall
- Test at 1769MB (1 vCPU) and above

**I/O-bound workloads**:
- Less sensitive to memory allocation
- May not benefit from higher memory
- Test at lower memory levels (256-512MB)

**Simple operations**:
- Minimal CPU required
- Use minimum memory (128-256MB)
- Fast execution despite low resources

### Billing Granularity

**Lambda bills in 1ms increments**:
- Precise billing (7ms execution = 7ms cost)
- Optimize even small improvements
- Consider trade-offs carefully

**Cost calculation**:
```
Cost = (Memory GB) × (Duration seconds) × (Invocations) × ($0.0000166667/GB-second)
     + (Invocations) × ($0.20/1M requests)
```

### Cost Reduction Strategies

1. **Optimize execution time**: Faster = cheaper
2. **Right-size memory**: Balance CPU needs with cost
3. **Reduce invocations**: Batch processing, caching
4. **Use Graviton2**: 20% better price/performance
5. **Reserved Concurrency**: Only when needed
6. **Compression**: Reduce data transfer costs

## Advanced Optimization

### Lambda Extensions

**Use extensions for cross-cutting concerns**:

```typescript
// Lambda layer with extension
const extensionLayer = lambda.LayerVersion.fromLayerVersionArn(
  this,
  'Extension',
// ... (5 lines trimmed)
  layers: [extensionLayer],
});
```

**Common extensions**:
- Secrets caching
- Configuration caching
- Custom logging
- Security scanning
- Performance monitoring

### Graviton2 Architecture

**20% better price/performance**:

```typescript
new NodejsFunction(this, 'Function', {
  entry: 'src/handler.ts',
  architecture: lambda.Architecture.ARM_64, // Graviton2
});
```

**Considerations**:
- Most runtimes support ARM64
- Test thoroughly before migrating
- Dependencies must support ARM64
- Native extensions may need recompilation

### VPC Optimization

**Hyperplane ENIs** (automatic since 2019):
- No ENI per function
- Faster cold starts in VPC
- Scales instantly

```typescript
// Modern VPC configuration (fast)
new NodejsFunction(this, 'VpcFunction', {
  entry: 'src/handler.ts',
  vpc,
  vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
  // Fast scaling, no ENI limitations
});
```

## Performance Monitoring

### Key Metrics

**Monitor these metrics**:
- **Duration**: p50, p95, p99, max
- **Cold Start %**: ColdStartDuration / TotalDuration
- **Error Rate**: Errors / Invocations
- **Throttles**: Indicates concurrency limit reached
- **Iterator Age**: For stream processing lag

### Performance Dashboards

```typescript
const dashboard = new cloudwatch.Dashboard(this, 'PerformanceDashboard');

dashboard.addWidgets(
  new cloudwatch.GraphWidget({
    title: 'Latency Distribution',
// ... (10 lines trimmed)
    right: [fn.metricErrors()],
  })
);
```

## Summary

- **Cold Starts**: Optimize package size, use provisioned concurrency for critical paths
- **Memory**: More memory often = faster execution = lower cost
- **Initialization**: Initialize connections outside handler
- **Lazy Loading**: Load dependencies only when needed
- **Connection Reuse**: Enable for AWS SDK clients
- **Testing**: Test at different memory levels to find optimal configuration
- **Monitoring**: Track p99 latency, not average
- **Graviton2**: Consider ARM64 for better price/performance
- **Batch Operations**: Reduce round trips to services
- **Caching**: Cache frequently accessed data
