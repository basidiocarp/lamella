# Rubric Design

Well-defined rubrics reduce evaluation variance by 40-60% compared to open-ended scoring. This reference provides patterns for creating effective evaluation rubrics.

## Multi-Dimensional Rubric Template

Effective rubrics cover key dimensions with descriptive levels:

### Instruction Following (weight: 0.30)

| Level | Score | Description |
|-------|-------|-------------|
| Excellent | 1.0 | All instructions followed precisely |
| Good | 0.8 | Minor deviations that don't affect outcome |
| Acceptable | 0.6 | Major instructions followed, minor ones missed |
| Poor | 0.3 | Significant instructions ignored |
| Failed | 0.0 | Fundamentally misunderstood the task |

### Output Completeness (weight: 0.25)

| Level | Score | Description |
|-------|-------|-------------|
| Excellent | 1.0 | All requested aspects thoroughly covered |
| Good | 0.8 | Most aspects covered with minor gaps |
| Acceptable | 0.6 | Key aspects covered, some gaps |
| Poor | 0.3 | Major aspects missing |
| Failed | 0.0 | Fundamental aspects not addressed |

### Tool Efficiency (weight: 0.20)

| Level | Score | Description |
|-------|-------|-------------|
| Excellent | 1.0 | Optimal tool selection and minimal calls |
| Good | 0.8 | Good tool selection with minor inefficiencies |
| Acceptable | 0.6 | Appropriate tools with some redundancy |
| Poor | 0.3 | Wrong tools or excessive calls |
| Failed | 0.0 | Severe tool misuse or extremely excessive calls |

### Reasoning Quality (weight: 0.15)

| Level | Score | Description |
|-------|-------|-------------|
| Excellent | 1.0 | Clear, logical reasoning throughout |
| Good | 0.8 | Generally sound reasoning with minor gaps |
| Acceptable | 0.6 | Basic reasoning present |
| Poor | 0.3 | Reasoning unclear or flawed |
| Failed | 0.0 | No apparent reasoning |

### Response Coherence (weight: 0.10)

| Level | Score | Description |
|-------|-------|-------------|
| Excellent | 1.0 | Well-structured, easy to follow |
| Good | 0.8 | Generally coherent with minor issues |
| Acceptable | 0.6 | Understandable but could be clearer |
| Poor | 0.3 | Difficult to follow |
| Failed | 0.0 | Incoherent |

## Scoring Approach

Convert dimension assessments to numeric scores (0.0 to 1.0) with appropriate weighting:

```
Final Score = Σ (dimension_score × dimension_weight)
```

**Passing Thresholds**:
- General use: ≥ 0.7
- Production deployment: ≥ 0.75
- Critical operations: ≥ 0.85

## Rubric Components

Every complete rubric should include:

1. **Level descriptions**: Clear boundaries for each score level
2. **Characteristics**: Observable features that define each level
3. **Examples**: Representative outputs for each level (when possible)
4. **Edge cases**: Guidance for ambiguous situations
5. **Scoring guidelines**: General principles for consistent application

## Strictness Calibration

Adjust strictness based on evaluation purpose:

| Strictness | Description | Use Case |
|------------|-------------|----------|
| Lenient | Lower bar for passing scores | Encouraging iteration, early development |
| Balanced | Fair, typical expectations | Production use, general evaluation |
| Strict | High standards | Safety-critical, high-stakes evaluation |

**Calibration Example**:

For "Code Correctness" criterion:
- **Lenient**: Code runs without errors (may have edge case issues)
- **Balanced**: Code handles normal cases correctly, reasonable error handling
- **Strict**: Code handles all edge cases, comprehensive error handling, optimal performance

## Domain Adaptation

Rubrics should use domain-specific terminology:

### Code Evaluation
- Variables, functions, comments, tests
- "Follows project conventions"
- "Efficient algorithmic complexity"

### Documentation Evaluation
- Clarity, accuracy, completeness
- "Appropriate level of detail"
- "Matches target audience"

### Analysis Evaluation
- Depth, accuracy, actionability
- "Evidence-based conclusions"
- "Clear recommendations"

## Creating Custom Rubrics

### Step 1: Identify Criteria

List the dimensions that matter for your use case:
```
1. [Criterion name]: [What it measures]
2. [Criterion name]: [What it measures]
...
```

### Step 2: Define Weights

Assign weights that sum to 1.0:
```
Criterion 1: 0.30
Criterion 2: 0.25
Criterion 3: 0.20
Criterion 4: 0.15
Criterion 5: 0.10
```

### Step 3: Create Level Descriptions

For each criterion, define 5 levels (1-5 or 0.0-1.0):
```
5 (Excellent): [Clear description of excellent performance]
4 (Good): [Clear description of good performance]
3 (Adequate): [Clear description of adequate performance]
2 (Poor): [Clear description of poor performance]
1 (Failed): [Clear description of failure]
```

### Step 4: Add Edge Cases

Document how to handle ambiguous situations:
```
Edge Case 1: [Situation] → [Guidance]
Edge Case 2: [Situation] → [Guidance]
```

### Step 5: Calibrate and Test

1. Evaluate known-good output (should score 4.5+)
2. Evaluate known-bad output (should score < 2.5)
3. Evaluate borderline case (should score 3.0-3.5 with nuanced explanation)
4. Adjust rubric until calibration tests pass
