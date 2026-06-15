# Evaluation Report Format

Standard format for self-reflection evaluation reports.

```markdown
# Evaluation Report

## Detailed Analysis

### [Criterion Name] (Weight: 0.XX)
- Score: X.XX
- Evidence: [What supports the score]
- Gaps: [What is missing or weak]

## Overall Assessment
- Strengths: [List]
- Weaknesses: [List]
- Edge cases: [Handled / Some uncertainty]

**Confidence Level**: X.XX -> [High / Medium / Low]
```

## Iterative Refinement Workflow

### Chain of Verification

1. Generate an initial answer.
2. Verify each major claim or component.
3. Ask what could be wrong.
4. Revise based on the issues found.

### Tree of Thoughts

For complex problems:
1. outline at least two plausible approaches
2. compare them on simplicity, maintainability, performance, and extensibility
3. select the best path and explain why

## Refinement Metrics

Track:
- iteration count
- complexity reduction
- bug prevention
- performance gain
- readability improvement

## Learning Points

Document:
- what type of issue this was
- what fix pattern worked
- whether the pattern can be reused elsewhere
