# Using MCP Tools in Commands and Agents

Use this file as the routing page for MCP tool consumption patterns.

## Open These References By Task

1. [commands-and-allowed-tools.md](./commands-and-allowed-tools.md)
   Use for command frontmatter, pre-allow lists, and wildcard decisions.
2. [agents-and-tool-access.md](./agents-and-tool-access.md)
   Use for agent behavior, autonomy, and when to document expected MCP tools.
3. [tool-call-patterns.md](./tool-call-patterns.md)
   Use for sequential calls, validation, batching, and schema-aware usage.
4. [testing-and-troubleshooting.md](./testing-and-troubleshooting.md)
   Use when tool discovery, parameters, or runtime behavior are failing.

## Naming Convention

MCP tools are exposed as:

```text
mcp__plugin_<plugin-name>_<server-name>__<tool-name>
```

Use `/mcp` to discover exact server names, tool names, and input schemas.

## Practical Rule

Commands should ask for the smallest safe allowed-tool surface. Agents can be
broader, but they still need explicit instructions about what the tool is for
and how to behave when it fails.
