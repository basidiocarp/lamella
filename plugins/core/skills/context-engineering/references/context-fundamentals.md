# Context Fundamentals

Context is the total state available to a model at inference time: instructions, tools, retrieved documents, history, and observations.

## The Anatomy of Context

- system prompts
- tool definitions
- retrieved documents
- message history
- tool outputs

## Core Principles

1. Context is finite.
2. High-signal context beats exhaustive context.
3. Progressive disclosure keeps agents faster and more reliable.
4. Tool outputs are often the biggest hidden context cost.

## Practical Guidance

- preload only stable, high-value instructions
- keep reference material on disk and load it on demand
- place critical information near attention-favored positions
- compact or reset long sessions before quality degrades badly

## Example: Organized System Prompt

```markdown
<BACKGROUND_INFORMATION>
You are a Python expert helping a development team.
Current project: data pipeline in Python 3.9+.
</BACKGROUND_INFORMATION>

<INSTRUCTIONS>
Use direct language.
Prefer actionable guidance.
</INSTRUCTIONS>

<OUTPUT_DESCRIPTION>
Provide specific recommendations with line references where possible.
</OUTPUT_DESCRIPTION>
```
