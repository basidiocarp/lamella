# Domain Expertise Structure

Use domain expertise skills to inject conventions that make plans more executable.

## Goal

Keep domain knowledge focused enough that it improves planning without flooding the context window.

## Suggested Shape

```text
skills/expertise/[domain-name]/
├── SKILL.md
├── references/
│   ├── always-useful.md
│   ├── database.md
│   ├── ui-layout.md
│   └── api-routes.md
```

## Rules

- Keep `SKILL.md` compact.
- Split references by concern.
- Load only the domain refs the phase actually needs.
