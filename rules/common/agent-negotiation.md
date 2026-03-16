# Agent Negotiation

## Core Principle

Treat every sub-agent response as a negotiation, not a final answer. Evaluate against the original intent before using it.

## When to Enable Negotiation

| Query Type | Example | Why |
|------------|---------|-----|
| Comparative | "Compare X and Y" | Needs data from multiple sources |
| Cross-domain | "Auth error in payment flow" | Needs both technical and domain context |
| Ambiguous scope | "React performance" | Unclear what aspect matters |
| Synthesis | "Best practices for X" | Requires aggregation |

Skip negotiation for single lookups, error definitions, and simple factual questions.

## Confidence Levels

Agents should report confidence honestly:

| Level | Meaning | Action |
|-------|---------|--------|
| HIGH | Primary source found, data complete, no conflicts | Accept |
| MEDIUM | Partial data, minor gaps, some assumptions | Accept if gaps don't block intent; otherwise refine |
| LOW | Minimal sources, significant gaps | Refine query with more context |
| UNCERTAIN | No reliable sources, contradictions, or failures | Try alternative agent or source |

## 3-Strike Refinement

```
Strike 1: LOW/UNCERTAIN response
  → Narrow scope, provide additional context, re-query same agent

Strike 2: Still insufficient
  → Try alternative agent or different source

Strike 3: Still insufficient
  → Synthesize best-effort answer from all rounds
  → List remaining gaps explicitly
  → Disclose confidence level to user
```

## Orchestrator Checklist

When evaluating an agent's response:
1. Does this answer the user's actual question, or a related one?
2. Are the gaps blocking or acceptable?
3. Can another agent fill the gaps?
4. Is a partial answer better than no answer?

When synthesizing from multiple rounds:
1. Combine confirmed facts from all rounds
2. Note ruled-out options
3. State confidence level
4. Disclose remaining gaps
