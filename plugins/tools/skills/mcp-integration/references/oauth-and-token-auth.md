# OAuth and Token Auth

Use this reference for hosted HTTP or SSE MCP servers.

## OAuth

Claude Code handles OAuth for compatible hosted servers. The server advertises
the flow; Claude opens the browser, stores tokens securely, and refreshes them
when possible.

Minimal hosted configuration:

```json
{
  "service": {
    "type": "sse",
    "url": "https://mcp.example.com/sse"
  }
}
```

Document scopes in user-facing docs so people know what they are authorizing.

## Bearer Tokens

Use bearer tokens when the provider issues static or rotated API tokens.

```json
{
  "api": {
    "type": "http",
    "url": "https://api.example.com/mcp",
    "headers": {
      "Authorization": "Bearer ${API_TOKEN}"
    }
  }
}
```

## API Keys and Custom Headers

```json
{
  "api": {
    "type": "http",
    "url": "https://api.example.com/mcp",
    "headers": {
      "X-API-Key": "${API_KEY}",
      "X-Workspace": "${WORKSPACE_ID}"
    }
  }
}
```

Use standard `Authorization` headers when the service supports them. Fall back
to provider-specific headers only when required.

## Documentation Rule

Always document:

- required environment variables
- scope or permission expectations
- where users obtain the token
- whether tokens are read-only or write-capable
