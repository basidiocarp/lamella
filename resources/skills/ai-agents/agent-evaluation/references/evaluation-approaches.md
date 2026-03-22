# Evaluation Approaches

This reference provides detailed implementation guidance for Direct Scoring and Pairwise Comparison approaches.

## Direct Scoring Implementation

Direct scoring requires three components: clear criteria, a calibrated scale, and structured output format.

### Criteria Definition Pattern

```
Criterion: [Name]
Description: [What this criterion measures]
Weight: [Relative importance, 0-1]
```

### Scale Calibration

| Scale | Use Case | Cognitive Load |
|-------|----------|----------------|
| 1-3 | Binary with neutral option | Lowest |
| 1-5 | Standard Likert, good balance | Moderate |
| 1-10 | High granularity, needs detailed rubrics | Highest |

### Direct Scoring Prompt Template

```markdown
You are an expert evaluator assessing response quality.

## Task
Evaluate the following response against each criterion.

// ... (15 lines trimmed)

## Output Format
Respond with structured JSON containing scores, justifications, and summary.
```

### Chain-of-Thought Requirement

**All scoring prompts must require justification before the score.** Research shows this improves reliability by 15-25% compared to score-first approaches.

## Pairwise Comparison Implementation

Pairwise comparison is inherently more reliable for preference-based evaluation but requires bias mitigation.

### Position Bias Mitigation Protocol

1. **First pass**: Response A in first position, Response B in second
2. **Second pass**: Response B in first position, Response A in second
3. **Consistency check**: If passes disagree, return TIE with reduced confidence
4. **Final verdict**: Consistent winner with averaged confidence

### Pairwise Comparison Prompt Template

```markdown
You are an expert evaluator comparing two AI responses.

## Critical Instructions
- Do NOT prefer responses because they are longer
- Do NOT prefer responses based on position (first vs second)
// ... (19 lines trimmed)

## Output Format
JSON with per-criterion comparison, overall winner, confidence (0-1), and reasoning.
```

### Confidence Calibration

Confidence scores should reflect position consistency:
- Both passes agree: confidence = average of individual confidences
- Passes disagree: confidence = 0.5, verdict = TIE

## Practical Guidance

### Evaluation Pipeline Design

Production evaluation systems require multiple layers:

```
┌─────────────────────────────────────────────────┐
│                 Evaluation Pipeline              │
├─────────────────────────────────────────────────┤
│                                                   │
│  Input: Response + Prompt + Context               │
// ... (22 lines trimmed)
│  Output: Scores + Justifications + Confidence     │
│                                                   │
└─────────────────────────────────────────────────┘
```

### Avoiding Evaluation Pitfalls

| Anti-pattern | Problem | Solution |
|--------------|---------|----------|
| Scoring without justification | Scores lack grounding, difficult to debug | Always require evidence-based justification before score |
| Single-pass pairwise comparison | Position bias corrupts results | Always swap positions and check consistency |
| Overloaded criteria | Criteria measuring multiple things are unreliable | One criterion = one measurable aspect |
| Missing edge case guidance | Evaluators handle ambiguous cases inconsistently | Include edge cases in rubrics with explicit guidance |
| Ignoring confidence calibration | High-confidence wrong judgments are worse than low-confidence | Calibrate confidence to position consistency and evidence strength |

### Decision Framework: Direct vs. Pairwise

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
        └── Examples: summarization, translation
```

### Scaling Evaluation

For high-volume evaluation:

**1. Panel of LLMs (PoLL)**
- Use multiple models as judges, aggregate votes
- Reduces individual model bias
- More expensive but more reliable for high-stakes decisions

**2. Hierarchical evaluation**
- Fast cheap model for screening
- Expensive model for edge cases
- Cost-effective for large volumes
- Requires calibration of screening threshold

**3. Human-in-the-loop**
- Automated evaluation for clear cases
- Human review for low-confidence
- Best reliability for critical applications
- Design feedback loop to improve automated evaluation

## Rubric Generation

Well-defined rubrics reduce evaluation variance by 40-60% compared to open-ended scoring.

### Rubric Components

1. **Level descriptions**: Clear boundaries for each score level
2. **Characteristics**: Observable features that define each level
3. **Examples**: Representative outputs for each level (when possible)
4. **Edge cases**: Guidance for ambiguous situations
5. **Scoring guidelines**: General principles for consistent application

### Strictness Calibration

| Setting | Description | Use Case |
|---------|-------------|----------|
| Lenient | Lower bar for passing scores | Encouraging iteration |
| Balanced | Fair, typical expectations | Production use |
| Strict | High standards | Safety-critical evaluation |

### Domain Adaptation

Rubrics should use domain-specific terminology:

- **Code**: Variables, functions, comments, tests
- **Documentation**: Clarity, accuracy, completeness
- **Analysis**: Depth, accuracy, actionability

## Implementation Checklist

- [ ] Define criteria with clear descriptions and weights
- [ ] Choose appropriate scale (1-3, 1-5, or 1-10)
- [ ] Create level descriptions for each criterion
- [ ] Add edge case guidance
- [ ] Implement position swapping for pairwise comparison
- [ ] Add confidence calibration
- [ ] Validate against human judgments
