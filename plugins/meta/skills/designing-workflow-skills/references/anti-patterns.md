# Anti-Patterns Catalog

Use this catalog to spot the failures that make workflow skills hard to route,
hard to execute, or hard to maintain.

## Scope and Structure

### Vague Activation Descriptions

If the description is too broad, the skill activates at the wrong times. If it
is too vague, it fails to activate when needed.

Better pattern:
- describe the concrete task
- include likely trigger terms
- keep it in third-person, action-led voice

### Monolithic `SKILL.md`

When the parent file carries every example, edge case, and workflow detail, the
important instructions get buried.

Better pattern:
- keep `SKILL.md` as routing and core behavior
- push detailed examples into adjacent `references/`
- keep files one hop from the parent where possible

### Reference Chains

Avoid deep chains like:

```text
SKILL.md -> ref A -> ref B -> ref C
```

Each extra hop increases latency and makes the core workflow easier to lose.

## Workflow Design

### Unnumbered or Implicit Phases

If the workflow order is only implied in prose, execution drifts.

Better pattern:
- numbered phases
- clear entry conditions
- clear exit conditions

### Missing Verification

A workflow that ends at “produce the output” will eventually ship placeholders,
broken paths, or incomplete artifacts.

Every substantial workflow needs a closing validation step.

### Weak Routing Keywords

If multiple routes match the same phrasing, the skill becomes unpredictable.

Use distinct routing signals and add a fallback path when ambiguity is expected.

## Authoring and Portability

### Hardcoded Paths

Absolute local paths make the skill non-portable. Use relative paths or the
skill’s path conventions instead.

### Broken File References

If `SKILL.md` points to files that do not exist, the skill silently degrades.

Always verify linked files before closing the authoring pass.

## Prompt and Output Drift

### Overloaded Criteria or Steps

If one step or criterion tries to measure too many things, the model applies it
inconsistently.

Keep one step for one outcome. Keep one evaluation criterion for one dimension.

### No Definition of Done

Without explicit completion checks, the model either stops too early or keeps
refining indefinitely.

## Quick Checklist

| Anti-pattern | Better default |
|---|---|
| vague description | concrete trigger-based description |
| oversized `SKILL.md` | route parent plus focused refs |
| chained references | one-hop references |
| prose-only workflow | numbered phases with entry/exit checks |
| no verification | explicit final validation step |
| hardcoded paths | relative or base-dir-aware paths |
| overlapping routing | distinct keywords plus fallback |

Use this list as a review filter before adding more content to a workflow skill.
