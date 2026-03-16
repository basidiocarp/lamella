# Phase 1: Exploration (Propose Approaches)

Launch **3 independent agents in parallel** (recommended: Sonnet for speed):

1. Each agent receives **identical task description and context**
2. Each agent **generates 6 high-level approaches** (not full implementations)
3. For each approach, agent provides:
   - **Approach description** (2-3 paragraphs)
   - **Key design decisions** and trade-offs
   - **Probability estimate** (0.0-1.0)
   - **Estimated complexity** (low/medium/high)
   - **Potential risks** and failure modes
4. Proposals saved to `.specs/research/{solution-name}-{date}.proposals.[a|b|c].md`

**Key principle:** Systematic exploration through probabilistic sampling from the full distribution of possible approaches.

## Prompt Template for Explorers

```markdown
<task>
{task_description}
</task>

<constraints>
// ... (51 lines trimmed)
CRITICAL:
- Do NOT implement full solutions yet - only high-level approaches
- Ensure approaches are genuinely different, not minor variations
```

## Output Naming

**File format:** `.specs/research/{solution-name}-{YYYY-MM-DD}.proposals.[a|b|c].md`

Where:
- `{solution-name}` - Derived from output path (e.g., `users-api` from output `specs/api/users.md`)
- `{YYYY-MM-DD}` - Current date
- `[a|b|c]` - Unique agent identifier
