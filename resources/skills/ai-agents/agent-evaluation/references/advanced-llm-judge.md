# Advanced Evaluation: LLM-as-Judge

**Key insight**: LLM-as-a-Judge is not a single technique but a family of approaches, each suited to different evaluation contexts. Choosing the right approach and mitigating known biases is the core competency this reference develops.

## The Evaluation Taxonomy

Evaluation approaches fall into two primary categories with distinct reliability profiles:

### Direct Scoring

A single LLM rates one response on a defined scale.

**Best for**: Objective criteria (factual accuracy, instruction following, toxicity)

**Reliability**: Moderate to high for well-defined criteria

**Failure mode**: Score calibration drift, inconsistent scale interpretation

**Example use cases**:
- Evaluating factual accuracy against ground truth
- Checking instruction compliance
- Assessing safety/toxicity

### Pairwise Comparison

An LLM compares two responses and selects the better one.

**Best for**: Subjective preferences (tone, style, persuasiveness)

**Reliability**: Higher than direct scoring for preferences

**Failure mode**: Position bias, length bias

**Example use cases**:
- Comparing prompt variants
- A/B testing outputs
- Preference modeling

## Research Foundation

Research from the MT-Bench paper (Zheng et al., 2023) establishes that:
- Pairwise comparison achieves higher agreement with human judges than direct scoring for preference-based evaluation
- Direct scoring remains appropriate for objective criteria with clear ground truth
- Chain-of-thought justification improves reliability by 15-25%

## The Bias Landscape

LLM judges exhibit systematic biases that must be actively mitigated:

| Bias | Description | Mitigation |
|------|-------------|------------|
| **Position** | First-position responses receive preferential treatment | Evaluate twice with swapped positions |
| **Length** | Longer responses rated higher regardless of quality | Explicit prompting, length-normalized scoring |
| **Self-Enhancement** | Models rate their own outputs higher | Cross-model evaluation, blind evaluation |
| **Verbosity** | Detailed explanations scored higher even when unnecessary | Relevance weighting, rubric penalties |
| **Authority** | Confident tone rated higher regardless of accuracy | Evidence requirement, fact-checking |

See [bias-mitigation.md](bias-mitigation.md) for detailed mitigation techniques.

## Metric Selection Framework

Choose metrics based on the evaluation task structure:

| Task Type | Primary Metrics | Secondary Metrics |
|-----------|-----------------|-------------------|
| Binary classification (pass/fail) | Recall, Precision, F1 | Cohen's κ |
| Ordinal scale (1-5 rating) | Spearman's ρ, Kendall's τ | Cohen's κ (weighted) |
| Pairwise preference | Agreement rate, Position consistency | Confidence calibration |
| Multi-label | Macro-F1, Micro-F1 | Per-label precision/recall |

**Critical insight**: High absolute agreement matters less than systematic disagreement patterns. A judge that consistently disagrees with humans on specific criteria is more problematic than one with random noise.

## Evaluation Metrics Quick Reference

### Classification Metrics (Pass/Fail Tasks)

**Precision**: Of all responses marked as passing, what fraction truly passed?
- Use when false positives are costly

**Recall**: Of all actually passing responses, what fraction did we identify?
- Use when false negatives are costly

**F1 Score**: Harmonic mean of precision and recall
- Use for balanced single-number summary

### Agreement Metrics (Comparing to Human Judgment)

**Cohen's Kappa**: Agreement adjusted for chance
- > 0.8: Almost perfect agreement
- 0.6-0.8: Substantial agreement
- 0.4-0.6: Moderate agreement
- < 0.4: Fair to poor agreement

### Correlation Metrics (Ordinal Scores)

**Spearman's Rank Correlation**: Correlation between rankings
- > 0.9: Very strong correlation
- 0.7-0.9: Strong correlation
- 0.5-0.7: Moderate correlation
- < 0.5: Weak correlation

## Good Evaluation System Indicators

| Metric | Good | Acceptable | Concerning |
|--------|------|------------|------------|
| Spearman's ρ | > 0.8 | 0.6-0.8 | < 0.6 |
| Cohen's κ | > 0.7 | 0.5-0.7 | < 0.5 |
| Position consistency | > 0.9 | 0.8-0.9 | < 0.8 |
| Length-score correlation | < 0.2 | 0.2-0.4 | > 0.4 |

## Decision Tree: Direct vs. Pairwise

```
Is there an objective ground truth?
├── Yes → Direct Scoring
│   └── Examples: factual accuracy, instruction following, format compliance
│
└── No → Is it a preference or quality judgment?
    ├── Yes → Pairwise Comparison
    │   └── Examples: tone, style, persuasiveness, creativity
    │
    └── No → Consider reference-based evaluation
        └── Examples: summarization (compare to source), translation (compare to reference)
```

## Scaling Evaluation

For high-volume evaluation:

### 1. Panel of LLMs (PoLL)
Use multiple models as judges, aggregate votes.
- Reduces individual model bias
- More expensive but more reliable for high-stakes decisions

### 2. Hierarchical Evaluation
Fast cheap model for screening, expensive model for edge cases.
- Cost-effective for large volumes
- Requires calibration of screening threshold

### 3. Human-in-the-Loop
Automated evaluation for clear cases, human review for low-confidence.
- Best reliability for critical applications
- Design feedback loop to improve automated evaluation

## Implementation Checklist

- [ ] Choose approach (direct vs. pairwise) based on task type
- [ ] Define clear criteria with level descriptions
- [ ] Include chain-of-thought requirement (justify before score)
- [ ] Add bias mitigation (position swapping for pairwise)
- [ ] Select appropriate metrics for validation
- [ ] Calibrate against human judgments
- [ ] Monitor for systematic bias in production
