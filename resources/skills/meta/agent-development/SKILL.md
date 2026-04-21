---
name: agent-development
description: "Guides agent development for Claude Code plugins."
origin: lamella
---
# Agent Development for Claude Code Plugins

Use this skill when creating or revising Claude Code agents. Keep the main skill focused on frontmatter decisions, prompt structure, and testing flow; use the linked references for examples and validation detail.

## When to Use

- Creating a new plugin agent
- Revising description triggers or examples
- Choosing model, color, or tool restrictions
- Tightening a system prompt for autonomy and output quality

## Core Workflow

1. Pick a clear agent identifier.
2. Write a trigger description with concrete examples.
3. Choose model, color, and tool scope.
4. Write the system prompt in second person.
5. Validate triggering and prompt shape before shipping.

## Minimal Agent Shape

```markdown
---
name: code-reviewer
description: Use this agent when reviewing changes for bugs, risks, or regressions.
model: inherit
color: blue
tools: ["Read", "Grep"]
---

You are a focused code reviewer.
```

## References

- [references/creation-process.md](references/creation-process.md)
- [references/system-prompt-design.md](references/system-prompt-design.md)
- [references/triggering-patterns.md](references/triggering-patterns.md)
- [references/triggering-examples.md](references/triggering-examples.md)
- [references/trigger-example-structure.md](references/trigger-example-structure.md)
- [references/trigger-example-types.md](references/trigger-example-types.md)
- [references/trigger-example-mistakes.md](references/trigger-example-mistakes.md)
- [references/examples.md](references/examples.md)
- [examples/agent-creation-prompt.md](examples/agent-creation-prompt.md)
- [examples/complete-agent-examples.md](examples/complete-agent-examples.md)
