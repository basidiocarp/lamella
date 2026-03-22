# Track Templates

## Specification (spec.md) Structure

```markdown
# {Track Title}

## Overview

Brief description of what this track accomplishes and why.
// ... (61 lines trimmed)

- [ ] Question that needs resolution
- [x] Resolved question - Answer
```

## Plan (plan.md) Structure

```markdown
# Implementation Plan: {Track Title}

Track ID: `{track-id}`
Created: YYYY-MM-DD
Status: pending | in-progress | completed
// ... (45 lines trimmed)
| Phase 1 |                |      | pending |
| Phase 2 |                |      | pending |
| Phase 3 |                |      | pending |
```

## Track Registry (tracks.md) Format

```markdown
# Track Registry

## Active Tracks

| Track ID                                         | Type    | Status      | Phase | Started    | Assignee   |
// ... (12 lines trimmed)
| Track ID                                             | Reason     | Archived   |
| ---------------------------------------------------- | ---------- | ---------- |
| [old-feature_20241201](tracks/old-feature_20241201/) | Superseded | 2025-01-05 |
```

## Metadata (metadata.json) Fields

```json
{
  "id": "user-auth_20250115",
  "title": "User Authentication System",
  "type": "feature",
  "status": "in-progress",
// ... (24 lines trimmed)
  "dependencies": [],
  "tags": ["auth", "security"]
}
```
