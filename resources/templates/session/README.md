# Session Management Templates

Templates for managing Claude Code sessions and context.

## Templates

| File | Description |
|------|-------------|
| `SESSION-HANDOFF-TEMPLATE.md` | Structured handoff at 85% context (includes compaction priorities) |

## Usage

Use session handoff template when:
- Context window approaching 85%
- Switching between work streams
- Preserving important context before compaction

```bash
cp resources/templates/session/SESSION-HANDOFF-TEMPLATE.md .claude/HANDOFF.md
```

## See Also

- [Context handoff skill](../../skills/workflow/context-handoff/SKILL.md)
