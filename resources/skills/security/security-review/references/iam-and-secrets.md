# IAM and Secrets

## IAM Review Checklist

- no root-account usage for daily operations
- MFA on every privileged human account
- service accounts use roles or workload identity
- policies are resource-scoped and action-scoped
- unused credentials are removed quickly

Minimal AWS policy shape:

```yaml
iam_role:
  permissions:
    - s3:GetObject
    - s3:PutObject
  resources:
    - arn:aws:s3:::my-bucket/*
```

Reject:

```yaml
iam_role:
  permissions:
    - "*"
  resources:
    - "*"
```

## Secrets Management

Prefer a managed secrets service over env-only sprawl.

```typescript
import { SecretsManager } from "@aws-sdk/client-secrets-manager"

const client = new SecretsManager({ region: "us-east-1" })
const secret = await client.getSecretValue({ SecretId: "prod/api-key" })
const apiKey = JSON.parse(secret.SecretString ?? "{}").key
```

Review for:

- rotation configured for database and signing credentials
- no secrets in CI logs, crash reports, or shell history
- access logging enabled for secret reads
- no fallback hardcoded secrets in bootstrap code
