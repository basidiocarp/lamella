# LLM-as-Judge Implementation Patterns

This reference provides practical prompt patterns and workflows for evaluating Claude Code commands, skills, and agents during development.

## Pattern 1: Structured Evaluation Workflow

The most reliable evaluation follows a structured workflow that separates concerns:

```
Define Criteria → Gather Test Cases → Run Evaluation → Mitigate Bias → Interpret Results
```

### Step 1: Define Evaluation Criteria

Before evaluating, establish clear criteria. Document them in a reusable format:

```markdown
## Evaluation Criteria for [Command/Skill Name]

### Criterion 1: Instruction Following (weight: 0.30)
- **Description**: Does the output follow all explicit instructions?
- **1 (Poor)**: Ignores or misunderstands core instructions
// ... (11 lines trimmed)
- **1 (Poor)**: Wrong tools or excessive redundant calls
- **3 (Adequate)**: Appropriate tools with some redundancy
- **5 (Excellent)**: Optimal tool selection, minimal calls
```

### Step 2: Create Test Cases

Structure test cases by complexity level:

```markdown
## Test Cases for /refactor Command

### Simple (Single Operation)
- **Input**: Rename variable `x` to `count` in a single file
- **Expected**: All instances renamed, code still runs
// ... (13 lines trimmed)
- **Input**: Refactor code with conflicting variable names
- **Expected**: Correct scoping preserved
- **Complexity**: Edge case
```

### Step 3: Run Direct Scoring Evaluation

Use this prompt template to evaluate a single output:

```markdown
You are evaluating the output of a Claude Code command.

## Original Task
{paste the user's original request}

// ... (23 lines trimmed)
**Weighted Score**: [Calculate: sum of (score × weight)]
**Pass/Fail**: [Pass if weighted score ≥ 3.5]
**Summary**: [2-3 sentences on strengths and weaknesses]
```

### Step 4: Mitigate Position Bias in Comparisons

When comparing two prompt variants, use two-pass workflow with position swapping. See [bias-mitigation.md](bias-mitigation.md) for details.

## Pattern 2: Hierarchical Evaluation Workflow

For complex evaluations, use a hierarchical approach:

```
Quick Screen (cheap model) → Detailed Evaluation (expensive model) → Human Review (edge cases)
```

### Tier 1: Quick Screen (Use Haiku)

```markdown
Rate this command output 0-10 for basic adequacy.

Task: {brief task description}
Output: {command output}

Quick assessment: Does this output reasonably address the task?
Score (0-10):
One-line reasoning:
```

**Decision rule**: Score < 5 → Fail, Score ≥ 7 → Pass, Score 5-7 → Escalate

### Tier 2: Detailed Evaluation (Use Opus)

Use full direct scoring prompt from Pattern 1.

### Tier 3: Human Review

For low-confidence automated evaluations (confidence < 0.6):

```markdown
## Human Review Request

**Automated Score**: 3.2/5 (Confidence: 0.45)
**Reason for Escalation**: Low confidence

### What to Review
1. Does the output actually complete the task?
2. Are the automated criterion scores reasonable?
3. What did the automation miss?

### Human Override
[ ] Agree with automation
[ ] Override to PASS - Reason: ___
[ ] Override to FAIL - Reason: ___
```

## Pattern 3: Panel of LLM Judges (PoLL)

For high-stakes evaluation, use multiple models:

### Workflow

1. **Run 3 independent evaluations** with different prompt framings:
   - Standard: "Evaluate this output against criteria. Be fair and balanced."
   - Adversarial: "Find problems with this output. Be critical and thorough."
   - User perspective: "Would a developer be satisfied with this result?"

2. **Aggregate results**:
   - Take median score per criterion (robust to outliers)
   - Flag criteria with high variance (std > 1.0) for review
   - Overall pass requires majority agreement

### Agreement Analysis

