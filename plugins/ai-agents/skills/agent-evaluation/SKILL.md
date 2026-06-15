---
name: agent-evaluation
description: "Evaluates and improves Claude Code commands, skills, and agents."
origin: lamella
---

# Evaluation Methods for Claude Code Agents

Use this skill when evaluating commands, skills, agents, or judge pipelines. Keep the main skill focused on evaluation structure and escalation to the right reference.

## When to Use

- comparing two prompts or agent variants
- building a rubric for agent outputs
- checking for evaluation bias or regression
- launching a judge sub-agent for current-session work

## Core Rules

1. evaluate outcomes, not only surface style
2. separate objective scoring from subjective preference judgments
3. use bias controls for pairwise comparisons
4. validate automated judgments against human reasoning when the stakes are high

## Core Workflow

1. define criteria and scoring method
2. assemble representative test cases
3. run direct scoring or pairwise comparison as appropriate
4. inspect bias, disagreement, and confidence
5. iterate on prompts or context based on concrete failure patterns

## References

- [references/evaluation-challenges.md](references/evaluation-challenges.md)
- [references/rubric-design.md](references/rubric-design.md)
- [references/evaluation-methodologies.md](references/evaluation-methodologies.md)
- [references/evaluation-approaches.md](references/evaluation-approaches.md)
- [references/bias-mitigation.md](references/bias-mitigation.md)
- [references/evaluation-patterns.md](references/evaluation-patterns.md)
- [references/metrics-reference.md](references/metrics-reference.md)
- [references/examples.md](references/examples.md)
- [references/advanced-llm-judge.md](references/advanced-llm-judge.md)
