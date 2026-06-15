# Cloud Secret Stores

## AWS Secrets Manager

Store once, fetch at runtime, and enable rotation for high-value credentials.

```bash
aws secretsmanager create-secret \
  --name production/database/password \
  --secret-string '{"password":"super-secret-password"}'
```

```yaml
- uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: arn:aws:iam::123456789:role/GitHubActionsRole
    aws-region: us-east-1
- run: |
    DB_PASSWORD=$(aws secretsmanager get-secret-value \
      --secret-id production/database/password \
      --query SecretString --output text)
    ./deploy.sh
```

## Azure Key Vault

Use managed identity or workload identity and fetch secrets at runtime instead of exporting them permanently into the pipeline environment.

## Google Secret Manager

Prefer service-account impersonation or workload identity federation over downloaded JSON keys.

## Terraform Retrieval Pattern

```hcl
data "aws_secretsmanager_secret_version" "db_password" {
  secret_id = "production/database/password"
}

locals {
  db_password = jsondecode(data.aws_secretsmanager_secret_version.db_password.secret_string)["password"]
}
```

## Review Checklist

- secret reads are audited
- roles are resource-scoped
- rotation exists for credentials that support it
- production and non-production secrets are isolated
