---
name: soc2-compliance
description: "Plans SOC 2 readiness, control mapping, and audit evidence collection."
origin: lamella
---

# SOC 2 Compliance

Use this skill when the task is about SOC 2 readiness rather than general application security.

## Workflow

1. Decide whether the current target is Type I, Type II, or both in sequence.
2. Choose the Trust Service Criteria categories that match the product and customer promises.
3. Map current controls to the chosen criteria.
4. Identify missing or weak controls.
5. Build an evidence plan before the audit window starts.

## What This Skill Owns

- Type I versus Type II planning
- Trust Service Criteria scope selection
- control matrix building
- evidence planning and collection strategy
- readiness and gap analysis

## What It Does Not Replace

- [`security-review`](../security-review/SKILL.md) for secure implementation choices
- [`security-audit-methodology`](../security-audit-methodology/SKILL.md) for code-audit process
- [`supply-chain-risk-auditor`](../supply-chain-risk-auditor/SKILL.md) for dependency and vendor risk review

## References

- [references/type1-vs-type2.md](references/type1-vs-type2.md) for report selection, timeline, and upgrade planning
- [references/trust-service-criteria.md](references/trust-service-criteria.md) for category selection and control mapping
- [references/evidence-collection.md](references/evidence-collection.md) for evidence planning, automation patterns, and sample expectations

## Scripts

- `scripts/control_matrix_builder.py` builds a starter control matrix
- `scripts/evidence_tracker.py` summarizes evidence status and readiness
- `scripts/gap_analyzer.py` highlights uncovered criteria in a current matrix

## Deliverables

When using this skill, produce:

1. the report target and timeline
2. the selected categories and why they are in scope
3. the control and evidence gaps
4. the next operational steps before the auditor is engaged
