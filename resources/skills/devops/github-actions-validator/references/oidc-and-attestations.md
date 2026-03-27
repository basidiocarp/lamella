# OIDC and Attestations

## OIDC

Required permission:

```yaml
permissions:
  id-token: write
  contents: read
```

Review for:

- provider trust policy matches the workflow claims
- audience and branch restrictions are intentional
- long-lived cloud keys were removed when OIDC was added

## Attestations

```yaml
permissions:
  id-token: write
  attestations: write
```

Check:

- subject paths point at real build artifacts
- action versions are current
- provenance is attached to the intended artifact set
