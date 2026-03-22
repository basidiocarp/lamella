# Evaluation Methodologies

This reference covers the primary methodologies for evaluating agent outputs: LLM-as-Judge, Human Evaluation, and End-State Evaluation.

## LLM-as-Judge

Using an LLM to evaluate agent outputs scales well and provides consistent judgments. The key is designing effective evaluation prompts that capture the dimensions of interest.

### Evaluation Prompt Template

```markdown
You are evaluating the output of a Claude Code agent.

## Original Task
{task_description}

// ... (17 lines trimmed)
5. Response Coherence: Is the output well-structured?

Provide your evaluation as a structured assessment with scores and justifications.
```

### Chain-of-Thought Requirement

**ALWAYS require justification before the score.** Research shows this improves reliability by 15-25% compared to score-first approaches.

**Good practice**:
```
Evidence: [specific observations]
Justification: [explanation]
Score: [number]
```

**Avoid**:
```
Score: [number]
Reason: [post-hoc justification]
```

## Human Evaluation

Human evaluation catches what automation misses:

- Hallucinated answers on unusual queries
- Subtle context misunderstandings
- Edge cases that automated evaluation overlooks
- Qualitative issues with tone or approach

### Human Evaluation Best Practices

1. **Review agent outputs manually for edge cases**: Focus human attention where it matters most
2. **Sample systematically across complexity levels**: Don't just review failures
3. **Track patterns in failures**: Inform prompt improvements with specific failure modes
4. **Use structured evaluation forms**: Ensure consistent human assessments

### Human Evaluation Form Template

```markdown
## Human Evaluation

**Task**: [description]
**Output**: [agent output]

// ... (15 lines trimmed)

### Specific Feedback
[Free-form notes]
```

## End-State Evaluation

For commands that produce artifacts (files, configurations, code), evaluate the final output rather than the process.

### End-State Evaluation Questions

- Does the generated code work?
- Is the configuration valid?
- Does the output meet requirements?
- Does the artifact integrate correctly?

### End-State Evaluation Approaches

| Artifact Type | Evaluation Method |
|---------------|-------------------|
| Code | Run tests, lint, type-check |
| Configuration | Validate schema, deploy to test |
| Documentation | Readability check, link validation |
| Data | Schema validation, constraint checks |

## Test Set Design

### Sample Selection

Start with small samples during development. Early in agent development, changes have dramatic impacts because there is abundant low-hanging fruit. Small test sets reveal large effects.

**Guidelines**:
- Sample from real usage patterns
- Add known edge cases
- Ensure coverage across complexity levels
- 10-20 test cases is often sufficient for iteration

### Complexity Stratification

Test sets should span complexity levels:

| Level | Description | Example |
|-------|-------------|---------|
| Simple | Single tool call | Rename a variable |
| Medium | Multiple tool calls | Extract a function |
| Complex | Many tool calls, some ambiguity | Refactor to design pattern |
| Very Complex | Extended interaction, deep reasoning | Restructure module dependencies |

## Context Engineering Evaluation

### Testing Prompt Variations

When iterating on Claude Code prompts, evaluate systematically:

1. **Baseline**: Run current prompt on test cases
2. **Variation**: Run modified prompt on same cases
3. **Compare**: Measure quality scores, token usage, efficiency
4. **Analyze**: Identify which changes improved which dimensions

### Testing Context Strategies

Context engineering choices should be validated through systematic evaluation:

```
Strategy A vs Strategy B
├── Run agents with different context strategies on same test set
├── Compare quality scores
├── Compare token usage
└── Compare efficiency metrics
```

### Degradation Testing

Test how context degradation affects performance:

1. Run agents at different context sizes (25%, 50%, 75%, 100%)
2. Identify performance cliffs where quality drops sharply
3. Establish safe operating limits
4. Document failure modes at context limits

## Combining Methodologies

For robust evaluation, combine methodologies:

```
┌─────────────────────────────────────────────────┐
│           Comprehensive Evaluation               │
├─────────────────────────────────────────────────┤
│                                                   │
│  ┌─────────────────┐                             │
// ... (13 lines trimmed)
│  └─────────────────┘                             │
│                                                   │
└─────────────────────────────────────────────────┘
```

Use LLM-as-Judge for broad coverage, Human Evaluation for edge cases and calibration, and End-State Validation for functional correctness.
