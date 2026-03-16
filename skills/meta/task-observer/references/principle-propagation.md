# Principle Propagation

Cross-cutting principles are patterns or rules that apply across multiple
skills, not just the one where they were first observed.

## Cross-Cutting Principles File

Location: `[workspace]/skill-observations/cross-cutting-principles.md`

This file tracks principles that should be reflected in multiple skills.

### How It Works

1. **Discovery** — During observation logging, you notice a pattern that
   applies broadly (e.g., "always validate inputs before processing,"
   "prefer immutable data structures").
2. **Recording** — Add the principle to the cross-cutting principles file
   with its origin observation, status, and the skills it should propagate to.
3. **Propagation** — During the weekly review (Step 4), check whether each
   active principle has been applied to all target skills.
4. **Completion** — Once a principle is fully propagated, mark it as
   `PROPAGATED` with the date.

### Propagation Timing

- **Immediate propagation:** If the principle addresses a correctness or
  safety concern, propagate it to all target skills in the current session.
- **Opportunistic propagation:** For style or efficiency principles, note the
  targets and propagate during the next weekly review.

### File Structure

```markdown
# Cross-Cutting Principles

## Principle 1: [Title]
**Status:** ACTIVE | PROPAGATED
**Origin:** Observation [N], [date]
**Description:** [What the principle states and why it matters]
**Target skills:**
- [ ] [skill-name-1]
- [ ] [skill-name-2]
- [x] [skill-name-3] (applied [date])

**Propagated on:** [date, once all targets are checked]

---
```

## Best Practices

- Keep principle descriptions concise — one or two sentences.
- Limit target skills to those where the principle is genuinely relevant.
  Not every principle applies everywhere.
- When propagating, adapt the principle's language to fit the target skill's
  conventions rather than pasting identical text everywhere.
- Retire principles that become so well-established they no longer need
  tracking.
