---
name: skill-composer-studio
description: "Composes multiple existing skills into custom multi-step workflows with automatic handoffs."
origin: lamella
---

# Skill Composer Studio

Chain multiple skills into multi-step workflows with defined handoffs and conditional logic.

## When to Use

- User describes a task that spans two or more skill domains
- Building a repeatable workflow from existing skills
- Automating a multi-step process (e.g., "research → analyze → write → format")

## Composition Process

1. **Decompose the goal** into discrete steps. Each step should map to exactly one skill.
2. **Define the data contract** between steps — what output from step N becomes input for step N+1.
3. **Identify branch points** — steps where the next action depends on a condition (e.g., "if score > 80, skip review").
4. **Specify error handling** — what happens if a step produces insufficient output.
5. **Execute sequentially**, carrying context forward.

## Workflow Definition Format

Define composed workflows using this structure:

```yaml
workflow: content-research-pipeline
steps:
  - id: research
    skill: market-research
    input: "{{user_topic}}"
  - id: analyze
    skill: synthesize-findings
    input: "{{steps.research.output}}"
  - id: draft
    skill: content-writer
    input: "{{steps.analyze.output}}"
on_failure:
  - step: analyze
    action: retry_with_broader_scope
```

## Handoff Rules

- **Summarize, don't dump.** When passing output between steps, extract the relevant subset — not the full raw output.
- **Preserve attribution.** If step 1 found sources, carry them through to the final output.
- **Declare format expectations.** Each step should state whether it expects structured data, prose, or a list.

## Common Composition Patterns

### Research → Analysis → Deliverable
Skills: research skill → analysis skill → writing/formatting skill

### Audit → Fix → Verify
Skills: review/audit skill → implementation → testing/validation skill

### Generate → Evaluate → Refine
Skills: content generation skill → quality review → revision pass

## Output Format

1. **Workflow diagram** — ordered list of steps with skill names and data flow arrows
2. **Step details** — for each step: skill used, input source, expected output, conditions
3. **Execution results** — output from each step, clearly labeled
4. **Integrated final output** — the combined deliverable

## Quality Gate

- Every step maps to a real skill in the library
- Data contracts between steps are explicit (not implicit)
- At least one error/fallback path is defined
- Final output integrates contributions from all steps, not just the last one
