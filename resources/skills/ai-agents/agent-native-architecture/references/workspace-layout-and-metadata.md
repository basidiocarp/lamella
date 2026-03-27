# Workspace Layout and Metadata

Design the shared workspace around the data the product manages.

## Recommended Structure

```text
Documents/
├── projects/
│   └── <project-id>/
│       ├── inputs/
│       ├── artifacts/
│       └── notes.md
├── sessions/
└── context.md
```

This is easier to reason about than actor-based layouts such as
`user_created/` and `agent_created/`.

## Naming Rules

- Prefer stable IDs or slugs over free-form titles in paths.
- Keep one predictable home for each durable artifact type.
- Use companion metadata only when the path and file body are not enough.

## Minimal Metadata

```yaml
---
created_by: agent
updated_by: user
updated_at: 2026-03-27
---
```

Store only metadata the app or agent will actually read.
