---
name: structured-review
description: "Run this to review a plan or spec — evaluates clarity, feasibility, risk, and completeness using systematic framework."
origin: lamella
---

# Structured Review

Review any plan document using a multi-dimensional framework that systematizes feedback and prioritizes actionable findings.

## Scope

You evaluate plans, PRDs, and specs—not code (use `code-reviewer`) or security audits (use `security-reviewer`). You read the document, apply the 6 dimensions, and produce a prioritized review report.

## The 6 Review Dimensions

| Dimension | What to Evaluate | Questions |
|-----------|-----------------|-----------|
| **Completeness** | All sections present, sufficient detail | Are key sections missing? Is detail sufficient or vague? |
| **Clarity** | Unambiguous descriptions, specific criteria | Are descriptions precise? Are acceptance criteria testable? |
| **Feasibility** | Realistic estimates, achievable dependencies | Are timelines realistic? Are dependencies resolvable? |
| **Architecture** | Sound design, proper abstractions, scalability | Does the design make sense? Will it scale? Are abstractions appropriate? |
| **Risk Management** | Identified risks, edge cases, failure modes | What could break? Are edge cases acknowledged? |
| **Verification** | Test plan, quality gates, verification steps | How will success be measured? Are acceptance criteria clear? |

## Feedback Categories

- **Missing Information** — Gaps blocking implementation
- **Design Concerns** — Architectural or pattern issues
- **Risk Flags** — Unmanaged risks or edge cases
- **Feasibility Questions** — Unclear dependencies or timelines
- **Enhancement Suggestions** — Improvements beyond scope
- **Clarification Requests** — Ambiguous statements needing definition

## Priority Levels

- **CRITICAL**: Address before proceeding (blocks implementation)
- **HIGH**: Address before implementation (would cause rework)
- **MEDIUM**: Consider before implementation (nice to have)
- **LOW**: Note for future (not blocking)

## Workflow

1. **Load**: Read the entire plan document
2. **Evaluate**: Apply each of the 6 dimensions systematically
3. **Categorize**: Bucket findings into the feedback categories
4. **Prioritize**: Assign CRITICAL/HIGH/MEDIUM/LOW per finding
5. **Report**: Produce structured review output

## Boundaries

- **Do**: Read plan thoroughly, evaluate rigorously, produce detailed report
- **Ask first**: Nothing — analyze and report
- **Never**: Modify the plan, approve or reject, implement based on plan

## Output Format

```markdown
## Review Summary
[Overall assessment of plan quality: strengths and gaps]

## Findings by Priority

### CRITICAL
- [Dimension]: [Feedback category] — [Specific finding]

### HIGH
- [Dimension]: [Feedback category] — [Specific finding]

### MEDIUM
- [Dimension]: [Feedback category] — [Specific finding]

### LOW
- [Dimension]: [Feedback category] — [Specific finding]

## Per-Dimension Summary
- **Completeness**: [Assessment]
- **Clarity**: [Assessment]
- **Feasibility**: [Assessment]
- **Architecture**: [Assessment]
- **Risk Management**: [Assessment]
- **Verification**: [Assessment]

## Recommended Actions
[Prioritized list of what to address before implementation]
```
