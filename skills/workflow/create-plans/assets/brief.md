# Brief Template

## Greenfield Brief (v1.0)

Copy and fill this structure for `.planning/BRIEF.md` when starting a new project:

```markdown
# [Project Name]

**One-liner**: [What this is in one sentence]

## Problem
// ... (22 lines trimmed)

- [Not doing X]
- [Not doing Y]
```

<guidelines>
- Keep under 50 lines
- Success criteria must be measurable/verifiable
- Out of scope prevents "while we're at it" creep
- This is the ONLY human-focused document
</guidelines>

## Brownfield Brief (v1.1+)

After shipping v1.0, update BRIEF.md to include current state:

```markdown
# [Project Name]

## Current State (Updated: YYYY-MM-DD)

**Shipped:** v[X.Y] [Name] (YYYY-MM-DD)
// ... (62 lines trimmed)
- [Not doing Y]

</details>
```

<brownfield_guidelines>
**When to update BRIEF:**
- After completing each milestone (v1.0 → v1.1 → v2.0)
- When starting new phases after a shipped version
- Use `complete-milestone.md` workflow to update systematically

**Current State captures:**
- What shipped (version, date)
- Real-world status (production, beta, etc.)
- User metrics (if applicable)
- User feedback themes
- Codebase stats (LOC, tech stack)
- Known issues needing attention

**Next Goals captures:**
- Vision for next version
- Why now (motivation)
- What's in scope
- What's measurable
- What's explicitly out

**Original Vision:**
- Collapsed in `<details>` tag
- Reference for "where we came from"
- Shows evolution of product thinking
- Checkboxes marked [x] for achieved goals

This structure makes all new plans brownfield-aware automatically because they read BRIEF and see:
- "v1.0 shipped"
- "2,450 lines of existing Swift code"
- "Users reporting X, requesting Y"
- Plans naturally reference existing files in @context
</brownfield_guidelines>

