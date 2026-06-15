# MCP Server Types

Use this reference to choose the transport shape for a plugin’s MCP server.

## `stdio`

Best for local tools and bundled servers launched as child processes.

```json
{
  "my-server": {
    "command": "npx",
    "args": ["-y", "my-mcp-server"]
  }
}
```

Rules:

- use `${CLAUDE_PLUGIN_ROOT}` for bundled paths
- pass config through args or env
- keep stdout reserved for protocol traffic

## `sse`

Best for hosted services with streaming responses or OAuth-backed auth.

```json
{
  "service": {
    "type": "sse",
    "url": "https://mcp.example.com/sse"
  }
}
```

Use HTTPS and document the auth expectations clearly.

## `http`

Best for request-response MCP backends where normal HTTP transport is enough.

Use explicit headers for bearer tokens or API keys.

## `ws`

Best for realtime or long-lived bidirectional transport, but only when the
server genuinely benefits from it.

## Practical Rule

Pick `stdio` for local/bundled tools and hosted transports for remote services.
Do not choose the most complex transport by default.
