# Advanced Auth Patterns

Use these patterns only when the basic OAuth or static-token setup is not
enough.

## Dynamic Headers

If credentials expire quickly or must be computed at runtime, use
`headersHelper`.

```json
{
  "api": {
    "type": "sse",
    "url": "https://api.example.com",
    "headersHelper": "${CLAUDE_PLUGIN_ROOT}/scripts/get-headers.sh"
  }
}
```

The helper should emit a JSON object of headers and nothing else.

## Multi-Tenant Routing

Use headers or env vars to scope the server to a workspace, tenant, or region:

```json
{
  "headers": {
    "Authorization": "Bearer ${API_TOKEN}",
    "X-Tenant": "${TENANT_ID}"
  }
}
```

## Mixed Auth

Some services need both a token and extra context headers. Keep the split
obvious so users can tell which value is a credential and which value is just
routing metadata.

## Practical Rule

If the advanced setup requires custom scripts, document failure modes and
recovery steps beside the configuration example.
