# Identity Chaining and CI

## Common Chains

- SSO to cross-account role
- multi-hop role chains
- SAML followed by assume-role
- GitHub Actions OIDC into cloud roles

Example:

```yaml
auth:
  identities:
    cross-account:
      kind: aws/assume-role
      via:
        identity: base-admin
      principal:
        assume_role: arn:aws:iam::999999999999:role/CrossAccountRole
```

## CI Notes

- GitHub OIDC workflows need `id-token: write`
- use short-lived role assumption instead of static CI secrets
- validate claim mapping and audience before rollout