| Criterion | Judge 1 | Judge 2 | Judge 3 | Median | Std Dev |
|-----------|---------|---------|---------|--------|---------|
| Instruction Following | 4 | 4 | 5 | 4 | 0.58 |
| Completeness | 3 | 4 | 3 | 3 | 0.58 |
| Tool Efficiency | 2 | 3 | 4 | 3 | 1.00 ⚠️ |

**⚠️ High variance** suggests criterion needs clearer definition.

## Pattern 4: Confidence Calibration

Add this to evaluation prompts:

```markdown
## Confidence Assessment

After scoring, assess your confidence:

1. **Evidence Strength**: How specific was the evidence you cited?
// ... (14 lines trimmed)

Confidence: [score]
Confidence Reasoning: [explain what factors affected confidence]
```

## Pattern 5: Structured Output Format

### Evaluation Output Template

```markdown
## Evaluation Results

### Metadata
- **Evaluated**: [command/skill name]
- **Test Case**: [test case ID]
// ... (21 lines trimmed)
### Confidence Assessment
- **Overall Confidence**: 0.78
- **Flags**: [any concerns]
```

## Evaluation Workflows for Claude Code Development

### Workflow: Testing a New Command

1. Write 5-10 test cases spanning complexity levels
2. Run command on each test case, capture output
3. Quick screen all outputs with Tier 1 evaluation
4. Detailed evaluate failures and borderline cases
5. Identify patterns in failures
6. Iterate prompt based on weaknesses
7. Re-evaluate same test cases to measure improvement

### Workflow: Comparing Prompt Variants

1. Create variant prompts
2. Run both variants on identical test cases
3. Pairwise compare with position swapping
4. Calculate win rate for each variant
5. Analyze which cases each variant handles better
6. Decide: Pick winner or create hybrid

### Workflow: Regression Testing

1. Maintain test suite of representative cases
2. Before changes: Run evaluation, record baseline scores
3. After changes: Re-run evaluation
4. Compare: Flag regressions (score drops > 0.5)
5. Investigate: Why did specific cases regress?
6. Accept or revert based on overall impact

### Workflow: Continuous Quality Monitoring

1. Sample production usage (if available)
2. Run lightweight evaluation on samples
3. Track metrics over time (avg scores, failure rate)
4. Alert on degradation (score drop > 10%)
5. Periodic deep dive on random sample

## Anti-Patterns to Avoid

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| Scoring Without Justification | Scores lack grounding | Always require evidence before score |
| Single-Pass Pairwise | Position bias corrupts results | Always swap positions |
| Overloaded Criteria | Multiple things measured unreliably | One criterion = one aspect |
| Missing Edge Case Guidance | Inconsistent handling | Include edge cases in rubrics |
| Ignoring Low Confidence | Wrong conclusions | Escalate for human review |
| Generic Rubrics | Vague, unhelpful evaluations | Create domain-specific rubrics |

## Handling Evaluation Failures

### Malformed Output Disregard

When the evaluator produces unparseable output:
1. Mark as invalid and ignore for analysis
2. Retry initial prompt (multiple retries usually more consistent)
3. If still failing, flag for human review

### Validation Checklist

Before trusting results:
- [ ] All criteria have scores in valid range
- [ ] Each score has justification with evidence
- [ ] Confidence score provided and reasonable
- [ ] No contradictions between justification and score
- [ ] Weighted total calculation correct

## Validating Evaluation Prompts (Meta-Evaluation)

### Calibration Test Cases

| Test Type | Description | Expected Score |
|-----------|-------------|----------------|
| Known-good | Clearly excellent output | 4.5+ / 5.0 |
| Known-bad | Clearly poor output | < 2.5 / 5.0 |
| Boundary | Borderline case | 3.0-3.5 with nuance |

### Validation Workflow

1. **Known-good test**: If score < 4.0 → Rubric too strict
2. **Known-bad test**: If score > 3.0 → Rubric too lenient
3. **Boundary test**: Should produce moderate score with detailed explanation
4. **Consistency test**: Run 3 times, variance should be < 0.5

### Position Bias Validation

Test with identical outputs in both positions:
- Expected: TIE with high confidence (>0.9)
- If shows winner: Add stronger anti-bias instructions
