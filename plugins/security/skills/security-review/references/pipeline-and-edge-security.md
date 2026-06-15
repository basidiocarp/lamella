# Pipeline and Edge Security

## CI and CD Hardening

Look for:

- OIDC or workload identity instead of long-lived CI credentials
- secrets scanning and dependency scanning in the pipeline
- branch protection before deployment
- signed artifacts or provenance where the platform supports it

GitHub Actions pattern:

```yaml
permissions:
  id-token: write
  contents: read

steps:
  - uses: actions/checkout@v4
  - uses: aws-actions/configure-aws-credentials@v4
    with:
      role-to-assume: arn:aws:iam::123456789:role/GitHubActionsRole
      aws-region: us-east-1
```

## Edge and CDN Security

Check:

- WAF enabled
- rate limiting configured
- bot protection enabled where available
- TLS in strict mode
- security headers added at the edge or origin

```typescript
export default {
  async fetch(request: Request): Promise<Response> {
    const response = await fetch(request)
    return new Response(response.body, {
      headers: {
        ...Object.fromEntries(response.headers),
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
      },
    })
  },
}
```
