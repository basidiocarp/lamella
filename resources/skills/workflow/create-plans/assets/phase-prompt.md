# Phase Prompt Template

Copy and fill this structure for `.planning/phases/XX-name/{phase}-{plan}-PLAN.md`:

**Naming:** Use `{phase}-{plan}-PLAN.md` format (e.g., `01-02-PLAN.md` for Phase 1, Plan 2)

```markdown
---
phase: XX-name
type: execute
domain: [optional - if domain skill loaded]
---
// ... (119 lines trimmed)
[If more plans in this phase: "Ready for {phase}-{next-plan}-PLAN.md"]
[If phase complete: "Phase complete, ready for next phase"]
</output>
```

<key_elements>
From create-meta-prompts patterns:
- XML structure for Claude parsing
- @context references for file loading
- Task types: auto, checkpoint:human-action, checkpoint:human-verify, checkpoint:decision
- Action includes "what to avoid and WHY" (from intelligence-rules)
- Verification is specific and executable
- Success criteria is measurable
- Output specification includes SUMMARY.md structure

**Scope guidance:**
- Aim for 3-6 tasks per plan
- If planning >7 tasks, split into multiple plans (01-01, 01-02, etc.)
- Target ~80% context usage maximum
- See ../references/scope-estimation.md for splitting guidance
</key_elements>

<good_examples>
```markdown
---
phase: 01-foundation
type: execute
domain: next-js
---
// ... (54 lines trimmed)
<output>
After completion, create `.planning/phases/01-foundation/01-01-SUMMARY.md`
</output>
```
</good_examples>

<bad_examples>
```markdown
# Phase 1: Foundation

## Tasks

### Task 1: Set up authentication
**Action**: Add auth to the app
**Done when**: Users can log in
```

This is useless. No XML structure, no @context, no verification, no specificity.
</bad_examples>
