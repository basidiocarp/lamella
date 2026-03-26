---
name: agent-evaluation
description: >-
  Evaluates and improves Claude Code commands, skills, and agents. Use when testing prompt effectiveness,
  validating context engineering choices, measuring improvement quality, or launching a judge sub-agent
  for independent assessment of work produced in the current session.
---

# Evaluation Methods for Claude Code Agents

Evaluate agent systems using outcome-focused approaches that account for non-determinism and multiple valid paths. This skill provides methodologies, templates, and workflows for systematic agent evaluation.

## Table of Contents

### Core Skill
- [Core Concepts](#core-concepts)
- [Quick Reference](#quick-reference)
- [Core Workflow](#core-workflow)
- [Essential Templates](#essential-templates)
- [Guidelines](#guidelines)

### Reference Documents
- [references/evaluation-challenges.md](references/evaluation-challenges.md) — Non-determinism, context-dependent failures, composite quality
- [references/rubric-design.md](references/rubric-design.md) — Multi-dimensional rubrics, scoring approaches, domain adaptation
- [references/evaluation-methodologies.md](references/evaluation-methodologies.md) — LLM-as-Judge, Human Evaluation, End-State Evaluation
- [references/advanced-llm-judge.md](references/advanced-llm-judge.md) — Evaluation taxonomy, bias landscape, metric selection framework
- [references/evaluation-approaches.md](references/evaluation-approaches.md) — Direct scoring, pairwise comparison, pipeline design
- [references/examples.md](references/examples.md) — Detailed examples, iterative improvement workflows
- [references/bias-mitigation.md](references/bias-mitigation.md) — Position, length, self-enhancement, verbosity, authority bias
- [references/evaluation-patterns.md](references/evaluation-patterns.md) — Implementation patterns, workflows, anti-patterns
- [references/metrics-reference.md](references/metrics-reference.md) — Classification, agreement, correlation metrics

---

## Core Concepts

Agent evaluation requires outcome-focused approaches that account for non-determinism and multiple valid paths. Multi-dimensional rubrics capture various quality aspects: factual accuracy, completeness, citation accuracy, source quality, and tool efficiency. LLM-as-judge provides scalable evaluation while human evaluation catches edge cases.

**Key insight**: Agents may find alternative paths to goals—the evaluation should judge whether they achieve right outcomes while following reasonable processes.

**Performance Drivers**: Research shows three factors explain 95% of agent performance variance:
- Token usage (80%) — More tokens = better performance
- Number of tool calls (~10%) — More exploration helps
- Model choice (~5%) — Better models multiply efficiency

## Quick Reference

### When to Use Each Approach

| Approach | Best For | Reliability |
|----------|----------|-------------|
| Direct Scoring | Objective criteria (accuracy, instruction following) | Moderate-High |
| Pairwise Comparison | Subjective preferences (tone, style) | Higher for preferences |
| Human Evaluation | Edge cases, subtle errors | Highest |
| End-State Evaluation | Artifact validation (code, configs) | Depends on tests |

### Good Evaluation System Indicators

| Metric | Good | Acceptable | Concerning |
|--------|------|------------|------------|
| Spearman's ρ | > 0.8 | 0.6-0.8 | < 0.6 |
| Cohen's κ | > 0.7 | 0.5-0.7 | < 0.5 |
| Position consistency | > 0.9 | 0.8-0.9 | < 0.8 |
| Length-score correlation | < 0.2 | 0.2-0.4 | > 0.4 |

### Standard Rubric Dimensions

| Dimension | Weight | Description |
|-----------|--------|-------------|
| Instruction Following | 0.30 | Did agent follow all instructions? |
| Output Completeness | 0.25 | Are all aspects covered? |
| Tool Efficiency | 0.20 | Appropriate tools, minimal calls? |
| Reasoning Quality | 0.15 | Clear, sound reasoning? |
| Response Coherence | 0.10 | Well-structured output? |

---

## Core Workflow

```
1. Define Criteria → 2. Create Test Cases → 3. Run Evaluation → 4. Mitigate Bias → 5. Interpret & Iterate
```

### Step 1: Define Evaluation Criteria

Define criteria with clear descriptions, weights, and level definitions:

```markdown
### Criterion: Instruction Following (weight: 0.30)
- **5 (Excellent)**: All instructions followed precisely
- **4 (Good)**: Minor deviations that don't affect outcome
- **3 (Adequate)**: Major instructions followed, minor ones missed
- **2 (Poor)**: Significant instructions ignored
- **1 (Failed)**: Fundamentally misunderstood the task
```

### Step 2: Create Test Cases

Structure test cases by complexity:

| Level | Description | Example |
|-------|-------------|---------|
| Simple | Single tool call | Rename a variable |
| Medium | Multiple tool calls | Extract a function |
| Complex | Many calls, some ambiguity | Refactor to pattern |
| Edge Case | Unusual situation | Conflicting names |

### Step 3: Run Evaluation

Choose approach based on task:
- **Objective criteria** → Direct Scoring
- **Preference judgment** → Pairwise Comparison (with position swapping)

### Step 4: Mitigate Bias

For pairwise comparisons, always use position swapping:
1. Run with A first, B second
2. Run with B first, A second
3. If results agree → Winner confirmed
4. If results disagree → TIE (bias detected)

### Step 5: Interpret & Iterate

1. Identify weaknesses from evaluation results
2. Hypothesize cause (prompt? context? examples?)
3. Modify prompt with targeted changes
4. Re-evaluate same test cases
5. Compare scores, check for regressions
6. Iterate until quality meets threshold

---

## Essential Templates

### Direct Scoring Template

```markdown
You are evaluating the output of a Claude Code agent.

## Original Task
{task_description}

// ... (25 lines trimmed)
## Summary
**Weighted Score**: [sum of (score × weight)]
**Pass/Fail**: [Pass if ≥ 3.5]
```

### Pairwise Comparison Template

```markdown
You are comparing two AI responses.

## Critical Instructions
- Do NOT prefer responses because they are longer
- Do NOT prefer responses based on position (first vs second)
// ... (21 lines trimmed)
Reasoning: [Explain comparison]
Winner: [A/B/TIE]
Confidence: [0.0-1.0]
```

### Evaluation Output Template

```markdown
## Evaluation Results

### Scores
| Criterion | Score | Weight | Weighted | Confidence |
|-----------|-------|--------|----------|------------|
// ... (12 lines trimmed)
- **Strengths**: [bullet points]
- **Weaknesses**: [bullet points]
- **Improvements**: [prioritized suggestions]
```

---

## Guidelines

1. **Always require justification before scores** — Chain-of-thought improves reliability by 15-25%
2. **Always swap positions in pairwise comparison** — Single-pass is corrupted by position bias
3. **Match scale granularity to rubric specificity** — Don't use 1-10 without detailed levels
4. **Separate objective and subjective criteria** — Direct scoring for objective, pairwise for subjective
5. **Include confidence scores** — Calibrate to consistency and evidence strength
6. **Define edge cases explicitly** — Ambiguous situations cause the most variance
7. **Use domain-specific rubrics** — Generic rubrics produce generic evaluations
8. **Validate against human judgments** — Automated evaluation must correlate with human assessment
9. **Monitor for systematic bias** — Track disagreement patterns by criterion and response type
10. **Design for iteration** — Evaluation systems improve with feedback loops

---

## Judge Sub-Agent Pattern

To evaluate work produced in the current session using context isolation:

1. **Extract context** - Identify the original task, work output, and files involved
2. **Launch judge sub-agent** - Use the Task tool with the Direct Scoring Template above, passing only extracted context (not the entire conversation) to prevent confirmation bias
3. **Process results** - Validate scores are in range (1-5), each has justification with evidence, and weighted total is correct

**Scoring Interpretation:**

| Score | Verdict | Action |
|-------|---------|--------|
| 4.50-5.00 | Excellent | Ready as-is |
| 4.00-4.49 | Good | Minor improvements optional |
| 3.50-3.99 | Acceptable | Improvements recommended |
| 3.00-3.49 | Needs work | Address issues before use |
| 1.00-2.99 | Insufficient | Significant rework needed |

---

## See Also

For detailed coverage of specific topics, see the reference documents:

| Topic | Reference |
|-------|-----------|
| Understanding evaluation challenges | [evaluation-challenges.md](references/evaluation-challenges.md) |
| Creating effective rubrics | [rubric-design.md](references/rubric-design.md) |
| Choosing evaluation methods | [evaluation-methodologies.md](references/evaluation-methodologies.md) |
| Advanced LLM-as-Judge techniques | [advanced-llm-judge.md](references/advanced-llm-judge.md) |
| Implementation details | [evaluation-approaches.md](references/evaluation-approaches.md) |
| Worked examples | [examples.md](references/examples.md) |
| Mitigating evaluation bias | [bias-mitigation.md](references/bias-mitigation.md) |
| Evaluation patterns & workflows | [evaluation-patterns.md](references/evaluation-patterns.md) |
| Selecting & interpreting metrics | [metrics-reference.md](references/metrics-reference.md) |

## Artifact Quality Audit

Systematic quality scoring for Claude Code agents, skills, and commands across 16 weighted criteria with production readiness threshold.

### Audit Modes

| Mode | Usage | Speed |
|------|-------|-------|
| Quick | Top-5 critical criteria | 3-5 min |
| Full | All 16 criteria | 10-15 min |
| Comparative | Full + benchmark vs templates | 15-20 min |

### Scoring Categories

| Category | Weight | Max Points |
|----------|--------|------------|
| Identity/Structure | 3x | 12 |
| Prompt/Content Quality | 2x | 8 |
| Validation/Technical | 1x | 4 |
| Design | 2x | 8 |

### Grade Scale

| Grade | Score | Meaning |
|-------|-------|---------|
| A | 90-100% | Production-ready |
| B | 80-89% | Meets threshold (minimum for production) |
| C | 70-79% | Needs improvement |
| D | 60-69% | Not production-ready |
| F | <60% | Major refactoring needed |

See [references/artifact-audit/](references/artifact-audit/) for methodology, detection patterns, workflow phases, output examples, and CI/CD integration.

## Reference Files


| File | Path |
|------|------|
| [Cicd Integration](references/artifact-audit/cicd-integration.md) | `references/artifact-audit/cicd-integration.md` |
| [Detection Patterns](references/artifact-audit/detection-patterns.md) | `references/artifact-audit/detection-patterns.md` |
| [Methodology](references/artifact-audit/methodology.md) | `references/artifact-audit/methodology.md` |
| [Output Examples](references/artifact-audit/output-examples.md) | `references/artifact-audit/output-examples.md` |
| [Workflow Phases](references/artifact-audit/workflow-phases.md) | `references/artifact-audit/workflow-phases.md` |
