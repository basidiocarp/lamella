# Phase 5: Synthesis (Evidence-Based Combination)

Only run this phase when full synthesis was selected after evaluation.

Launch **1 synthesis agent**.

1. Provide all solutions.
2. Provide all evaluation reports.
3. Provide the pruning selection rationale.
4. Ask the agent to:
   - identify consensus strengths
   - identify consensus weaknesses
   - combine complementary strengths
   - fix issues caught by judges

**Key principle:** Synthesize from evidence, not preference.

## Prompt Template for Synthesizer

```markdown
You are synthesizing the best final solution from explored, pruned, and evaluated candidates.

<task>
{task_description}
</task>

<solutions>
{solution_files}
</solutions>

<evaluations>
{evaluation_reports}
</evaluations>

<selection_rationale>
{selection_file}
</selection_rationale>

Produce:
1. Final combined solution
2. Source notes for major sections
3. Explicit fixes for consensus weaknesses

CRITICAL:
- Cite which solution each major section came from.
- Explain every major synthesis decision.
- Address consensus weaknesses called out by judges.
```
