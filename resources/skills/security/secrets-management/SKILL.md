---
name: secrets-management
description: Implement secure secrets management for CI/CD pipelines using Vault, AWS Secrets Manager, or native platform solutions. Use when handling sensitive credentials, rotating secrets, or securing CI/CD environments.
---

# Secrets Management


## Contents

- [Purpose](#purpose)
- [When to Use](#when-to-use)
- [Secrets Management Tools](#secrets-management-tools)
  - [HashiCorp Vault](#hashicorp-vault)
  - [AWS Secrets Manager](#aws-secrets-manager)
  - [Azure Key Vault](#azure-key-vault)
  - [Google Secret Manager](#google-secret-manager)
- [HashiCorp Vault Integration](#hashicorp-vault-integration)
  - [Setup Vault](#setup-vault)
  - [GitHub Actions with Vault](#github-actions-with-vault)
  - [GitLab CI with Vault](#gitlab-ci-with-vault)
- [AWS Secrets Manager](#aws-secrets-manager)
  - [Store Secret](#store-secret)
  - [Retrieve in GitHub Actions](#retrieve-in-github-actions)
  - [Terraform with AWS Secrets Manager](#terraform-with-aws-secrets-manager)
- [GitHub Secrets](#github-secrets)
  - [Organization/Repository Secrets](#organizationrepository-secrets)
  - [Environment Secrets](#environment-secrets)
- [GitLab CI/CD Variables](#gitlab-cicd-variables)
  - [Project Variables](#project-variables)
  - [Protected and Masked Variables](#protected-and-masked-variables)
- [Best Practices](#best-practices)
- [Secret Rotation](#secret-rotation)
  - [Automated Rotation with AWS](#automated-rotation-with-aws)
  - [Manual Rotation Process](#manual-rotation-process)
- [External Secrets Operator](#external-secrets-operator)
  - [Kubernetes Integration](#kubernetes-integration)
- [Secret Scanning](#secret-scanning)
  - [Pre-commit Hook](#pre-commit-hook)
  - [CI/CD Secret Scanning](#cicd-secret-scanning)
- [Reference Files](#reference-files)
- [Related Skills](#related-skills)


Secure secrets management practices for CI/CD pipelines using Vault, AWS Secrets Manager, and other tools.

## Purpose

Implement secure secrets management in CI/CD pipelines without hardcoding sensitive information.

## When to Use

- Store API keys and credentials
- Manage database passwords
- Handle TLS certificates
- Rotate secrets automatically
- Implement least-privilege access

## Secrets Management Tools

### HashiCorp Vault

- Centralized secrets management
- Dynamic secrets generation
- Secret rotation
- Audit logging
- Fine-grained access control

### AWS Secrets Manager

- AWS-native solution
- Automatic rotation
- Integration with RDS
- CloudFormation support

### Azure Key Vault

- Azure-native solution
- HSM-backed keys
- Certificate management
- RBAC integration

### Google Secret Manager

- GCP-native solution
- Versioning
- IAM integration

## HashiCorp Vault Integration

### Setup Vault

```bash
# Start Vault dev server
vault server -dev

# Set environment
// ... (6 lines trimmed)
# Store secret
vault kv put secret/database/config username=admin password=secret
```

### GitHub Actions with Vault

```yaml
name: Deploy with Vault Secrets

on: [push]

jobs:
// ... (16 lines trimmed)
        run: |
          echo "Connecting to database as $DB_USERNAME"
          # Use $DB_PASSWORD, $API_KEY
```

### GitLab CI with Vault

```yaml
deploy:
  image: vault:latest
  before_script:
    - export VAULT_ADDR=https://vault.example.com:8200
// ... (6 lines trimmed)
      echo "Deploying with secrets..."
      # Use $DB_PASSWORD, $API_KEY
```

**Reference:** See `references/vault-setup.md`

## AWS Secrets Manager

### Store Secret

```bash
aws secretsmanager create-secret \
  --name production/database/password \
  --secret-string "super-secret-password"
```

### Retrieve in GitHub Actions

```yaml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
// ... (12 lines trimmed)
  run: |
    # Use $DB_PASSWORD
    ./deploy.sh
```

### Terraform with AWS Secrets Manager

```hcl
data "aws_secretsmanager_secret_version" "db_password" {
  secret_id = "production/database/password"
}

// ... (5 lines trimmed)
  password            = jsondecode(data.aws_secretsmanager_secret_version.db_password.secret_string)["password"]
}
```

## GitHub Secrets

### Organization/Repository Secrets

```yaml
- name: Use GitHub secret
  run: |
    echo "API Key: ${{ secrets.API_KEY }}"
    echo "Database URL: ${{ secrets.DATABASE_URL }}"
```

### Environment Secrets

```yaml
deploy:
  runs-on: ubuntu-latest
  environment: production
  steps:
    - name: Deploy
      run: |
        echo "Deploying with ${{ secrets.PROD_API_KEY }}"
```

**Reference:** See `references/github-secrets.md`

## GitLab CI/CD Variables

### Project Variables

```yaml
deploy:
  script:
    - echo "Deploying with $API_KEY"
    - echo "Database: $DATABASE_URL"
```

### Protected and Masked Variables

- Protected: Only available in protected branches
- Masked: Hidden in job logs
- File type: Stored as file

## Best Practices

1. **Never commit secrets** to Git
2. **Use different secrets** per environment
3. **Rotate secrets regularly**
4. **Implement least-privilege access**
5. **Enable audit logging**
6. **Use secret scanning** (GitGuardian, TruffleHog)
7. **Mask secrets in logs**
8. **Encrypt secrets at rest**
9. **Use short-lived tokens** when possible
10. **Document secret requirements**

## Secret Rotation

### Automated Rotation with AWS

```python
import boto3
import json

def lambda_handler(event, context):
    client = boto3.client('secretsmanager')
// ... (18 lines trimmed)
    )

    return {'statusCode': 200}
```

### Manual Rotation Process

1. Generate new secret
2. Update secret in secret store
3. Update applications to use new secret
4. Verify functionality
5. Revoke old secret

## External Secrets Operator

### Kubernetes Integration

```yaml
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: vault-backend
  namespace: production
// ... (31 lines trimmed)
      remoteRef:
        key: database/config
        property: password
```

## Secret Scanning

### Pre-commit Hook

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Check for secrets with TruffleHog
// ... (6 lines trimmed)
  exit 1
fi
```

### CI/CD Secret Scanning

```yaml
secret-scan:
  stage: security
  image: trufflesecurity/trufflehog:latest
  script:
    - trufflehog filesystem .
  allow_failure: false
```

## Reference Files

- `references/vault-setup.md` - HashiCorp Vault configuration
- `references/github-secrets.md` - GitHub Secrets best practices

## Related Skills

- `github-actions-templates` - For GitHub Actions integration
- `gitlab-ci-patterns` - For GitLab CI integration
- `deployment-pipeline-design` - For pipeline architecture
