# Provider Types

## Common Providers

- AWS IAM Identity Center (SSO)
- AWS SAML
- GitHub Actions OIDC
- GCP ADC
- GCP Workload Identity Federation

## Examples

```yaml
auth:
  providers:
    company-sso:
      kind: aws/iam-identity-center
      region: us-east-1
      start_url: https://example.awsapps.com/start
```

```yaml
auth:
  providers:
    github-oidc:
      kind: github/oidc
      region: us-east-1
```

## Review Checklist

- required provider fields are present
- CI providers have the matching workflow permissions
- WIF token sources are explicit outside GitHub Actions
