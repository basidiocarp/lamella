---
name: code-review-process
description: "Run this when you need structured code review before merging — coordinates subagent feedback and produces technical evaluation report."
origin: lamella
---
# Code Review Process

## Requesting Reviews

### When to Request

**Mandatory:** After completing major features, before merge to main, after each task in agent-driven development.

**Optional:** When stuck, before refactoring, after fixing complex bugs.

### How to Request

1. Get SHAs: `BASE_SHA=$(git rev-parse HEAD~1)` and `HEAD_SHA=$(git rev-parse HEAD)`
2. Dispatch code-reviewer subagent with: what was implemented, plan/requirements, base/head SHAs
3. Act on feedback:
   - Fix **Critical** issues immediately
   - Fix **Important** issues before proceeding
   - Note **Minor** issues for later
   - Push back with reasoning if reviewer is wrong

### Review Cadence

- **Agent-driven development**: Review after EACH task
- **Executing plans**: Review after each batch (~3 tasks)
- **Ad-hoc**: Review before merge

---

## Receiving Reviews

### The Response Pattern

```
1. READ: Complete feedback without reacting
2. UNDERSTAND: Restate requirement in own words (or ask)
3. VERIFY: Check against codebase reality
4. EVALUATE: Technically sound for THIS codebase?
5. RESPOND: Technical acknowledgment or reasoned pushback
6. IMPLEMENT: One item at a time, test each
```

### Handling Unclear Feedback

If ANY item is unclear: **STOP**. Do not implement anything yet. Ask for clarification on all unclear items before proceeding — items may be related.

### From External Reviewers

Before implementing:
1. Is it technically correct for THIS codebase?
2. Does it break existing functionality?
3. Is there a reason for the current implementation?
4. Does the reviewer understand full context?

### YAGNI Check

If reviewer suggests "implementing properly": grep for actual usage. If unused → suggest removal (YAGNI).

### Implementation Order

1. Clarify anything unclear FIRST
2. Blocking issues (breaks, security)
3. Simple fixes (typos, imports)
4. Complex fixes (refactoring, logic)
5. Test each fix individually

### When to Push Back

- Suggestion breaks existing functionality
- Reviewer lacks full context
- Violates YAGNI
- Technically incorrect for this stack
- Conflicts with architectural decisions

Use technical reasoning, not defensiveness. Reference working tests/code.

### Acknowledging Correct Feedback

Do: "Fixed. [Brief description]" or "Good catch — [issue]. Fixed in [location]." or just fix it.

Don't: "You're absolutely right!", "Great point!", "Thanks for catching that!"

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Performative agreement | State requirement or just act |
| Blind implementation | Verify against codebase first |
| Batch without testing | One at a time, test each |
| Assuming reviewer is right | Check if breaks things |
| Avoiding pushback | Technical correctness > comfort |

## Reference Files

- [Code Reviewer](references/code-reviewer.md)
