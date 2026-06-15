# Phase 2: Pruning (Vote for Top 3 Candidates)

Launch **3 independent judges in parallel**.

1. Each judge receives all proposal files.
2. Judges score each proposal for:
   - feasibility
   - alignment
   - potential
   - risk
3. Each judge produces:
   - scores with evidence
   - ranked top 3 proposals
   - rationale for selections
4. Save votes to `.specs/research/{solution-name}-{date}.pruning.[1|2|3].md`.

**Key principle:** Independent scoring reduces groupthink.

## Prompt Template for Pruning Judges

```markdown
You are evaluating proposed approaches to select the top 3 for expansion.

<task>
{task_description}
</task>

<proposals>
{proposal_files}
</proposals>

Score each proposal on:
- Feasibility (1-5)
- Alignment (1-5)
- Potential (1-5)
- Risk (1-5, inverse)

Output:
1. Score table
2. Ranked top 3
3. Short rationale for each selected proposal

CRITICAL:
- Base the evaluation on evidence from proposals, not assumptions.
- Your top 3 must be ranked 1st, 2nd, and 3rd.
```

## Phase 2b: Select Top 3 Proposals

After judges complete voting:

1. Aggregate votes using ranked choice:
   - 1st = 3 points
   - 2nd = 2 points
   - 3rd = 1 point
2. Select the top 3 by total points.
3. Handle ties using average criterion scores.
4. Document the result in `.specs/research/{solution-name}-{date}.selection.md`.

## Output Naming

**Pruning files:** `.specs/research/{solution-name}-{YYYY-MM-DD}.pruning.[1|2|3].md`  
**Selection file:** `.specs/research/{solution-name}-{YYYY-MM-DD}.selection.md`
