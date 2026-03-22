# Evaluation Examples

This reference provides detailed examples of evaluation techniques in practice.

## Example 1: Direct Scoring for Accuracy

**Input**:
```
Prompt: "What causes seasons on Earth?"
Response: "Seasons are caused by Earth's tilted axis. As Earth orbits the Sun,
different hemispheres receive more direct sunlight at different times of year."
Criterion: Factual Accuracy (weight: 1.0)
Scale: 1-5
```

**Output**:
```json
{
  "criterion": "Factual Accuracy",
  "score": 5,
  "evidence": [
    "Correctly identifies axial tilt as primary cause",
    "Correctly explains differential sunlight by hemisphere",
    "No factual errors present"
  ],
  "justification": "Response accurately explains the cause of seasons with correct
scientific reasoning. Both the axial tilt and its effect on sunlight distribution
are correctly described.",
  "improvement": "Could add the specific tilt angle (23.5°) for completeness."
}
```

## Example 2: Pairwise Comparison with Position Swap

**Input**:
```
Prompt: "Explain machine learning to a beginner"
Response A: [Technical explanation with jargon]
Response B: [Simple analogy-based explanation]
Criteria: ["clarity", "accessibility"]
```

**First Pass (A first)**:
```json
{ "winner": "B", "confidence": 0.8 }
```

**Second Pass (B first)**:
```json
{ "winner": "A", "confidence": 0.6 }
```
(Note: Winner is A because B was in first position)

**Mapped Second Pass**:
```json
{ "winner": "B", "confidence": 0.6 }
```

**Final Result**:
```json
{
  "winner": "B",
  "confidence": 0.7,
  "positionConsistency": {
    "consistent": true,
    "firstPassWinner": "B",
    "secondPassWinner": "B"
  }
}
```

## Example 3: Rubric Generation

**Input**:
```
criterionName: "Code Readability"
criterionDescription: "How easy the code is to understand and maintain"
domain: "software engineering"
scale: "1-5"
strictness: "balanced"
```

**Output** (abbreviated):
```json
{
  "levels": [
    {
      "score": 1,
      "label": "Poor",
// ... (32 lines trimmed)
    }
  ]
}
```

## Example 4: Evaluating a Claude Code Command

Suppose you've created a `/refactor` command and want to evaluate its quality:

**Test Cases**:

1. **Simple**: Rename a variable across a single file
2. **Medium**: Extract a function from existing code
3. **Complex**: Refactor a class to use a new design pattern
4. **Very Complex**: Restructure module dependencies

**Evaluation Rubric**:

| Criterion | Description | Weight |
|-----------|-------------|--------|
| Correctness | Does the refactored code work? | 0.40 |
| Completeness | Were all instances updated? | 0.25 |
| Style | Does it follow project conventions? | 0.20 |
| Efficiency | Were unnecessary changes avoided? | 0.15 |

**Evaluation Prompt**:

```markdown
Evaluate this refactoring output:

Original Code:
{original}

// ... (10 lines trimmed)
4. Efficiency: Were only necessary changes made?

Provide scores with specific evidence from the code.
```

**Iteration Process**:

If evaluation reveals the command often misses instances:

1. Add explicit instruction: "Search the entire codebase for all occurrences"
2. Re-evaluate with same test cases
3. Compare completeness scores
4. Check that correctness didn't regress

## Example 5: Iterative Improvement Workflow

```
1. Identify weakness
   └── Use evaluation to find where agent struggles
       Example: "Agent scores 2/5 on Completeness for complex refactors"

2. Hypothesize cause
// ... (19 lines trimmed)
7. Iterate
   └── Repeat until quality meets threshold
       Example: Accept tradeoff, deploy new prompt
```

## Example 6: Multi-Criterion Evaluation Output

**Task**: Evaluate a documentation generation command

**Full Evaluation Output**:

```markdown
## Evaluation Results

### Metadata
- **Command**: /generate-docs
- **Test Case**: API endpoint documentation
// ... (34 lines trimmed)
### Confidence Assessment
- **Overall Confidence**: 0.84
- **Flags**: Examples criterion had lower confidence due to subjective quality judgment
```

## Guidelines Summary

1. **Always require justification before scores** - Chain-of-thought prompting improves reliability by 15-25%
2. **Always swap positions in pairwise comparison** - Single-pass comparison is corrupted by position bias
3. **Match scale granularity to rubric specificity** - Don't use 1-10 without detailed level descriptions
4. **Separate objective and subjective criteria** - Use direct scoring for objective, pairwise for subjective
5. **Include confidence scores** - Calibrate to position consistency and evidence strength
6. **Define edge cases explicitly** - Ambiguous situations cause the most evaluation variance
7. **Use domain-specific rubrics** - Generic rubrics produce generic (less useful) evaluations
8. **Validate against human judgments** - Automated evaluation is only valuable if it correlates with human assessment
9. **Monitor for systematic bias** - Track disagreement patterns by criterion and response type
10. **Design for iteration** - Evaluation systems improve with feedback loops
