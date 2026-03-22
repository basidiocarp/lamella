# Serverless Security Best Practices

Security best practices for serverless applications based on AWS Well-Architected Framework.

## Table of Contents

- [Shared Responsibility Model](#shared-responsibility-model)
- [Identity and Access Management](#identity-and-access-management)
- [Function Security](#function-security)
- [API Security](#api-security)
- [Data Protection](#data-protection)
- [Network Security](#network-security)

## Shared Responsibility Model

### Serverless Shifts Responsibility to AWS

With serverless, AWS takes on more security responsibilities:

**AWS Responsibilities**:
- Compute infrastructure
- Execution environment
- Runtime language and patches
- Networking infrastructure
- Server software and OS
- Physical hardware and facilities
- Automatic security patches (like Log4Shell mitigation)

**Customer Responsibilities**:
- Function code and dependencies
- Resource configuration
- Identity and Access Management (IAM)
- Data encryption (at rest and in transit)
- Application-level security
- Secure coding practices

### Benefits of Shifted Responsibility

- **Automatic Patching**: AWS applies security patches automatically (e.g., Log4Shell fixed within 3 days)
- **Infrastructure Security**: No OS patching, server hardening, or vulnerability scanning
- **Operational Agility**: Quick security response at scale
- **Focus on Code**: Spend time on business logic, not infrastructure security

## Identity and Access Management

### Least Privilege Principle

**Always use least privilege IAM policies**:

```typescript
// ✅ GOOD - Specific grant
const table = new dynamodb.Table(this, 'Table', {});
const function = new lambda.Function(this, 'Function', {});

// ... (5 lines trimmed)
  resources: ['*'],
}));
```

### Function Execution Role

**Separate roles per function**:

```typescript
// ✅ GOOD - Each function has its own role
const readFunction = new NodejsFunction(this, 'ReadFunction', {
  entry: 'src/read.ts',
  // Gets its own execution role
});
// ... (13 lines trimmed)
    iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'), // Too broad!
  ],
});
```

### Resource-Based Policies

Control who can invoke functions:

```typescript
// Allow API Gateway to invoke function
myFunction.grantInvoke(new iam.ServicePrincipal('apigateway.amazonaws.com'));

// Allow specific account
// ... (9 lines trimmed)
  sourceArn: vpcEndpoint.vpcEndpointId,
});
```

### IAM Policies Best Practices

1. **Use grant methods**: Prefer `.grantXxx()` over manual policies
2. **Condition keys**: Use IAM conditions for fine-grained control
3. **Resource ARNs**: Always specify resource ARNs, avoid wildcards
4. **Session policies**: Use for temporary elevated permissions
5. **Service Control Policies (SCPs)**: Enforce organization-wide guardrails

## Function Security

### Lambda Isolation Model

**Each function runs in isolated sandbox**:
- Built on Firecracker microVMs
- Dedicated execution environment per function
- No shared memory between functions
- Isolated file system and network namespace
- Strong workload isolation

**Execution Environment Security**:
- One concurrent invocation per environment
- Environment may be reused (warm starts)
- `/tmp` storage persists between invocations
- Sensitive data in memory may persist

### Secure Coding Practices

**Handle sensitive data securely**:

```typescript
// ✅ GOOD - Clean up sensitive data
export const handler = async (event: any) => {
  const apiKey = process.env.API_KEY;

  try {
// ... (18 lines trimmed)
  const apiKey = secret.SecretString;
  // Use apiKey
};
```

### Dependency Management

**Scan dependencies for vulnerabilities**:

```json
// package.json
{
  "scripts": {
    "audit": "npm audit",
    "audit:fix": "npm audit fix"
  },
  "devDependencies": {
    "snyk": "^1.0.0"
  }
}
```

**Keep dependencies updated**:
- Run `npm audit` or `pip-audit` regularly
- Use Dependabot or Snyk for automated scanning
- Update dependencies promptly when vulnerabilities found
- Use minimal dependency sets

### Environment Variable Security

**Never store secrets in environment variables**:

```typescript
// ❌ BAD - Secret in environment variable
new NodejsFunction(this, 'Function', {
  environment: {
    API_KEY: 'sk-1234567890abcdef', // Never do this!
// ... (9 lines trimmed)

secret.grantRead(myFunction);
```

## API Security

### API Gateway Security

**Authentication and Authorization**:

```typescript
// Cognito User Pool authorizer
const authorizer = new apigateway.CognitoUserPoolsAuthorizer(this, 'Authorizer', {
  cognitoUserPools: [userPool],
});

// ... (12 lines trimmed)
api.root.addMethod('POST', integration, {
  authorizationType: apigateway.AuthorizationType.IAM,
});
```

### Request Validation

**Validate requests at API Gateway**:

```typescript
const validator = new apigateway.RequestValidator(this, 'Validator', {
  api,
  validateRequestBody: true,
  validateRequestParameters: true,
});
// ... (22 lines trimmed)
    'application/json': model,
  },
});
```

### Rate Limiting and Throttling

```typescript
const api = new apigateway.RestApi(this, 'Api', {
  deployOptions: {
    throttlingRateLimit: 1000, // requests per second
    throttlingBurstLimit: 2000, // burst capacity
  },
// ... (10 lines trimmed)
    burstLimit: 200,
  },
});
```

### API Keys and Usage Plans

```typescript
const apiKey = api.addApiKey('ApiKey', {
  apiKeyName: 'customer-key',
});

const plan = api.addUsagePlan('UsagePlan', {
// ... (12 lines trimmed)
plan.addApiStage({
  stage: api.deploymentStage,
});
```

## Data Protection

### Encryption at Rest

**DynamoDB encryption**:

```typescript
// Default: AWS-owned CMK (no additional cost)
const table = new dynamodb.Table(this, 'Table', {
  encryption: dynamodb.TableEncryption.AWS_MANAGED, // AWS managed CMK
});
// ... (8 lines trimmed)
  encryptionKey: kmsKey,
});
```

**S3 encryption**:

```typescript
// SSE-S3 (default, no additional cost)
const bucket = new s3.Bucket(this, 'Bucket', {
  encryption: s3.BucketEncryption.S3_MANAGED,
});

// SSE-KMS (for fine-grained access control)
const bucket = new s3.Bucket(this, 'Bucket', {
  encryption: s3.BucketEncryption.KMS,
  encryptionKey: kmsKey,
});
```

**SQS/SNS encryption**:

```typescript
const queue = new sqs.Queue(this, 'Queue', {
  encryption: sqs.QueueEncryption.KMS,
  encryptionMasterKey: kmsKey,
});

const topic = new sns.Topic(this, 'Topic', {
  masterKey: kmsKey,
});
```

### Encryption in Transit

**All AWS service APIs use TLS**:
- API Gateway endpoints use HTTPS by default
- Lambda to AWS service communication encrypted
- EventBridge, SQS, SNS use TLS
- Custom domains can use ACM certificates

```typescript
// API Gateway with custom domain
const certificate = new acm.Certificate(this, 'Certificate', {
  domainName: 'api.example.com',
  validation: acm.CertificateValidation.fromDns(hostedZone),
// ... (6 lines trimmed)
  },
});
```

### Data Sanitization

**Validate and sanitize inputs**:

```typescript
import DOMPurify from 'isomorphic-dompurify';
import { z } from 'zod';

// Schema validation
const OrderSchema = z.object({
// ... (22 lines trimmed)

  await processOrder(sanitized);
};
```

## Network Security

### VPC Configuration

**Lambda in VPC for private resources**:

```typescript
const vpc = new ec2.Vpc(this, 'Vpc', {
  maxAzs: 2,
  natGateways: 1,
});

// ... (20 lines trimmed)
  ec2.Port.tcp(3306),
  'Allow MySQL access'
);
```

### VPC Endpoints

**Use VPC endpoints for AWS services**:

```typescript
// S3 VPC endpoint (gateway endpoint, no cost)
vpc.addGatewayEndpoint('S3Endpoint', {
  service: ec2.GatewayVpcEndpointAwsService.S3,
});
// ... (9 lines trimmed)
  privateDnsEnabled: true,
});
```

### Security Groups

**Principle of least privilege for network access**:

```typescript
// Lambda security group
const lambdaSG = new ec2.SecurityGroup(this, 'LambdaSG', {
  vpc,
  allowAllOutbound: false,
});
// ... (16 lines trimmed)
  ec2.Port.tcp(3306),
  'Allow RDS access'
);
```

## Security Monitoring

### CloudWatch Logs

**Enable and encrypt logs**:

```typescript
new NodejsFunction(this, 'Function', {
  entry: 'src/handler.ts',
  logRetention: logs.RetentionDays.ONE_WEEK,
  logGroup: new logs.LogGroup(this, 'LogGroup', {
    encryptionKey: kmsKey, // Encrypt logs
    retention: logs.RetentionDays.ONE_WEEK,
  }),
});
```

### CloudTrail

**Enable CloudTrail for audit**:

```typescript
const trail = new cloudtrail.Trail(this, 'Trail', {
  isMultiRegionTrail: true,
  includeGlobalServiceEvents: true,
  managementEvents: cloudtrail.ReadWriteType.ALL,
// ... (5 lines trimmed)
  readWriteType: cloudtrail.ReadWriteType.ALL,
}]);
```

### GuardDuty

**Enable GuardDuty for threat detection**:
- Analyzes VPC Flow Logs, DNS logs, CloudTrail events
- Detects unusual API activity
- Identifies compromised credentials
- Monitors for cryptocurrency mining

## Security Best Practices Checklist

### Development

- [ ] Validate and sanitize all inputs
- [ ] Scan dependencies for vulnerabilities
- [ ] Use least privilege IAM permissions
- [ ] Store secrets in Secrets Manager or Parameter Store
- [ ] Never log sensitive data
- [ ] Enable encryption for all data stores
- [ ] Use environment variables for configuration, not secrets

### Deployment

- [ ] Enable CloudTrail in all regions
- [ ] Configure VPC for sensitive workloads
- [ ] Use VPC endpoints for AWS service access
- [ ] Enable GuardDuty for threat detection
- [ ] Implement resource-based policies
- [ ] Use AWS WAF for API protection
- [ ] Enable access logging for API Gateway

### Operations

- [ ] Monitor CloudTrail for unusual activity
- [ ] Set up alarms for security events
- [ ] Rotate secrets regularly
- [ ] Review IAM policies periodically
- [ ] Audit function permissions
- [ ] Monitor GuardDuty findings
- [ ] Implement automated security responses

### Testing

- [ ] Test with least privilege policies
- [ ] Validate error handling for security failures
- [ ] Test input validation and sanitization
- [ ] Verify encryption configurations
- [ ] Test with malicious payloads
- [ ] Audit logs for security events

## Summary

- **Shared Responsibility**: AWS handles infrastructure, you handle application security
- **Least Privilege**: Use IAM grant methods, avoid wildcards
- **Encryption**: Enable encryption at rest and in transit
- **Input Validation**: Validate and sanitize all inputs
- **Dependency Security**: Scan and update dependencies regularly
- **Monitoring**: Enable CloudTrail, GuardDuty, and CloudWatch
- **Secrets Management**: Use Secrets Manager, never environment variables
- **Network Security**: Use VPC, security groups, and VPC endpoints appropriately
