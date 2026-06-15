# Prompt Construction (Phase 4)

Build one consistent prompt shape for every parallel target. Only the target
details should vary.

## Required Structure

1. reasoning/setup prefix
2. task body with target-specific context
3. self-check and delivery instructions

Keep the prompt stable across targets so results are comparable.

## Prefix

Open with a short reasoning frame, not a long essay. The purpose is to slow the
worker into checking scope before acting.

```markdown
## Reasoning Approach

Work through the task before editing.
- Identify the target scope.
- Check likely failure modes.
- Prefer the simplest correct approach.
```

Do not let the prefix become a generic chain-of-thought dump. It should shape
behavior, not add noise.

## Task Body

The body should include the exact inputs the worker needs and no more.

```markdown
<task>
Implement the requested change for this target.
</task>

<target>
File or slice: ...
Goal: ...
Constraints: ...
</target>

<output>
Expected deliverable and any validation notes.
</output>
```

Good target blocks answer:
- what this worker owns
- what files or scope are in bounds
- what outcome counts as done

## Self-Check Suffix

Close with a short mandatory verification block.

```markdown
## Self-Check

Before you finish:
1. Confirm the change stays within target scope.
2. Check for obvious regressions or missing edge cases.
3. Summarize what changed and any validation performed.
```

Make the worker verify scope, correctness, and reporting. Avoid giant checklists
unless the task is truly high risk.

## Construction Rules

- keep the prefix and suffix identical across siblings
- vary only the task body and target block
- be explicit about ownership boundaries
- state expected output format up front
- do not bury critical constraints inside prose

## Failure Pattern

If workers return inconsistent outputs, the prompt is usually drifting in one of
three ways:
- different scope descriptions per target
- vague ownership boundaries
- mismatched output expectations

Fix the prompt shape before adding more instructions.
