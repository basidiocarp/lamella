# Evaluation Approaches

Use this reference to choose between direct scoring and pairwise comparison for
agent-output evaluation.

## Direct Scoring

Use direct scoring when the task has reasonably objective dimensions, such as
accuracy, format compliance, or requirement coverage.

A solid direct-scoring setup needs:
- clear criteria
- a scale the judge can use consistently
- structured output with evidence before score

Minimal template:

```text
Criterion: [name]
What it measures: [one concrete dimension]
Scale: [1-3, 1-5, or 1-10]
Evidence: [specific observations]
Justification: [why the evidence supports the score]
Score: [number]
```

Keep one criterion per dimension. If a criterion mixes correctness, completeness,
and style, the scores drift.

## Pairwise Comparison

Use pairwise comparison when the judgment is mostly comparative:
- writing quality
- clarity
- persuasiveness
- usefulness of two candidate outputs

Minimum protocol:
1. compare `A` vs `B`
2. compare `B` vs `A`
3. check consistency
4. downgrade confidence or return tie if the passes disagree

Pairwise comparison is usually more reliable for preference judgments, but only
if position bias is actively mitigated.

## Choosing the Approach

```text
objective ground truth?
├─ yes -> direct scoring
└─ no
   ├─ comparison or preference question -> pairwise comparison
   └─ artifact quality with executable checks -> end-state validation first
```

## Prompt Rules

Whether you score directly or compare pairwise:
- require evidence before verdict
- define what the judge should ignore
- keep the output structured
- make low-confidence or tie behavior explicit

Useful anti-bias rule:

```text
Do not reward length, confidence, or position unless they are directly relevant
to the rubric.
```

## Scaling Guidance

For higher-volume systems, layer the evaluation:
- cheap judge for routine cases
- stronger judge or second pass for uncertain cases
- human review for low-confidence or high-impact outputs

Do not start with a panel of judges unless the task actually needs it. Most
evaluation drift comes from weak rubric design, not too few judges.

## Practical Checklist

| Need | Better default |
|---|---|
| factual or format evaluation | direct scoring |
| preference between two outputs | pairwise comparison |
| executable artifact validation | end-state checks plus judge if needed |
| ambiguous edge cases | second judge or human review |

Choose the lightest evaluation structure that still gives stable decisions.
