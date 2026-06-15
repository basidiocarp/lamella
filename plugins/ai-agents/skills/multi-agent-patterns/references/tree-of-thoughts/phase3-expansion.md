# Phase 3: Expansion (Develop Full Solutions)

Launch **3 independent agents in parallel**. Use a higher-capability model if the task is complex.

1. Each agent receives:
   - one selected proposal
   - the original task description
   - judge feedback from pruning
2. Each agent develops a complete solution:
   - full implementation details
   - direct responses to pruning concerns
   - documented decisions made during expansion
3. Save outputs to `solution.a.md`, `solution.b.md`, and `solution.c.md`.

**Key principle:** Expand validated directions without changing course midway.

## Prompt Template for Expansion Agents

```markdown
You are developing a full solution based on a selected proposal.

<task>
{task_description}
</task>

<selected_proposal>
{proposal}
</selected_proposal>

<judge_feedback>
{feedback}
</judge_feedback>

Deliver:
1. Full solution
2. Explicit responses to judge concerns
3. Key decisions made during expansion

CRITICAL:
- Do not switch to a different approach midway.
- Address judge feedback explicitly.
- Produce a complete, implementable solution.
```

## Output Naming

**Solution files:** `solution.[a|b|c].md`
