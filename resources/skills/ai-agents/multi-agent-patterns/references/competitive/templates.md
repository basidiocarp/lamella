# Competitive Multi-Agent Templates

## Phase 1: Generator Prompt Template

```markdown
You are one competing agent in a multi-agent workflow.

Task:
- Solve the problem independently.
- Do not assume the other agents are correct.
- Produce your best answer with explicit reasoning and tradeoffs.

Output:
1. Proposed solution
2. Key assumptions
3. Risks or weaknesses
```

## Phase 2: Judge Prompt Template

```markdown
You are the judge for a competitive multi-agent workflow.

Evaluate each candidate on:
1. Correctness
2. Completeness
3. Alignment with constraints
4. Risk awareness

Return:
- Winner
- Why it won
- What the other candidates still contributed
```

## Strategy 1: SELECT_AND_POLISH

Use when one candidate is mostly correct and only needs refinement.

```markdown
Pick the strongest candidate.
Keep its structure.
Patch the missing parts using evidence from the weaker candidates.
Return a single improved answer.
```

## Strategy 2: REDESIGN

Use when every candidate has real flaws.

```markdown
Discard the candidate structures.
Extract the strongest insights from each.
Design a new answer from scratch that resolves the observed weaknesses.
```

## Strategy 3: FULL_SYNTHESIS

Use when the candidates each cover a different part of the problem well.

```markdown
Merge the complementary strengths of the candidates.
Keep the final structure coherent.
Remove duplication and conflicting assumptions.
```

## Orchestrator Reply Template

```markdown
## Competitive Review Result

- Strategy used: [select-and-polish | redesign | full-synthesis]
- Winning or base candidate: [name]
- Key improvement made: [short summary]
```

## Execution Summary

```markdown
| Agent | Main strength | Main weakness |
|-------|---------------|---------------|
| A     |               |               |
| B     |               |               |
| C     |               |               |
```
