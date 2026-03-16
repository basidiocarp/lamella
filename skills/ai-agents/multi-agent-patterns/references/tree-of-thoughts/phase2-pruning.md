# Phase 2: Pruning (Vote for Top 3 Candidates)

Launch **3 independent judges in parallel** (recommended: Sonnet for efficiency):

1. Each judge receives **ALL proposal files** (from `.specs/research/`)
2. Judges evaluate each proposal against **pruning criteria**:
   - **Feasibility** (1-5): Can this be implemented with available resources?
   - **Alignment** (1-5): How well does it address the task requirements?
   - **Potential** (1-5): Likelihood of producing high-quality result?
   - **Risk** (1-5, inverse): How manageable are the identified risks?
3. Each judge produces:
   - **Scores for each proposal** (with evidence)
   - **Vote for top 3 proposals** to expand
   - **Rationale** for selections
4. Votes saved to `.specs/research/{solution-name}-{date}.pruning.[1|2|3].md`

**Key principle:** Independent evaluation with explicit criteria reduces groupthink and catches different strengths/weaknesses.

## Prompt Template for Pruning Judges

```markdown
You are evaluating {N} proposed approaches to select the top 3 for full development.

<task>
{task_description}
</task>
// ... (39 lines trimmed)
CRITICAL:
- Base your evaluation on evidence from proposals, not assumptions
- Your top 3 should be ranked: 1st choice, 2nd choice, 3rd choice
```

## Phase 2b: Select Top 3 Proposals

After judges complete voting:

1. **Aggregate votes** using ranked choice:
   - 1st choice = 3 points
   - 2nd choice = 2 points
   - 3rd choice = 1 point
2. **Select top 3** proposals by total points
3. **Handle ties** by comparing average scores across criteria
4. **Document selection** in `.specs/research/{solution-name}-{date}.selection.md`:
   - Vote tallies
   - Selected proposals
   - Consensus rationale

## Output Naming

**Pruning files:** `.specs/research/{solution-name}-{YYYY-MM-DD}.pruning.[1|2|3].md`
**Selection file:** `.specs/research/{solution-name}-{YYYY-MM-DD}.selection.md`
