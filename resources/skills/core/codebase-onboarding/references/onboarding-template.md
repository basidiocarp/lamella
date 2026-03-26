# Onboarding Template

Use this template as a starting point. Cut sections that do not help the target
audience.

```markdown
# [Project Name]

> One sentence on what this project does and who uses it.

## Quick Start

### Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| [Tool] | [Version] | [Install path] |

### Setup

```bash
[Clone]
[Install]
[Start local dependencies]
[Run migrations or setup]
[Start app]
```

### Verify It Works

- [ ] App or service starts
- [ ] Health check passes
- [ ] A representative test command passes

## Architecture Snapshot

- Entry points: ...
- Main services or packages: ...
- Data stores and queues: ...
- Important external dependencies: ...

## Key Files and Directories

| Path | Why it matters |
|------|----------------|
| `[path]` | [purpose] |

## Common Tasks

### Run tests

```bash
[test command]
```

### Start dev server

```bash
[dev command]
```

### Apply schema or config changes

```bash
[migration command]
```

## Debugging Notes

- Common failure: ...
- Useful logs: ...
- Useful verification command: ...

## Contribution Notes

- Branch or PR expectations: ...
- Testing expectations: ...
- Any local guardrails: ...
```

## Audience Notes

- Junior: emphasize setup, common tasks, and safe places to start.
- Senior: emphasize architecture, constraints, and operational risk.
- Contractor: emphasize ownership boundaries, integrations, and verification.
