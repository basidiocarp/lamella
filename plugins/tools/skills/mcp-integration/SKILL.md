---
name: mcp-integration
description: "Integrates MCP servers into Claude Code plugins and tools."
origin: lamella
---

# MCP Integration for Claude Code Plugins


## Contents

- [Overview](#overview)
- [MCP Server Configuration Methods](#mcp-server-configuration-methods)
- [MCP Server Types](#mcp-server-types)
- [Environment Variable Expansion](#environment-variable-expansion)
- [MCP Tool Naming](#mcp-tool-naming)
- [Quick Reference](#quick-reference)
- [Implementation Workflow](#implementation-workflow)
- [References](#references)

## Overview

Model Context Protocol (MCP) enables Claude Code plugins to integrate with external services and APIs by providing structured tool access.

**Key capabilities:**
- Connect to external services (databases, APIs, file systems)
- Provide 10+ related tools from a single service
- Handle OAuth and complex authentication flows
- Bundle MCP servers with plugins for automatic setup

## MCP Server Configuration Methods

### Method 1: Dedicated .mcp.json (Recommended)

Create `.mcp.json` at plugin root:

```json
{
  "database-tools": {
    "command": "${CLAUDE_PLUGIN_ROOT}/servers/db-server",
    "args": ["--config", "${CLAUDE_PLUGIN_ROOT}/config.json"],
    "env": {
      "DB_URL": "${DB_URL}"
    }
  }
}
```

### Method 2: Inline in plugin.json

Add `mcpServers` field to plugin.json:

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "mcpServers": {
    "plugin-api": {
      "command": "${CLAUDE_PLUGIN_ROOT}/servers/api-server",
      "args": ["--port", "8080"]
    }
  }
}
```

## MCP Server Types

| Type | Transport | Best For | Auth |
|------|-----------|----------|------|
| stdio | Process | Local tools, custom servers | Env vars |
| SSE | HTTP | Hosted services, cloud APIs | OAuth |
| HTTP | REST | API backends, token auth | Tokens |
| ws | WebSocket | Real-time, streaming | Tokens |

See [references/server-types.md](references/server-types.md) for detailed configurations.

## Environment Variable Expansion

**${CLAUDE_PLUGIN_ROOT}** - Plugin directory (always use for portability):
```json
{
  "command": "${CLAUDE_PLUGIN_ROOT}/servers/my-server"
}
```

**User environment variables** - From user's shell:
```json
{
  "env": {
    "API_KEY": "${MY_API_KEY}"
  }
}
```

## MCP Tool Naming

When MCP servers provide tools, they're automatically prefixed:

**Format:** `mcp__plugin_<plugin-name>_<server-name>__<tool-name>`

**Example:** `mcp__plugin_asana_asana__asana_create_task`

### Using MCP Tools in Commands

Pre-allow specific MCP tools in command frontmatter:

```markdown
---
allowed-tools: [
  "mcp__plugin_asana_asana__asana_create_task",
  "mcp__plugin_asana_asana__asana_search_tasks"
]
---
```

**Best practice:** Pre-allow specific tools, not wildcards, for security.

## Quick Reference

### Configuration Checklist

- [ ] Server type specified (stdio/SSE/HTTP/ws)
- [ ] Type-specific fields complete (command or url)
- [ ] Authentication configured
- [ ] Environment variables documented
- [ ] HTTPS/WSS used (not HTTP/WS)
- [ ] ${CLAUDE_PLUGIN_ROOT} used for paths

### Best Practices

**DO:**
- ✅ Use ${CLAUDE_PLUGIN_ROOT} for portable paths
- ✅ Document required environment variables
- ✅ Use secure connections (HTTPS/WSS)
- ✅ Pre-allow specific MCP tools in commands
- ✅ Test MCP integration before publishing

**DON'T:**
- ❌ Hardcode absolute paths
- ❌ Commit credentials to git
- ❌ Use HTTP instead of HTTPS
- ❌ Pre-allow all tools with wildcards

## Implementation Workflow

1. Choose MCP server type (stdio, SSE, HTTP, ws)
2. Create `.mcp.json` at plugin root with configuration
3. Use ${CLAUDE_PLUGIN_ROOT} for all file references
4. Document required environment variables in plugin docs or a bundled reference file
5. Test locally with `/mcp` command
6. Pre-allow MCP tools in relevant commands
7. Handle authentication (OAuth or tokens)
8. Test error cases (connection failures, auth errors)

## References

- [references/server-types.md](references/server-types.md) - Deep dive on each server type
- [references/authentication.md](references/authentication.md) - Authentication patterns and OAuth
- [references/integration-patterns.md](references/integration-patterns.md) - Integration patterns with examples
- [references/testing-debugging.md](references/testing-debugging.md) - Testing, debugging, common issues
- [references/tool-usage.md](references/tool-usage.md) - Using MCP tools in commands and agents

### External Resources

- **Official MCP Docs**: https://modelcontextprotocol.io/
- **Claude Code MCP Docs**: https://docs.claude.com/en/docs/claude-code/mcp
- **MCP SDK**: @modelcontextprotocol/sdk
