# MCP Authentication Patterns

Use this file as the routing page for MCP authentication choices.

## Open These References By Task

1. [oauth-and-token-auth.md](./oauth-and-token-auth.md)
   Use for hosted HTTP or SSE servers that rely on OAuth, bearer tokens, API
   keys, or header-based auth.
2. [stdio-and-env-auth.md](./stdio-and-env-auth.md)
   Use for local stdio servers that receive credentials through environment
   variables.
3. [advanced-auth-patterns.md](./advanced-auth-patterns.md)
   Use for rotating headers, multi-tenant routing, signed requests, or mixed
   auth setups.
4. [auth-troubleshooting.md](./auth-troubleshooting.md)
   Use when the server connects but authentication or authorization still fails.

## Quick Pick

| Server type | Usual auth path |
|-------------|-----------------|
| Hosted SSE or HTTP | OAuth or bearer token |
| Hosted HTTP with custom gateway | API key or custom header |
| Local stdio | Environment variables |
| Expiring or computed credentials | `headersHelper` |

## Practical Rule

Prefer the simplest secure mechanism the server already supports. Document the
user setup clearly, keep secrets out of the repo, and avoid inventing a custom
auth flow when OAuth or standard tokens already fit.
