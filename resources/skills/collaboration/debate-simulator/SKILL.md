---
name: debate-simulator
description: "Simulates debates between 2-3 expert personas from different angles."
origin: lamella
---

# Debate Simulator

Generate structured, multi-perspective debates on any topic. Use adversarial reasoning to surface blind spots and stress-test arguments.

## When to Use

- Exploring a complex or controversial decision from multiple angles
- Stress-testing an argument before presenting it
- Preparing for a negotiation by understanding opposing positions
- Examining tradeoffs in a technical or strategic decision

## Setup

### 1. Define the Motion
Frame the topic as a clear, debatable proposition:
- "This house believes that [X should Y]" or
- "Resolved: [specific claim]"

Avoid vague motions. "AI is good" is unworkable. "Companies should mandate AI tool adoption for all engineers" is debatable.

### 2. Assign Personas (2-3)
Each persona needs:
- **Name and role** — gives the perspective a concrete anchor
- **Position** — for, against, or a distinct third angle (e.g., pragmatic middle)
- **Reasoning style** — empirical/data-driven, philosophical/principled, practical/operational
- **Key concern** — the value or priority this persona optimizes for

Personas should represent genuinely different worldviews, not strawmen. Each should make the strongest possible case for their position.

### 3. Set Scope
- **Depth**: quick exploration (2 rounds) vs. thorough examination (4 rounds)
- **Focus**: technical feasibility, ethical implications, business impact, or unconstrained

## Debate Structure

| Round | Format | Purpose |
|---|---|---|
| **Opening Statements** | Each persona: 150-250 words | State position, core argument, key evidence |
| **Rebuttal** | Each responds to the others: 100-200 words | Directly address the strongest opposing point |
| **Cross-Examination** | Each poses 1-2 pointed questions | Expose assumptions, probe weaknesses |
| **Closing Arguments** | Each persona: 100-150 words | Synthesize, concede where warranted, final case |

## Moderation Rules

- **Steel-man, don't straw-man** — each persona represents the best version of their argument
- **Engage directly** — rebuttals must address what was actually said, not pivot to a different point
- **Concede when warranted** — personas should acknowledge strong opposing points rather than deflect
- **No false balance** — if evidence strongly favors one side, the debate should reflect that
- **Flag logical fallacies** — if a persona (intentionally or not) uses one, note it

## Post-Debate Synthesis

After the debate, provide:

1. **Points of Agreement** — where all sides converge
2. **Core Disagreements** — the fundamental values or assumptions that drive the divide
3. **Strongest Arguments** — the most compelling points from each side
4. **Key Uncertainties** — what evidence would change the outcome
5. **Recommendation** — a nuanced position informed by all perspectives (unless user prefers to form their own)

## Quality Gate

- [ ] Each persona makes arguments the real-world holder of that view would endorse
- [ ] Rebuttals engage directly with opposing arguments, not tangential points
- [ ] At least one persona concedes a point during the debate
- [ ] Synthesis distinguishes between empirical disagreements and value disagreements
- [ ] No persona is a caricature
