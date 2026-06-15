---
description: "Check hyphae for relevant context before implementing. Recalls past errors, corrections, and learned patterns."
requires:
  - hyphae
---

# Hyphae Context Recall

Before starting implementation, check hyphae for relevant context from past sessions.

## When to Check

- Starting a new feature or bugfix
- Encountering an error you may have seen before
- Working in a file or module that was recently corrected

## Search Commands

```bash
# Recent error resolutions (what broke and how it was fixed)
hyphae search --query "errors" --topic "errors/resolved" --limit 5

# Self-corrections (mistakes that were quickly fixed)
hyphae search --query "corrections" --limit 5

# Learned patterns (reusable skills extracted from past sessions)
hyphae search --query "learned" --limit 5

# Search by project
hyphae search --query "errors" -P $(basename $(git rev-parse --show-toplevel 2>/dev/null || pwd)) --limit 5
```

## Graceful Degradation

If hyphae is not available, proceed without context check. These searches are optional enrichment — never block work on hyphae availability.

## Scope Guard

A recalled memory reflects what was true when it was written — it can be stale.

Before using any recalled identifier, path, symbol, flag, config key, or numeric value in a file edit, a write, a commit, or any other mutation, re-verify it against current live state where a live check is feasible:

- Read the file, grep the symbol, or check the value before copying it through.
- If the recalled value disagrees with live state, trust live state and note the discrepancy.
- Prefer a live check over high-confidence recall when the recalled value will drive a mutation; if a live check is not feasible, proceed with caution and flag the assumption.
