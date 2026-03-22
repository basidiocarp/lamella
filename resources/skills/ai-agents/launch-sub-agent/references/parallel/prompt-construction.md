# Prompt Construction (Phase 4)

Build identical prompt structure for each target, customized only with target-specific details.

## Structure

1. **Zero-shot CoT Prefix** (REQUIRED - MUST BE FIRST)
2. **Task Body** (Customized per target)
3. **Self-Critique Suffix** (REQUIRED - MUST BE LAST)

## 1. Zero-shot Chain-of-Thought Prefix

```markdown
## Reasoning Approach

Let's think step by step.

Before taking any action, think through the problem systematically:
// ... (14 lines trimmed)
   - Is there a simpler approach?

Work through each step explicitly before implementing.
```

## 2. Task Body

```markdown
<task>
{Task description from arguments}
</task>

<target>
// ... (10 lines trimmed)
<output>
{Expected deliverable location and format}
</output>
```

## 3. Self-Critique Suffix

```markdown
## Self-Critique Verification (MANDATORY)

Before completing, verify your work for this target.

### Verification Questions
// ... (23 lines trimmed)
3. **DOCUMENT** - Note what changed

CRITICAL: Do not submit until ALL verification questions pass.
```
