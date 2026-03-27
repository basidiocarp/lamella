# Agents and Tool Access

Use this reference when an autonomous agent is expected to use MCP tools.

## Agent Access Model

Agents do not need command-style pre-allow lists. They can use tools Claude
determines are necessary, including MCP tools made available by the plugin.

## What To Document

Document:

- the types of MCP tools the agent is expected to use
- what success looks like after the tool call
- what to do when the tool is unavailable or returns partial data

Example:

```markdown
## Available Tools

Use the Asana MCP tools to inspect projects, search tasks, and update task
status. If the MCP server is unavailable, explain the blocker and stop rather
than inventing task state.
```

## Practical Rule

Agents may have broader tool access than commands, but they still need tighter
behavioral instructions than “use tools if needed.”
