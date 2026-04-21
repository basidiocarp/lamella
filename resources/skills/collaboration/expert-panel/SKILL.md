---
name: expert-panel
description: "Assembles 2-3 complementary experts to collaboratively analyze a topic."
origin: lamella
---

# Expert Panel

Assemble 2-3 domain experts who collaboratively analyze a topic, building on each other's insights rather than debating opposing sides.

## When to Use

- Analyzing a complex topic that spans multiple domains
- Seeking comprehensive recommendations from complementary perspectives
- Exploring a problem where the challenge is breadth, not disagreement
- Generating a thorough assessment (e.g., technical + business + user experience)

## How It Differs from Debate Simulator

- **Debate**: adversarial — personas argue opposing positions to surface tradeoffs
- **Expert Panel**: collaborative — personas contribute complementary expertise toward a shared analysis

Use debate when you need to stress-test a position. Use expert panel when you need well-rounded coverage.

## Setup

### 1. Define the Question
Frame as an open analytical question, not a yes/no proposition:
- "How should we approach [X]?"
- "What are the key considerations for [Y]?"
- "Evaluate [Z] from multiple angles."

### 2. Select Panelists (2-3)
Choose experts whose domains are **complementary, not overlapping**:
- **Name and domain** — e.g., "systems architect", "behavioral economist", "UX researcher"
- **Lens** — what aspect of the problem they focus on
- **Blind spot** — what they're likely to underweight (other panelists compensate)

Good panel composition:
- Technical + business + user perspectives
- Strategy + operations + risk perspectives
- Domain expert + adjacent-domain expert + generalist

## Panel Structure

| Phase | What Happens |
|---|---|
| **Individual Analysis** | Each expert analyzes the topic through their lens (200-300 words each) |
| **Cross-Pollination** | Experts respond to each other's analyses — build on insights, flag gaps, connect ideas (100-200 words each) |
| **Synthesis** | Combined analysis integrating all perspectives into a coherent picture |
| **Integrated Recommendations** | Actionable next steps informed by all viewpoints, prioritized |

When the panel is supporting a leadership or strategy decision, use `references/multi-perspective-synthesis.md` to compress the output into consensus themes, named conflicts, a short action list, and one clear decision point.

## Collaboration Rules

- **Build, don't just agree** — each expert adds new information or reframes, not just "I agree with Expert A"
- **Flag blind spots** — if one expert's analysis misses something in another's domain, they call it out constructively
- **Quantify where possible** — "this is important" is weaker than "this affects ~40% of users based on typical patterns"
- **Distinguish certainty levels** — mark opinions vs. established knowledge vs. speculative extrapolation

## Output Format

1. **Panel Composition** — who the experts are and why they were chosen
2. **Individual Analyses** — each expert's perspective, clearly labeled
3. **Cross-Pollination Highlights** — key connections and gaps identified
4. **Synthesized Assessment** — integrated analysis in one coherent narrative
5. **Recommendations** — prioritized actions with the rationale from relevant expert(s)
6. **Open Questions** — what the panel couldn't resolve and what additional information would help

## Quality Gate

- [ ] Panelists have genuinely different domains, not just different labels for the same lens
- [ ] Cross-pollination phase produces new insights, not just mutual validation
- [ ] Synthesis resolves tensions between perspectives rather than listing them side by side
- [ ] Recommendations are specific enough to act on
- [ ] Each expert's contribution adds information the others couldn't have provided
- [ ] Leadership-facing outputs collapse to a short action set and one decision point
