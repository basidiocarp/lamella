# Phase 1: Exploration (Propose Approaches)

Launch **3 independent agents in parallel**. Sonnet is usually enough for this stage.

1. Each agent receives the same task description and context.
2. Each agent generates **6 high-level approaches**, not full implementations.
3. For each approach, the agent should provide:
   - a short description
   - key design decisions and trade-offs
   - probability estimate
   - estimated complexity
   - risks and failure modes
4. Save proposals to `.specs/research/{solution-name}-{date}.proposals.[a|b|c].md`.

**Key principle:** Explore broadly before committing to one branch.

## Prompt Template for Explorers

```markdown
<task>
{task_description}
</task>

<constraints>
{constraints}
</constraints>

<goal>
Generate 6 genuinely different high-level approaches.
</goal>

For each approach include:
1. Summary
2. Key design decisions
3. Main trade-offs
4. Complexity estimate
5. Risks
6. Confidence estimate

CRITICAL:
- Do not implement full solutions yet.
- Ensure approaches are genuinely different, not minor variations.
```

## Output Naming

**File format:** `.specs/research/{solution-name}-{YYYY-MM-DD}.proposals.[a|b|c].md`
