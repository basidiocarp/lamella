# Rotation and Scanning

## Rotation

The rotation plan should answer:

- who or what rotates the secret
- how consumers pick up the new value
- how rollback works
- when the old credential is revoked

### AWS Rotation Lambda Pattern

```python
import boto3

def lambda_handler(event, context):
    client = boto3.client("secretsmanager")
    secret_id = event["SecretId"]
    # Implement create, set, test, and finish rotation steps here.
    return {"statusCode": 200, "secret_id": secret_id}
```

### Manual Rotation Sequence

1. generate a new credential
2. store it in the secret system
3. roll consumers to the new credential
4. verify successful use
5. revoke the old credential

## Kubernetes and External Secrets

External Secrets Operator is useful when Kubernetes workloads need secrets sourced from Vault or cloud stores.

```yaml
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: app-secrets
spec:
  secretStoreRef:
    name: vault-backend
    kind: SecretStore
  target:
    name: app-secrets
  data:
    - secretKey: DB_PASSWORD
      remoteRef:
        key: database/config
        property: password
```

## Secret Scanning

Scanning needs at least two layers:

- pre-commit or local scanning to catch mistakes before push
- CI scanning to prevent merge drift

Good scanners include GitHub secret scanning, Gitleaks, GitGuardian, or TruffleHog.

## Review Checklist

- rotation cadence exists for each high-value secret type
- old credentials are revoked, not merely forgotten
- scanners run on new commits and PRs
- example code and docs do not contain realistic secrets
