# Commands and Allowed Tools

Use this reference when a slash command needs MCP access.

## Pre-Allow Exact Tools

Prefer explicit tool lists in frontmatter:

```markdown
---
allowed-tools: [
  "mcp__plugin_asana_asana__asana_search_tasks",
  "mcp__plugin_asana_asana__asana_create_task"
]
---
```

This keeps command scope reviewable and avoids accidental overreach.

## Wildcards

Use wildcards only when the command genuinely orchestrates a whole server
surface:

```markdown
---
allowed-tools: ["mcp__plugin_asana_asana__*"]
---
```

If you need a wildcard, explain why in the command instructions or docs.

## Instruction Pattern

Inside the command body:

1. validate user input
2. call the MCP tool with the validated fields
3. handle errors explicitly
4. report the result back to the user

Do not rely on the tool call alone to discover missing required fields if the
command can ask for them first.
