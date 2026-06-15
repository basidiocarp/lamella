# Security and Networking

## IAM

Prefer grant helpers over custom wildcard policies.

```typescript
table.grantReadWriteData(myFunction)
secret.grantRead(myFunction)
```

Reject broad policies like:

```typescript
new iam.PolicyStatement({
  actions: ["*"],
  resources: ["*"],
})
```

## Secrets

```typescript
const secret = new secretsmanager.Secret(this, "DbPassword", {
  generateSecretString: {
    excludePunctuation: true,
  },
})
secret.grantRead(myFunction)
```

## VPC

```typescript
const vpc = new ec2.Vpc(this, "Vpc", {
  maxAzs: 2,
  natGateways: 1,
})
```

Review for:

- least-privilege IAM
- managed secret access
- intentional subnet layout and egress cost choices
