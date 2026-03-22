# Phase 3: Expansion (Develop Full Solutions)

Launch **3 independent agents in parallel** (recommended: Opus for quality):

1. Each agent receives:
   - **One selected proposal** to expand
   - **Original task description** and context
   - **Judge feedback** from pruning phase (concerns, questions)
2. Agent produces **complete solution** implementing the proposal:
   - Full implementation details
   - Addresses concerns raised by judges
   - Documents key decisions made during expansion
3. Solutions saved to `solution.a.md`, `solution.b.md`, `solution.c.md`

**Key principle:** Focused development of validated approaches with awareness of evaluation feedback.

## Prompt Template for Expansion Agents

```markdown
You are developing a full solution based on a selected proposal.

<task>
{task_description}
</task>
// ... (75 lines trimmed)
- Do not switch to a different approach midway
- Address judge feedback explicitly
- Produce a complete, implementable solution
```

## Output Naming

**Solution files:** `solution.[a|b|c].md` (in specified output location)
