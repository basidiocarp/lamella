# Metric Selection Guide

Use this reference to choose metrics that match the evaluation question. Start
with the task type, not the metric name.

## Classification Metrics

Use for pass/fail or correct/incorrect decisions.

| Metric | Use when |
|---|---|
| precision | false positives are costly |
| recall | false negatives are costly |
| F1 | you need a balanced single score |

These are usually appropriate for safety gates, moderation checks, or binary
quality labels.

## Agreement Metrics

Use when comparing automated judgments to human judgments.

| Metric | Best for |
|---|---|
| Cohen's kappa | categorical agreement |
| weighted kappa | ordinal scales where bigger disagreements matter more |

Agreement metrics answer whether the judge aligns with a human rubric, not
whether the underlying outputs are good in an absolute sense.

## Correlation Metrics

Use when scores are ordinal or continuous.

| Metric | Best for |
|---|---|
| Spearman's rho | ranking quality |
| Kendall's tau | rankings with many ties |
| Pearson r | exact score relationship |

Prefer rank-based correlation when relative ordering matters more than exact
numeric spacing.

## Pairwise Metrics

Use for winner/loser judgments.

| Metric | Best for |
|---|---|
| win rate | comparing two models or prompts |
| agreement rate | checking decision stability |
| position consistency | detecting swap sensitivity and bias |

If position consistency is weak, fix the comparison protocol before trusting win
rate conclusions.

## Selection Guide

```text
binary decision?
├─ yes -> precision / recall / F1 and agreement checks
└─ no
   ├─ ranking or scored judgment -> correlation metrics
   └─ pairwise comparison -> win rate and position consistency
```

## Common Use Cases

- validating an automated judge against humans -> kappa or Spearman
- comparing two prompt variants -> win rate plus position consistency
- monitoring a live evaluation system -> rolling agreement, bias indicators,
  and score distribution checks

## Warning Signs

- strong agreement but weak rank correlation
- high length correlation in a quality judge
- low position consistency in pairwise evaluation
- one criterion drifting while the overall score looks stable

Choose metrics that help explain failure modes, not only produce one headline
number.
