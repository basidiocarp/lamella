# Track Templates

## Specification (`spec.md`) Structure

```markdown
# {Track Title}

## Overview

Brief description of what this track accomplishes and why it exists.

## Problem

- Current state:
- Desired state:
- Why this matters now:

## Goals

- [ ] Primary goal
- [ ] Secondary goal

## Non-Goals

- Explicitly out of scope item

## Requirements

- Functional:
- Non-functional:
- Constraints:

## Open Questions

- [ ] Question that needs resolution
- [x] Resolved question - Answer
```

## Plan (`plan.md`) Structure

```markdown
# Implementation Plan: {Track Title}

Track ID: `{track-id}`
Created: YYYY-MM-DD
Status: pending | in-progress | completed

## Milestones

1. Discovery
2. Implementation
3. Validation

## Tasks

- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

## Risks

- Risk: description
  Mitigation: response

## Verification

- Automated tests:
- Manual checks:
- Rollback notes:

## Phase Summary

| Phase   | Owner | Notes | Status      |
|---------|-------|-------|-------------|
| Phase 1 |       |       | pending     |
| Phase 2 |       |       | pending     |
| Phase 3 |       |       | pending     |
```

## Track Registry (`tracks.md`) Format

```markdown
# Track Registry

## Active Tracks

| Track ID | Type | Status | Phase | Started | Assignee |
|----------|------|--------|-------|---------|----------|
| [user-auth_20250115](tracks/user-auth_20250115/) | feature | in-progress | implementation | 2025-01-15 | @owner |

## Archived Tracks

| Track ID | Reason | Archived |
|----------|--------|----------|
| [old-feature_20241201](tracks/old-feature_20241201/) | Superseded | 2025-01-05 |
```

## Metadata (`metadata.json`) Fields

```json
{
  "id": "user-auth_20250115",
  "title": "User Authentication System",
  "type": "feature",
  "status": "in-progress",
  "phase": "implementation",
  "created_at": "2025-01-15",
  "updated_at": "2025-01-16",
  "owner": "@owner",
  "dependencies": [],
  "tags": ["auth", "security"]
}
```
