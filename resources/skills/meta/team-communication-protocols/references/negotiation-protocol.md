# Sub-Agent Negotiation Protocol

> Adapted from rust-skills meta-cognition framework. Language-agnostic version.

## Core Principle

Every sub-agent response is a negotiation, not a final answer. The orchestrator evaluates each response against the original intent and refines queries until sufficient information is gathered.

## When to Enable Negotiation

### Always Enable

| Query Pattern | Example | Reason |
|---------------|---------|--------|
| Comparative | "Compare X and Y" | Requires data from multiple sources |
| Cross-domain | "Auth error in payment flow" | Needs both technical and domain context |
| Ambiguous scope | "React performance" | Unclear what aspect to measure |
| Synthesis | "Best practices for X" | Requires aggregation from multiple sources |
| Multi-faceted | "How to design auth" | Multiple valid approaches |

### Skip Negotiation

| Query Pattern | Example | Reason |
|---------------|---------|--------|
| Single lookup | "What version is X?" | Direct answer possible |
| Error definition | "What is error E1234?" | Defined meaning |
| Simple definition | "What is a mutex?" | Factual lookup |

## Structured Response Format

When negotiation is enabled, agents return:

```markdown
## Negotiation Response

### Findings
[What was discovered]

// ... (11 lines trimmed)
### Metadata
- **Source**: [where data came from]
- **Coverage**: [e.g., "90%"]
```

## Confidence Levels

### HIGH
Primary source available, core data complete, no conflicting information.
Action: Accept response, proceed to synthesis.

### MEDIUM
Some source available, core data found but incomplete, minor gaps.
Action: Evaluate if gaps affect intent; may refine or accept.

### LOW
Minimal sources, core data incomplete, significant gaps.
Action: Refine query with additional context.

### UNCERTAIN
No reliable sources, contradictory information, or fetch failures.
Action: Try alternative agent/source or escalate.

## Negotiation Flow

```
User Question
     |
     v
[1] Orchestrator Analysis
    - Parse intent
// ... (31 lines trimmed)
    - Combine all findings
    - Explicitly state gaps
    - Disclose confidence level
```

## 3-Strike Integration

Negotiation follows the same escalation principle:

```
Strike 1: Initial query returns LOW/UNCERTAIN confidence
  - Review agent's context questions
  - Provide additional context
  - Narrow scope if ambiguous
  - Re-query same agent
// ... (8 lines trimmed)
  - Explicitly list remaining gaps
  - Disclose confidence level to user
  - Suggest manual verification
```

## Orchestrator Responsibilities

### 1. Intent Preservation
Track the original user intent. Map each agent response back to:
- What aspect of the question does this answer?
- What aspects remain unanswered?

### 2. Context Accumulation
Across negotiation rounds, accumulate:
- Confirmed facts
- Ruled-out options
- Remaining uncertainties

### 3. Gap Assessment
For each identified gap:
- Does this gap block answering the user's question?
- Can this gap be filled with another query?
- Is partial answer acceptable?

### 4. Final Synthesis
When synthesizing:
- Combine findings from all rounds
- State confidence level
- Disclose any remaining gaps
- Provide source attribution

## Agent Responsibilities

### 1. Honest Assessment
- Don't inflate confidence
- Acknowledge limitations
- Identify gaps proactively

### 2. Structured Response
- All sections required when negotiation enabled
- Clear categorization of confidence
- Specific gap identification

### 3. Context Questions
- Don't ask obvious questions
- Focus on blockers
- Prioritize by impact on answer quality
