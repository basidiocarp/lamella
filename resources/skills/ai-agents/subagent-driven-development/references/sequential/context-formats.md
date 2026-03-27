# Context Format Reference

Use these output formats to keep sequential implementation and judge passes
machine-readable and easy to hand off.

## Implementation Agent Output

```markdown
## Context for Next Steps

### Files Modified
- `path/to/file`

### Key Changes
- What changed
- Why it changed

### Validation
- Commands run
- Outcomes

### Risks or Follow-up
- Remaining uncertainty
```

The implementation output should optimize for continuity, not narration.

## Judge Verdict Output

### Pass

```markdown
---
VERDICT: PASS
SCORE: 4.2/5.0
ISSUES:
  - None
IMPROVEMENTS:
  - Optional follow-up
---
```

### Fail

```markdown
---
VERDICT: FAIL
SCORE: 2.8/5.0
ISSUES:
  - Concrete problem
IMPROVEMENTS:
  - Specific fix or retry guidance
---
```

Judge output should stay concrete:
- cite real defects
- separate defects from optional improvements
- make retry guidance actionable

## Final Summary Format

```markdown
## Sequential Execution Summary

**Overall Task:** ...
**Total Steps:** ...
**Outcome:** ...

### Step Results
- Step 1: pass
- Step 2: pass
- Step 3: fail

### Follow-up
- What should happen next
```

## Quality Rules

- self-critique first, external judge second
- do not proceed past a failed step without an explicit decision
- include integration concerns, not only local file quality
- keep the summary concise enough for the next operator to scan quickly

These formats exist to preserve chain state, not to produce polished prose.
