# Identity Types

## Common Identities

- AWS permission set
- AWS assume-role
- AWS assume-root
- AWS user for break-glass access
- Azure subscription
- GCP service account
- GCP project

## Examples

```yaml
auth:
  identities:
    prod-admin:
      kind: aws/assume-role
      via:
        identity: base-admin
      principal:
        assume_role: arn:aws:iam::999999999999:role/ProductionAdmin
```

```yaml
auth:
  identities:
    project-prod:
      kind: gcp/project
      principal:
        project_id: production-project
        region: us-central1
```

## Review Checklist

- the identity points to the correct provider or prior identity
- session length and scope match the job
- break-glass users stay isolated and rare
