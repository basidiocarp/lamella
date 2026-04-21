---
name: debate-evaluator
description: "Evaluates solutions through multi-round debate between independent judges until consensus."
origin: lamella
---

# Debate Evaluator

Evaluates solutions through multi-agent debate where independent judges analyze, challenge each other's assessments, and iteratively refine evaluations until reaching consensus.

## When to Use

- Comparing multiple solution approaches that need rigorous evaluation
- Making high-stakes technical decisions requiring diverse perspectives
- Assessing proposals where single-pass review misses nuance
- Architecture or design decisions with significant trade-offs

## Process

```
Phase 1: Independent Analysis (parallel)
  3 judges each produce independent reports

Phase 2: Debate Rounds (iterative, max 3)
  Each judge reads others' reports
  Argue, defend, challenge
  Revise if convinced
  Check consensus → if yes, final report

Phase 3: Consensus Report
  Merged scores, strengths, weaknesses, recommendation
```

### Phase 1: Independent Analysis

Launch 3 independent judge agents in parallel:
1. Each receives the solution path(s) and evaluation criteria with weights
2. Each produces an independent assessment with per-criterion scores, evidence, strengths, and weaknesses
3. Save reports to `.specs/reports/{solution-name}-{date}.[1|2|3].md`

**Key principle:** Independence prevents groupthink.

### Phase 2: Debate Rounds

For each round (max 3):
1. Each judge reads the other two reports
2. Identify specific disagreements with evidence
3. Revise own scores if persuaded (document reasoning)
4. Check consensus: all judges within 1 point on all criteria → proceed to Phase 3

### Phase 3: Consensus Report

Produce a final report containing:
- Consensus scores (averaged final scores per criterion)
- Agreed strengths and weaknesses
- Debate summary (key disagreements and how resolved)
- Final recommendation with confidence level

## Evaluation Criteria

Default criteria (customize per evaluation):

| Criterion | Weight | Description |
|-----------|--------|-------------|
| Correctness | 30% | Does it work correctly? |
| Maintainability | 25% | Is it readable and maintainable? |
| Performance | 20% | Does it meet performance requirements? |
| Security | 15% | Are security concerns addressed? |
| Extensibility | 10% | Can it evolve with future needs? |

## Best Practices

- Use 3 judges (odd number prevents ties)
- Set clear rubrics before starting (1-10 scale with anchors)
- Require evidence for every score (specific code references)
- Cap debate at 3 rounds to prevent infinite loops
- Document concessions explicitly ("Changed score because...")
