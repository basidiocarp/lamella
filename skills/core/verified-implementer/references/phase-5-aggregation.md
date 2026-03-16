# Phase 5: Aggregation and Reporting

## Panel Voting Algorithm

When using 2+ evaluations, follow these manual computation steps:

- Think in steps, output each step result separately!
- Do not skip steps!

### Step 1: Collect Scores per Criterion

Create a table with each criterion and scores from all evaluations:

| Criterion | Eval 1 | Eval 2 | Median | Difference |
|-----------|--------|--------|--------|------------|
| [Name 1]  | X.X    | X.X    | ?      | ?          |
| [Name 2]  | X.X    | X.X    | ?      | ?          |

### Step 2: Calculate Median for Each Criterion

For 2 evaluations: **Median = (Score1 + Score2) / 2**

For 3+ evaluations: Sort scores, take middle value (or average of two middle values if even count)

### Step 3: Check for High Variance

**High variance** = evaluators disagree significantly (difference > 2.0 points)

Formula: `|Eval1 - Eval2| > 2.0` → Flag as high variance

### Step 4: Calculate Weighted Overall Score

Multiply each criterion's median by its weight and sum:

```
Overall = (Criterion1_Median × Weight1) + (Criterion2_Median × Weight2) + ...
```

### Step 5: Determine Pass/Fail

Compare overall score to threshold:

- `Overall ≥ Threshold` → **PASS** ✅
- `Overall < Threshold` → **FAIL** ❌

---

## Handling Disagreement

If evaluations significantly disagree (difference > 2.0 on any criterion):

1. Flag the criterion
2. Present both evaluators' reasoning
3. Ask user: "Evaluators disagree on [criterion]. Review manually?"
4. If yes: present evidence, get user decision
5. If no: use median (conservative approach)

---

## Final Report Template

After all steps complete and DoD verification passes:

```markdown
## Implementation Summary

### Task Status
- Task Status: `done` ✅
- All Definition of Done items: X/X PASS (100%)
// ... (68 lines trimmed)

1. [Any follow-up actions]
2. [Suggested improvements]
```

---

## Execution Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                IMPLEMENT TASK WITH VERIFICATION               │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Phase 0: Select Task                                         │
// ... (63 lines trimmed)
│  └─────────────────────────────────────────────────────────┘  │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```
