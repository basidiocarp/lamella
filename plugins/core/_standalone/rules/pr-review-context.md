---
description: "Check hyphae for past PR review feedback before creating PRs. Helps avoid repeating mistakes that reviewers previously flagged."
requires:
  - hyphae
---

# PR Review Context

Before creating a PR, check hyphae for past review feedback on similar files:

```bash
hyphae search --query "reviews {filename}" --limit 5
```

Common reviewer patterns are stored as memories to help avoid repeated feedback.

## When to Check

- Before creating a new PR
- When modifying files that received review comments in the past
- When working on a feature similar to one that was previously reviewed

## Search Commands

```bash
# Past reviews for a specific file
hyphae search --query "reviews src/auth.rs" --limit 5

# All reviews for a PR number
hyphae search --topic "reviews/42" --limit 10

# Recent review feedback for the project
hyphae search --query "review pr" -P $(basename $(git rev-parse --show-toplevel 2>/dev/null || pwd)) --limit 5
```

## Graceful Degradation

If hyphae is not available, proceed without context check. These searches are optional enrichment — never block work on hyphae availability.
