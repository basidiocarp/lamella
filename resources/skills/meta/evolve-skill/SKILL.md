---
name: evolve-skill
description: "Captures skill evolution deltas by diffing what the skill guided vs what actually shipped, then stores the lesson in hyphae for skill authors to query."
origin: lamella
---

# Evolve Skill

This skill helps skill authors learn from real-world execution. After completing a skill-guided task, use it to capture the differences between what the skill suggested and what actually shipped, then store the delta in hyphae for future reference and skill improvement.

## When to Activate

Use this skill in these scenarios:

- You completed a task guided by a skill but deviated from its recommendations
- The skill guidance worked but you modified it in a meaningful way
- You discovered the skill was incomplete or missing steps
- You simplified or optimized the skill's suggested approach
- The skill didn't account for a constraint or pattern you encountered
- You want to capture lessons learned for the skill's maintainers

## How It Works

The skill performs four main steps:

### 1. Resolve the Skill Context

If invoked with a skill name, that becomes the subject. Otherwise, it uses the skill context from your current session (if available). If neither is available, it prompts for the skill name.

### 2. Capture the Actual Changes

It runs a git diff over the specified commit range (defaulting to HEAD~1..HEAD) to extract what code was actually added, removed, or modified. This becomes the ground truth of what shipped.

### 3. Compare Against Skill Guidance

It reads the skill's documented steps and recommendations, then maps the actual changes against them:
- **Additions**: changes you made that the skill did not suggest
- **Removals**: recommendations from the skill that you did not follow
- **Modifications**: places where you changed the skill's suggested approach

### 4. Generate and Store the Delta Report

It renders the delta in a structured format and stores it in hyphae using the MCP tool, associating it with the skill name for future recall.

## Delta Report Format

```
## Skill Evolution Delta — {skill-name} — {date}

### Additions (operator added, skill did not suggest)
- ...
- ...

### Removals (operator skipped, skill suggested)
- ...
- ...

### Modifications (operator changed the skill's approach)
- Original: ...
  Actual: ...
- Original: ...
  Actual: ...

### Notes
(free-form operator annotation)
```

## Example Delta

```
## Skill Evolution Delta — systematic-debugging — 2026-05-05

### Additions (operator added, skill did not suggest)
- Used git bisect instead of manual tracing to isolate the commit
- Added structured logging at component boundaries before tracing
- Created three failing test cases to cover different scenarios

### Removals (operator skipped, skill suggested)
- Did not follow Phase 2 pattern analysis step (already recognized the pattern from prior experience)
- Skipped writing a test for the hypothesis; confirmed manually instead

### Modifications (operator changed the skill's approach)
- Original: "Test minimally with the smallest possible change"
  Actual: Changed two related variables in the same fix after confirming they were coupled
- Original: "One variable at a time"
  Actual: Grouped coupled changes together since test passed on the grouped fix

### Notes
Prior experience with this codebase made Phase 2 skippable, but Phase 1 investigation was critical. The "one change at a time" guidance is sound but can be relaxed when changes are semantically coupled. Recommend adding a note to the skill about coupled variables.
```
