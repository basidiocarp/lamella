---
name: council
description: "Run this for non-trivial design decisions to avoid anchoring bias — coordinates 4-voice technical council (Architect, Skeptic, Pragmatist, Critic)."
origin: lamella
---

# Technical Council

## Contents

- [When to Activate](#when-to-activate)
- [How It Works](#how-it-works)
- [Anti-Anchoring Protocol](#anti-anchoring-protocol)
- [Council Voices](#council-voices)
- [Synthesis](#synthesis)

## When to Activate

A technical council is most valuable when:

- **Non-trivial architecture decisions** — evaluating trade-offs between multiple valid approaches with long-term consequences
- **High-risk assessments** — features, refactors, or integrations where failure modes are not obvious
- **Complex trade-offs** — decisions where simplicity, performance, safety, and cost all matter and pull in different directions
- **Contested reasoning** — the team or user is split on direction and needs structured deliberation
- **Novel problem space** — unfamiliar domain where existing heuristics may not apply

Do NOT activate for:
- Tactical bug fixes or small refactors
- Decisions already made or constrained by requirements
- Situations where time-to-decision matters more than decision quality

## How It Works

The council uses four context-isolated subagents, each loaded with one **role bundle** (skill + perspective + constraints). Each voice forms its assessment independently, without reading other voices.

### The Council Stages

**Stage 1: Independent Assessment**
1. Load each subagent with ONLY its role bundle (e.g., `council-architect`)
2. Provide each with the problem statement and any shared context (requirements, constraints, prior art)
3. Each voice forms its assessment **in isolation**
4. Collect all four responses without showing them to each other

**Stage 2: Synthesis**
- Read all four assessments
- Identify consensus (where voices agree) and tension (where they differ)
- Highlight the most important gaps or disagreements
- Synthesize into a single recommendation that accounts for all four perspectives

## Anti-Anchoring Protocol

Anchoring bias — where the first information heard disproportionately influences later judgment — is the council's primary target.

### How Anchoring Breaks Councils

If voices read each other sequentially, the first voice effectively anchors all following voices. Skepticism becomes "refinement of the first idea" rather than independent assessment. Pragmatism becomes "cost-reduction of the architect's vision."

### Anti-Anchoring Implementation

- **Each subagent is context-isolated.** It receives the problem statement but NOT the other voices' outputs.
- **Each voice assesses first, then reads.** After all four have responded, synthesize across them.
- **The problem statement is the only shared anchor.** All voices ground in the same requirements and constraints, not in each other's reasoning.

This ensures that the Critic's concerns are not softened by having heard the Architect's defense first. The Pragmatist's scope is not pre-shaped by the Skeptic's risk list.

## Council Voices

The four voices of the council are:

1. **Architect** — Long-term structural soundness and maintainability
2. **Skeptic** — Risk, edge cases, and failure modes
3. **Pragmatist** — Implementation cost, timeline, and delivery
4. **Critic** — Quality, correctness, and problem fit

Each voice is its own skill in the `council-roles/` directory. Load the role bundle before spawning the subagent.

## Synthesis

After all four voices respond, the synthesis pass integrates their outputs into a single recommendation.

**Synthesis checklist:**
- Which concerns appear in multiple voices? (These are likely real.)
- Where do voices disagree? (These represent real trade-offs, not errors.)
- Which concerns are dismissed by exactly one voice? (That voice may have a blind spot, or the others may be missing nuance.)
- What does the Critic say that neither the Architect nor Pragmatist addressed?
- What does the Skeptic flag that the Pragmatist wants to defer?

**Output format:**
- State the decision or recommendation
- List the consensus (what all or most voices agreed on)
- State key trade-offs that different voices emphasize
- Flag unresolved tensions that will need monitoring
- Suggest next steps or decisions that can be made later

