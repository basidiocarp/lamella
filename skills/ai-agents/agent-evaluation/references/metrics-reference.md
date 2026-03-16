# Metric Selection Guide

This reference provides guidance on selecting appropriate metrics for different evaluation scenarios.

## Metric Categories

### Classification Metrics

Use for binary or multi-class evaluation tasks (pass/fail, correct/incorrect).

#### Precision

```
Precision = True Positives / (True Positives + False Positives)
```

**Interpretation**: Of all responses the judge said were good, what fraction were actually good?

**Use when**: False positives are costly (e.g., approving unsafe content)

#### Recall

```
Recall = True Positives / (True Positives + False Negatives)
```

**Interpretation**: Of all actually good responses, what fraction did the judge identify?

**Use when**: False negatives are costly (e.g., missing good content in filtering)

#### F1 Score

```
F1 = 2 * (Precision * Recall) / (Precision + Recall)
```

**Interpretation**: Harmonic mean of precision and recall

**Use when**: You need a single number balancing both concerns

### Agreement Metrics

Use for comparing automated evaluation with human judgment.

#### Cohen's Kappa (κ)

```
κ = (Observed Agreement - Expected Agreement) / (1 - Expected Agreement)
```

**Interpretation**: Agreement adjusted for chance
- κ > 0.8: Almost perfect agreement
- κ 0.6-0.8: Substantial agreement
- κ 0.4-0.6: Moderate agreement
- κ < 0.4: Fair to poor agreement

**Use for**: Binary or categorical judgments

#### Weighted Kappa

For ordinal scales where disagreement severity matters.

**Interpretation**: Penalizes large disagreements more than small ones

### Correlation Metrics

Use for ordinal/continuous scores.

#### Spearman's Rank Correlation (ρ)

**Interpretation**: Correlation between rankings, not absolute values
- ρ > 0.9: Very strong correlation
- ρ 0.7-0.9: Strong correlation
- ρ 0.5-0.7: Moderate correlation
- ρ < 0.5: Weak correlation

**Use when**: Order matters more than exact values

#### Kendall's Tau (τ)

**Interpretation**: Similar to Spearman but based on pairwise concordance

**Use when**: You have many tied values

#### Pearson Correlation (r)

**Interpretation**: Linear correlation between scores

**Use when**: Exact score values matter, not just order

### Pairwise Comparison Metrics

#### Agreement Rate

```
Agreement = (Matching Decisions) / (Total Comparisons)
```

**Interpretation**: Simple percentage of agreement

#### Position Consistency

```
Consistency = (Consistent across position swaps) / (Total comparisons)
```

**Interpretation**: How often does swapping position change the decision?

## Selection Decision Tree

```
What type of evaluation task?
│
├── Binary classification (pass/fail)
│   └── Use: Precision, Recall, F1, Cohen's κ
│
// ... (8 lines trimmed)
│
└── Multi-label classification
    └── Use: Macro-F1, Micro-F1, Per-label metrics
```

## Metric Selection by Use Case

### Use Case 1: Validating Automated Evaluation

**Goal**: Ensure automated evaluation correlates with human judgment

**Recommended Metrics**:
1. Primary: Spearman's ρ (for ordinal scales) or Cohen's κ (for categorical)
2. Secondary: Per-criterion agreement
3. Diagnostic: Confusion matrix for systematic errors

### Use Case 2: Comparing Two Models

**Goal**: Determine which model produces better outputs

**Recommended Metrics**:
1. Primary: Win rate (from pairwise comparison)
2. Secondary: Position consistency (bias check)
3. Diagnostic: Per-criterion breakdown

### Use Case 3: Quality Monitoring

**Goal**: Track evaluation quality over time

**Recommended Metrics**:
1. Primary: Rolling agreement with human spot-checks
2. Secondary: Score distribution stability
3. Diagnostic: Bias indicators (position, length)

## Interpreting Metric Results

### Good Evaluation System Indicators

| Metric | Good | Acceptable | Concerning |
|--------|------|------------|------------|
| Spearman's ρ | > 0.8 | 0.6-0.8 | < 0.6 |
| Cohen's κ | > 0.7 | 0.5-0.7 | < 0.5 |
| Position consistency | > 0.9 | 0.8-0.9 | < 0.8 |
| Length correlation | < 0.2 | 0.2-0.4 | > 0.4 |

### Warning Signs

1. **High agreement but low correlation**: May indicate calibration issues
2. **Low position consistency**: Position bias affecting results
3. **High length correlation**: Length bias inflating scores
4. **Per-criterion variance**: Some criteria may be poorly defined

## Reporting Template

```markdown
## Evaluation System Metrics Report

### Human Agreement
- Spearman's ρ: 0.82 (p < 0.001)
- Cohen's κ: 0.74
// ... (13 lines trimmed)
### Recommendations
- All metrics within acceptable ranges
- Monitor "Clarity" criterion - lower agreement may indicate need for rubric refinement
```

## Quick Reference Table

| Metric | Type | Best For | Interpretation |
|--------|------|----------|----------------|
| Precision | Classification | Avoiding false positives | Higher = fewer false approvals |
| Recall | Classification | Avoiding false negatives | Higher = fewer missed items |
| F1 | Classification | Balanced measure | Higher = better overall |
| Cohen's κ | Agreement | Categorical judgments | >0.7 is good |
| Spearman's ρ | Correlation | Ordinal rankings | >0.8 is good |
| Kendall's τ | Correlation | Rankings with ties | >0.7 is good |
| Position consistency | Bias | Pairwise comparisons | >0.9 is good |
