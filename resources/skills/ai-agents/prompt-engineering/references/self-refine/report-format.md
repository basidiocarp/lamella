# Evaluation Report Format

Standard format for self-reflection evaluation reports.

```markdown
# Evaluation Report

## Detailed Analysis

### [Criterion 1 Name] (Weight: 0.XX)
// ... (45 lines trimmed)
- Edge cases: [Handled / Some uncertainty]

**Confidence Level**: X.XX (Weighted Total of Criteria Scores) -> [High / Medium / Low]
```

## Iterative Refinement Workflow

### Chain of Verification (CoV)

1. **Generate**: Create initial solution
2. **Verify**: Check each component/claim
3. **Question**: What could go wrong?
4. **Re-answer**: Address identified issues

### Tree of Thoughts (ToT)

For complex problems, consider multiple approaches:

1. **Branch 1**: Current approach
   - Pros: [List advantages]
   - Cons: [List disadvantages]

2. **Branch 2**: Alternative approach
   - Pros: [List advantages]
   - Cons: [List disadvantages]

3. **Decision**: Choose best path based on:
   - Simplicity
   - Maintainability
   - Performance
   - Extensibility

## Refinement Metrics

Track the effectiveness of refinements:

### Iteration Count

- First attempt: [Initial solution]
- Iteration 1: [What was improved]
- Iteration 2: [Further improvements]
- Final: [Convergence achieved]

### Quality Indicators

- **Complexity Reduction**: Did refactoring simplify the code?
- **Bug Prevention**: Were potential issues identified and fixed?
- **Performance Gain**: Was efficiency improved?
- **Readability Score**: Is the final version clearer?

### Learning Points

Document patterns for future use:

- What type of issue was this?
- What solution pattern worked?
- Can this be reused elsewhere?
