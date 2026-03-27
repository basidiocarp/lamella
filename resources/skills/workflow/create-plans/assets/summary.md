# Summary Template

Use this structure for `SUMMARY.md` when a phase completes.

```markdown
# Phase [X]: [Name] Summary

**[One sentence describing what shipped]**

## Accomplishments
- [completed outcome]
- [completed outcome]

## Verification
- [test or validation run]
- [manual check if relevant]

## Notes
- [key implementation or migration note]

---
*Phase: XX-name*
*Completed: YYYY-MM-DD*
```

## One-Liner Rule

The opening sentence must describe what shipped, not just that work is done.

Good:
- `JWT auth with refresh rotation and protected API middleware`
- `Realtime dashboard backed by server-sent events`

Bad:
- `Phase complete`
- `Implementation finished`
