# Phase Prompt Template

Use this structure for `.planning/phases/XX-name/{phase}-{plan}-PLAN.md`.

## Naming

- file format: `{phase}-{plan}-PLAN.md`
- example: `01-02-PLAN.md`

## Core Template

```markdown
---
phase: XX-name
type: execute
domain: [optional]
---

<context>
@.planning/roadmap.md
@.planning/product.md
[add any phase-specific files]
</context>

<tasks>
1. [specific task]
2. [specific task]
3. [specific task]
</tasks>

<verification>
- [executable check]
- [executable check]
</verification>

<success_criteria>
- [measurable outcome]
- [measurable outcome]
</success_criteria>

<output>
After completion, create `.planning/phases/XX-name/{phase}-{plan}-SUMMARY.md`
</output>
```

## Rules

- aim for `3-6` tasks per plan
- keep verification concrete and runnable
- specify what to avoid when a failure mode is likely
- split large plans before context gets crowded
