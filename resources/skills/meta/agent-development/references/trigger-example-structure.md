# Trigger Example Structure

Each trigger example should cover:

- context
- exact user message
- assistant response before triggering if relevant
- commentary explaining why the trigger is correct
- assistant trigger line

## Minimal Shape

```markdown
<example>
Context: User just finished implementing authentication.
user: "Review my code"
assistant: "I'll review the auth implementation."
<commentary>
The user explicitly requests review after writing security-sensitive code.
</commentary>
assistant: "I'll use the code-reviewer agent to analyze it."
</example>
```
