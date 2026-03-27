# Evaluation Methodologies

This reference covers the three main evaluation lenses for agent work:
- LLM-as-judge
- human evaluation
- end-state validation

Use them together when needed, not as substitutes for one another.

## LLM-as-Judge

Use an LLM judge when you need scale and consistent rubric application.

Best for:
- broad regression checks
- comparing prompt variants
- evaluating large test sets
- triaging outputs before deeper review

Prompt rule:

```text
Evidence -> justification -> score
```

Require the judge to cite concrete observations before scoring. Score-first
prompts are easier to game and harder to debug.

## Human Evaluation

Use human review where automation is weak:
- subtle context misunderstandings
- edge-case safety failures
- tone and stakeholder fit
- confusing but technically passable outputs

Humans are most useful when:
- they review a sampled subset systematically
- they focus on low-confidence or high-impact cases
- their feedback feeds rubric or prompt updates

## End-State Validation

If the agent produces a runnable artifact, validate the artifact directly.

Examples:
- code -> tests, lint, type-check
- config -> schema or deployment validation
- docs -> link checks and manual readability review
- generated data -> schema and constraint checks

If the artifact fails objective validation, do not let a judge rubric override
that failure.

## Method Selection

```text
artifact has objective executable checks?
├─ yes -> end-state validation first
└─ no
   ├─ need broad scalable review -> LLM-as-judge
   └─ subtle or high-impact judgment -> human evaluation
```

## Test Set Design

Good evaluation sets include:
- real tasks, not only synthetic prompts
- known edge cases
- varied complexity levels
- enough repetition to compare prompt or workflow changes fairly

Small, well-chosen sets are usually enough for iteration. Expand only after the
rubric and methodology are stable.

## Combining the Methods

Typical layered flow:

1. run objective end-state checks where possible
2. use an LLM judge for scalable rubric-based review
3. route uncertain or high-risk cases to humans

This is usually better than trying to make one judge prompt solve every
evaluation problem.
