---
name: prompt-engineering
description: "Improves prompts for commands, hooks, skills, agents, and other LLM interactions."
origin: lamella
---

# Prompt Engineering Patterns

## Contents

- [When to Use](#when-to-use)
- [Core Techniques](#core-techniques)
- [Key Patterns](#key-patterns)
- [Best Practices](#best-practices)
- [Common Pitfalls](#common-pitfalls)
- [References](#references)

Advanced prompt engineering techniques to maximize LLM performance, reliability, and controllability.

## When to Use

- Writing commands, hooks, or skills for Claude Code
- Designing prompts for sub-agents
- Optimizing LLM outputs
- Building production prompt templates

## Core Techniques

| Technique | When to Use | Key Insight |
| --------- | ----------- | ----------- |
| **Few-Shot Learning** | Consistent formatting, edge cases | 2-5 examples teach better than rules |
| **Chain-of-Thought** | Complex multi-step reasoning | "Think step by step" improves accuracy 30-50% |
| **Prompt Optimization** | Production prompts | Start simple, measure, iterate |
| **Template Systems** | Multi-turn, reusable patterns | Variables + conditionals reduce duplication |
| **System Prompts** | Stable global behavior | Role, format, constraints that persist |

## Key Patterns

### Progressive Disclosure

Start simple, add complexity only when needed:

1. **Level 1**: "Summarize this article"
2. **Level 2**: "Summarize in 3 bullet points, focusing on key findings"
3. **Level 3**: "Read this article, identify main findings, then summarize in 3 bullets"
4. **Level 4**: Include 2-3 example summaries

### Instruction Hierarchy

```
[System Context] -> [Task] -> [Examples] -> [Input] -> [Output Format]
```

### Error Recovery

- Include fallback instructions
- Request confidence scores
- Ask for alternatives when uncertain
- Specify how to indicate missing info

### Degrees of Freedom

| Level | Use When | Example |
| ----- | -------- | ------- |
| High | Multiple valid approaches | "Review code for issues" |
| Medium | Preferred pattern exists | Template with customization |
| Low | Fragile, exact requirements | "Run exactly this script" |

## Best Practices

1. **Be Specific** - Vague prompts produce inconsistent results
2. **Show, Don't Tell** - Examples > descriptions
3. **Test Extensively** - Diverse inputs + edge cases
4. **Iterate Rapidly** - Small changes = large impacts
5. **Version Control** - Treat prompts as code
6. **Document Intent** - Explain why, not just what

## Common Pitfalls

- **Over-engineering** - Starting complex before trying simple
- **Example pollution** - Examples that don't match target task
- **Context overflow** - Exceeding token limits
- **Ambiguous instructions** - Multiple interpretations possible
- **Ignoring edge cases** - Not testing unusual inputs

## Concise is Key

Claude is already smart. Only add context Claude doesn't have.

**Good** (~50 tokens):
```markdown
## Extract PDF text
Use pdfplumber for text extraction:
[code example]
```

**Bad** (~150 tokens):
```markdown
PDF (Portable Document Format) files are a common file format...
```

## Advanced Techniques

### Chain-of-Thought & Reasoning Techniques

| Technique | When to Use | Accuracy Gain |
| --------- | ----------- | ------------- |
| Zero-shot CoT | Quick reasoning, no examples | +20-60% |
| Few-shot CoT | Good examples available | +30-70% |
| Self-Consistency | High-stakes, need confidence | +10-20% over CoT |
| Tree of Thoughts | Complex exploration problems | +50-70% |
| Least-to-Most | Multi-step with subproblems | +30-80% |
| ReAct | Tasks needing external info | +15-35% |

**Decision flow:** Start with Zero-shot CoT → if insufficient, add examples (Few-shot) → if high-stakes, add Self-Consistency → if problem decomposes, use Least-to-Most → if exploration needed, use Tree of Thoughts.

See [references/cot-techniques.md](references/cot-techniques.md) for full templates and examples.

### Meta-Prompt Pipelines

For Claude-to-Claude multi-stage workflows (research → plan → implement):

| Purpose | Use For | Output |
|---------|---------|--------|
| **Do** | Execute tasks | Code, files |
| **Plan** | Create approaches | Plan docs |
| **Research** | Gather information | Analysis docs |
| **Refine** | Improve existing outputs | Updated versions |

Each stage outputs structured XML metadata (`<confidence>`, `<dependencies>`, `<open_questions>`) for efficient parsing by subsequent stages. Always create a SUMMARY.md for human scanning.

See [references/meta-prompts/](references/meta-prompts/) for intake workflows, purpose-specific patterns, and execution details.

### Self-Refinement Loop

Iterative improvement through structured self-reflection:

```
Initial Output → Reflection → Feedback → Refined Output → Iterate (2-4 rounds)
```

| Reflection Type | Focus | When to Use |
| --------------- | ----- | ----------- |
| Criteria-based | Checklist evaluation | Known quality standards |
| Comparative | Against examples | Style matching |
| Analytical | Deep reasoning | Complex tasks |
| Factual | Verification accuracy | Claims and data |

**Scoring:** 9-10 = done, 7-8 = minor refinements, 5-6 = targeted improvements, 3-4 = significant revision, 1-2 = restart.

See [references/self-refine/](references/self-refine/) for code reflection criteria, fact-checking guide, and report format.

## References

- **[references/core-capabilities.md](references/core-capabilities.md)** - Detailed examples for few-shot, chain-of-thought, templates, system prompts, RAG integration
- **[references/agent-prompting.md](references/agent-prompting.md)** - Context window management, conciseness principles, degrees of freedom
- **[references/persuasion-principles.md](references/persuasion-principles.md)** - Authority, commitment, scarcity, social proof, unity - research-backed principles for effective agent prompts
- **[references/cot-techniques.md](references/cot-techniques.md)** - Full CoT technique templates with decision matrix (from chain-of-thought-prompting)
- **[references/meta-prompts/](references/meta-prompts/)** - Multi-stage prompt pipeline patterns (from create-meta-prompts)
- **[references/self-refine/](references/self-refine/)** - Self-refinement criteria and report formats (from self-refine)
### Additional Resources


| File | Path |
|------|------|
| [Do Patterns](references/meta-prompts/do-patterns.md) | `references/meta-prompts/do-patterns.md` |
| [Intake Workflow](references/meta-prompts/intake-workflow.md) | `references/meta-prompts/intake-workflow.md` |
| [Intelligence Rules](references/meta-prompts/intelligence-rules.md) | `references/meta-prompts/intelligence-rules.md` |
| [Metadata Guidelines](references/meta-prompts/metadata-guidelines.md) | `references/meta-prompts/metadata-guidelines.md` |
| [Plan Patterns](references/meta-prompts/plan-patterns.md) | `references/meta-prompts/plan-patterns.md` |
| [Question Bank](references/meta-prompts/question-bank.md) | `references/meta-prompts/question-bank.md` |
| [Refine Patterns](references/meta-prompts/refine-patterns.md) | `references/meta-prompts/refine-patterns.md` |
| [Research Patterns](references/meta-prompts/research-patterns.md) | `references/meta-prompts/research-patterns.md` |
| [Research Pitfalls](references/meta-prompts/research-pitfalls.md) | `references/meta-prompts/research-pitfalls.md` |
| [Summary Template](references/meta-prompts/summary-template.md) | `references/meta-prompts/summary-template.md` |
| [Workflow Execution](references/meta-prompts/workflow-execution.md) | `references/meta-prompts/workflow-execution.md` |
| [Code Reflection Criteria](references/self-refine/code-reflection-criteria.md) | `references/self-refine/code-reflection-criteria.md` |
| [Fact Checking Guide](references/self-refine/fact-checking-guide.md) | `references/self-refine/fact-checking-guide.md` |
| [Report Format](references/self-refine/report-format.md) | `references/self-refine/report-format.md` |
