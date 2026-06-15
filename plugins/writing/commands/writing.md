---
description: "Writing workflow with plan-draft-review-compound phases"
argument-hint: "<subcommand> [args] — subcommands: plan, draft, review, compound"
---

# Writing Command

Comprehensive writing workflow with four phases.

## Subcommands

| Subcommand | Purpose |
|------------|---------|
| `plan` | Research and outline from topic/brief |
| `draft` | Transform outline into prose |
| `review` | Multi-agent editorial review |
| `compound` | Extract learnings for future writing |

## Routing

```
subcommand = first_word($ARGUMENTS)
remaining_args = rest($ARGUMENTS)
```

---

## /writing plan

Transform topic/brief into researched outline with sources.

**Workflow:**
1. **Clarify brief** — What's the argument? Who's the reader? What should they do after?
2. **Parallel research** — Sources, audience, competitors
3. **Two-gate assessment** — Material sufficiency, message clarity
4. **Create outline** — Structured with hooks

**Output:** `outline.md`, `research.md`, `sources.md`

---

## /writing draft

Transform outline into prose following style preferences.

**Workflow:**
1. Load outline and research
2. Load applicable style guide
3. Pre-draft checklist
4. Section-by-section drafting with voice guardian loop
5. Quality checkpoints

**Input:** Path to `outline.md`

**Output:** Complete prose draft

---

## /writing review

Multi-agent editorial review of content.

**Workflow:**
1. Load draft and context
2. Launch parallel review agents
3. Collect and prioritize findings
4. Present interactive triage
5. Apply accepted fixes

**Input:** Path to draft or `latest`

**Review Dimensions:**
- Clarity and readability
- Voice consistency
- Fact checking
- Structure flow
- Audience fit

---

## /writing compound

Capture learnings to improve future writing.

> Each piece should make the next piece easier to write.

**Extracts:**
- Hook formulas that grabbed attention
- Structure patterns that flowed well
- Voice elements that landed
- Transitions that felt invisible

**Input:** Path to published piece or `latest`

**Output:** Updated style guides, pattern library

---

## Usage Examples

```bash
# Research and outline a topic
/writing plan "How to negotiate salary in tech"

# Draft from an outline
/writing draft docs/outlines/salary-negotiation.md

# Review a draft
/writing review drafts/salary-negotiation-v1.md

# Extract learnings from published piece
/writing compound published/salary-guide.md
```

## Full Workflow

```
/writing plan <topic>
    ↓
/writing draft <outline>
    ↓
/writing review <draft>
    ↓ (iterate until satisfied)
/writing compound <published>
```
