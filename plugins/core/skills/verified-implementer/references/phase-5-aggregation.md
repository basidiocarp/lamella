# Phase 5: Aggregation and Reporting

## Panel Voting Algorithm

When using 2+ evaluations, follow these manual computation steps:

- Think in steps, output each step result separately.
- Do not skip steps.

### Step 1: Collect Scores per Criterion

Create a table with each criterion and scores from all evaluations:

| Criterion | Eval 1 | Eval 2 | Median | Difference |
|-----------|--------|--------|--------|------------|
| [Name 1]  | X.X    | X.X    | ?      | ?          |
| [Name 2]  | X.X    | X.X    | ?      | ?          |

### Step 2: Calculate Median for Each Criterion

For 2 evaluations: **Median = (Score1 + Score2) / 2**

For 3+ evaluations: sort scores, then take the middle value, or average the two middle values if the count is even.

### Step 3: Check for High Variance

**High variance** = evaluators disagree significantly (difference > 2.0 points)

Formula: `|Eval1 - Eval2| > 2.0` → flag as high variance

### Step 4: Calculate Weighted Overall Score

Multiply each criterion's median by its weight and sum:

```text
Overall = (Criterion1_Median × Weight1) + (Criterion2_Median × Weight2) + ...
```

### Step 5: Determine Pass/Fail

Compare overall score to threshold:

- `Overall ≥ Threshold` → **PASS** ✅
- `Overall < Threshold` → **FAIL** ❌

---

## Handling Disagreement

If evaluations significantly disagree (difference > 2.0 on any criterion):

1. Flag the criterion.
2. Present both evaluators' reasoning.
3. Ask the user whether to review manually.
4. If yes, present evidence and capture the user decision.
5. If no, use the median as the conservative path.

---

## Final Report Template

After all steps complete and DoD verification passes:

```markdown
## Implementation Summary

### Task Status
- Task Status: `done` ✅
- All Definition of Done items: X/X PASS (100%)
- Final verdict: PASS | FAIL

### Evaluation Summary
| Criterion | Median | Weight | Weighted Score | Variance |
|-----------|--------|--------|----------------|----------|
| [Criterion] | X.X | 0.X | X.XX | Low/High |

### Evidence
- Code changes: [files or commits]
- Tests run: [list]
- Verification artifacts: [reports, logs, screenshots]

### Open Risks
- [Residual issue 1]
- [Residual issue 2]

### Recommendation
1. [Ship, rework, or request manual review]
2. [Any follow-up actions]
```

---

## Execution Flow Diagram

```text
Phase 0: Select task
  ↓
Phase 1: Implement change
  ↓
Phase 2: Verify against Definition of Done
  ↓
Phase 3: Run judge evaluations
  ↓
Phase 4: Aggregate scores and flag disagreement
  ↓
Phase 5: Produce final report and recommendation
```
