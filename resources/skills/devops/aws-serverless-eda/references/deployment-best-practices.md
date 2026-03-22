# Serverless Deployment Best Practices

Deployment best practices for serverless applications including CI/CD, testing, and deployment strategies.

## Table of Contents

- [Software Release Process](#software-release-process)
- [Infrastructure as Code](#infrastructure-as-code)
- [CI/CD Pipeline Design](#cicd-pipeline-design)
- [Testing Strategies](#testing-strategies)
- [Deployment Strategies](#deployment-strategies)
- [Rollback and Safety](#rollback-and-safety)

## Software Release Process

### Four Stages of Release

**1. Source Phase**:
- Developers commit code changes
- Code review (peer review)
- Version control (Git)

**2. Build Phase**:
- Compile code
- Run unit tests
- Style checking and linting
- Create deployment packages
- Build container images

**3. Test Phase**:
- Integration tests with other systems
- Load testing
- UI testing
- Security testing (penetration testing)
- Acceptance testing

**4. Production Phase**:
- Deploy to production environment
- Monitor for errors
- Validate deployment success
- Rollback if needed

### CI/CD Maturity Levels

**Continuous Integration (CI)**:
- Automated build on code commit
- Automated unit testing
- Manual deployment to test/production

**Continuous Delivery (CD)**:
- Automated deployment to test environments
- Manual approval for production
- Automated testing in non-prod

**Continuous Deployment**:
- Fully automated pipeline
- Automated deployment to production
- No manual intervention after code commit

## Infrastructure as Code

### Framework Selection

**AWS SAM (Serverless Application Model)**:

```yaml
# template.yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31

Resources:
// ... (9 lines trimmed)
          Properties:
            Path: /orders
            Method: post
```

**Benefits**:
- Simple, serverless-focused syntax
- Built-in best practices
- SAM CLI for local testing
- Integrates with CodeDeploy

**AWS CDK**:

```typescript
new NodejsFunction(this, 'OrderFunction', {
  entry: 'src/orders/handler.ts',
  environment: {
    TABLE_NAME: ordersTable.tableName,
  },
});

ordersTable.grantReadWriteData(orderFunction);
```

**Benefits**:
- Type-safe, programmatic
- Reusable constructs
- Rich AWS service support
- Better for complex infrastructure

**When to use**:
- **SAM**: Serverless-only applications, simpler projects
- **CDK**: Complex infrastructure, multiple services, reusable patterns

### Environment Management

**Separate environments**:

```typescript
// CDK App
const app = new cdk.App();

new ServerlessStack(app, 'DevStack', {
// ... (8 lines trimmed)
  logLevel: 'INFO',
});
```

**SAM with parameters**:

```yaml
Parameters:
  Environment:
    Type: String
    Default: dev
    AllowedValues:
// ... (9 lines trimmed)
        Variables:
          ENVIRONMENT: !Ref Environment
          LOG_LEVEL: !If [IsProd, INFO, DEBUG]
```

## CI/CD Pipeline Design

### AWS CodePipeline

**Comprehensive pipeline**:

```typescript
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';

const sourceOutput = new codepipeline.Artifact();
const buildOutput = new codepipeline.Artifact();
// ... (65 lines trimmed)
    }),
  ],
});
```

### GitHub Actions

**Serverless deployment workflow**:

```yaml
# .github/workflows/deploy.yml
name: Deploy Serverless Application

on:
  push:
// ... (42 lines trimmed)
            --no-fail-on-empty-changeset \
            --stack-name prod-stack \
            --parameter-overrides Environment=prod
```

## Testing Strategies

### Unit Testing

**Test business logic independently**:

```typescript
// handler.ts
export const processOrder = (order: Order): ProcessedOrder => {
  // Pure business logic (easily testable)
  validateOrder(order);
  calculateTotal(order);
// ... (29 lines trimmed)
    expect(() => processOrder(invalid)).toThrow();
  });
});
```

### Integration Testing

**Test in actual AWS environment**:

```typescript
// integration.test.ts
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';

describe('Order Processing Integration', () => {
// ... (24 lines trimmed)
    expect(dbResult.Item?.status.S).toBe('PROCESSED');
  });
});
```

### Local Testing with SAM

**Test locally before deployment**:

```bash
# Start local API
sam local start-api

# Invoke function locally
// ... (8 lines trimmed)
# Test with Docker
sam local start-api --docker-network my-network
```

### Load Testing

**Test under production load**:

```bash
# Install Artillery
npm install -g artillery

# Create load test
cat > load-test.yml <<EOF
// ... (16 lines trimmed)

# Generate HTML report
artillery report report.json
```

## Deployment Strategies

### All-at-Once Deployment

**Simple, fast, risky**:

```yaml
# SAM template
Resources:
  OrderFunction:
    Type: AWS::Serverless::Function
    Properties:
      DeploymentPreference:
        Type: AllAtOnce # Deploy immediately
```

**Use for**:
- Development environments
- Non-critical applications
- Quick hotfixes (with caution)

### Blue/Green Deployment

**Zero-downtime deployment**:

```yaml
Resources:
  OrderFunction:
    Type: AWS::Serverless::Function
    Properties:
      AutoPublishAlias: live
      DeploymentPreference:
        Type: Linear10PercentEvery1Minute
        Alarms:
          - !Ref ErrorAlarm
          - !Ref LatencyAlarm
```

**Deployment types**:
- **Linear10PercentEvery1Minute**: 10% traffic shift every minute
- **Linear10PercentEvery2Minutes**: Slower, more conservative
- **Linear10PercentEvery3Minutes**: Even slower
- **Linear10PercentEvery10Minutes**: Very gradual
- **Canary10Percent5Minutes**: 10% for 5 min, then 100%
- **Canary10Percent10Minutes**: 10% for 10 min, then 100%
- **Canary10Percent30Minutes**: 10% for 30 min, then 100%

### Canary Deployment

**Test with subset of traffic**:

```yaml
Resources:
  OrderFunction:
    Type: AWS::Serverless::Function
    Properties:
      AutoPublishAlias: live
// ... (21 lines trimmed)
      Runtime: python3.12
      # Runs after traffic shift
      # Validates deployment success
```

**CDK with CodeDeploy**:

```typescript
import * as codedeploy from 'aws-cdk-lib/aws-codedeploy';

const alias = fn.currentVersion.addAlias('live');

// ... (8 lines trimmed)
  },
});
```

### Deployment Hooks

**Pre-traffic hook (validation)**:

```python
# hooks.py
import boto3

lambda_client = boto3.client('lambda')
codedeploy = boto3.client('codedeploy')
// ... (30 lines trimmed)
            lifecycleEventHookExecutionId=event['LifecycleEventHookExecutionId'],
            status='Failed'
        )
```

**Post-traffic hook (verification)**:

```python
def post_traffic(event, context):
    """
    Verify deployment success after traffic shift
    """
    try:
// ... (29 lines trimmed)
            lifecycleEventHookExecutionId=event['LifecycleEventHookExecutionId'],
            status='Failed'
        )
```

## Rollback and Safety

### Automatic Rollback

**Configure rollback triggers**:

```yaml
DeploymentPreference:
  Type: Canary10Percent10Minutes
  Alarms:
    - !Ref ErrorAlarm
    - !Ref LatencyAlarm
  # Automatically rolls back if alarms trigger
```

**Rollback scenarios**:
- CloudWatch alarm triggers during deployment
- Pre-traffic hook fails
- Post-traffic hook fails
- Deployment manually stopped

### CloudWatch Alarms for Deployment

**Critical alarms during deployment**:

```typescript
// Error rate alarm
const errorAlarm = new cloudwatch.Alarm(this, 'ErrorAlarm', {
  metric: fn.metricErrors({
    statistic: 'Sum',
    period: Duration.minutes(1),
// ... (23 lines trimmed)
  threshold: 1,
  evaluationPeriods: 1,
});
```

### Version Management

**Use Lambda versions and aliases**:

```typescript
const version = fn.currentVersion;

const prodAlias = version.addAlias('prod');
const devAlias = version.addAlias('dev');
// ... (8 lines trimmed)
  ],
});
```

## Best Practices Checklist

### Pre-Deployment

- [ ] Code review completed
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Security scan completed
- [ ] Dependencies updated
- [ ] Infrastructure validated (CDK synth, SAM validate)
- [ ] Environment variables configured

### Deployment

- [ ] Use IaC (SAM, CDK, Terraform)
- [ ] Separate environments (dev, staging, prod)
- [ ] Automate deployments via CI/CD
- [ ] Use gradual deployment (canary or linear)
- [ ] Configure CloudWatch alarms
- [ ] Enable automatic rollback
- [ ] Use deployment hooks for validation

### Post-Deployment

- [ ] Monitor CloudWatch metrics
- [ ] Check CloudWatch Logs for errors
- [ ] Verify X-Ray traces
- [ ] Validate business metrics
- [ ] Check alarm status
- [ ] Review deployment logs
- [ ] Document any issues

### Rollback Preparation

- [ ] Keep previous version available
- [ ] Document rollback procedure
- [ ] Test rollback in non-prod
- [ ] Configure automatic rollback
- [ ] Monitor during rollback
- [ ] Communication plan for rollback

## Deployment Patterns

### Multi-Region Deployment

**Active-Passive**:

```typescript
// Primary region
new ServerlessStack(app, 'PrimaryStack', {
  env: { region: 'us-east-1' },
  isPrimary: true,
});
// ... (10 lines trimmed)
  resourcePath: '/health',
  fullyQualifiedDomainName: 'api.example.com',
});
```

**Active-Active**:

```typescript
// Deploy to multiple regions
const regions = ['us-east-1', 'us-west-2', 'eu-west-1'];

for (const region of regions) {
  new ServerlessStack(app, `Stack-${region}`, {
// ... (10 lines trimmed)
  ),
  geoLocation: route53.GeoLocation.country('US'),
});
```

### Feature Flags with AppConfig

**Safe feature rollout**:

```typescript
import { AppConfigData } from '@aws-sdk/client-appconfigdata';

const appconfig = new AppConfigData({});

export const handler = async (event: any) => {
// ... (10 lines trimmed)

  return legacyHandler(event);
};
```

## Summary

- **IaC**: Use SAM or CDK for all deployments
- **Environments**: Separate dev, staging, production
- **CI/CD**: Automate build, test, and deployment
- **Testing**: Unit, integration, and load testing
- **Gradual Deployment**: Use canary or linear for production
- **Alarms**: Configure and monitor during deployment
- **Rollback**: Enable automatic rollback on failures
- **Hooks**: Validate before and after traffic shifts
- **Versioning**: Use Lambda versions and aliases
- **Multi-Region**: Plan for disaster recovery
