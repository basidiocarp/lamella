---
name: your-skill-name
# name: lowercase letters, numbers, and hyphens only; max 64 characters
description: "Run this when [trigger condition] — [what it produces]."
# description: Write as a trigger condition, not a summary. Begin with "Run this when", "Use this to", "Invoke this if", or "Activate when".
origin: lamella
type: pipeline
# type: pipeline for on-demand workflow skills; use reference for always-loaded lookup skills
---

## When to Activate

<!-- Describe the trigger: what user request, context, or event causes this skill to fire. -->
Activate when [describe trigger condition].

## How It Works

<!-- Numbered phases. Each phase is one distinct step the agent takes. -->
1. **[Phase name]**: [What happens in this phase]
2. **[Phase name]**: [What happens in this phase]
3. **[Phase name]**: [What happens in this phase]

## Gotchas

<!-- List 2–5 failure modes, sharp edges, or "when not to use this" notes. -->
- [When or why this skill might fail or produce wrong output]
- [Prerequisites or incompatibilities]
- [Performance or token implications if relevant]

## Operating Contract

<!-- Required for autonomous or long-running skills. Remove this entire section for simple one-shot skills. -->

**Loop invariants**: [What must remain true throughout execution]

**Crash triage**: [What to do if the skill encounters an unrecoverable error]

**Timeout policy**: [How long before the skill should stop and report]

**NEVER STOP**: [Circumstances under which the skill must continue regardless of obstacles]

## Handoff Pointers

<!-- Optional: related skills, dependencies, or follow-up handoffs. Remove if not needed. -->
- Related: [skill name]
