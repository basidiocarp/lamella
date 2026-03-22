# Execution Protocols

> Detailed guidance for Phase 3: Sequential Execution with Judge Verification

## Execution Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Step N                                                                  │
│                                                                         │
│   ┌──────────────┐     ┌──────────────┐     ┌──────────────────────┐   │
│   │ Implementer  │────▶│    Judge     │────▶│ Parse Verdict        │   │
// ... (11 lines trimmed)
│          │                                            │                 │
│          └────────────── feedback ────────────────────┘                 │
└─────────────────────────────────────────────────────────────────────────┘
```

## Context Passing Protocol

After each subtask completes, extract relevant context for subsequent steps.

### What to Pass Forward

- Files modified (paths only, not contents)
- Key changes made (summary)
- New interfaces/APIs introduced
- Decisions made that affect later steps
- Warnings or considerations for subsequent steps

### Context Filtering Rules

- Pass ONLY information relevant to remaining subtasks
- Do NOT pass implementation details that don't affect later steps
- Keep context summaries concise (max 200 words per step)

**Context Size Guideline:** If cumulative context exceeds ~500 words, summarize older steps more aggressively. Sub-agents can read files directly if they need details.

### Context Passing Guidelines Table

| Scenario | What to Pass | What to Omit |
|----------|--------------|--------------|
| Interface defined in step 1 | Full interface definition | Implementation details |
| Implementation in step 2 | Key patterns, file locations | Internal logic |
| Integration in step 3 | Usage patterns, entry points | Step 2 internal details |
| Judge feedback for retry | ISSUES list, report path | Full report contents |

### Example Context Accumulation

```markdown
## Completed Steps Summary

### Step 1: Define UserRepository Interface
- **What was done:** Created `src/repositories/UserRepository.ts` with interface definition
- **Key outputs:**
// ... (11 lines trimmed)
- **Relevant for next steps:**
  - Import repository from `src/repositories/UserRepositoryImpl`
  - Constructor requires `DatabaseConnection` injection
```

---

## Sub-Agent Prompt Construction

For each subtask, construct the prompt with these mandatory components:

### 1. Zero-shot Chain-of-Thought Prefix (REQUIRED - MUST BE FIRST)

```markdown
## Reasoning Approach

Before taking any action, think through this subtask systematically.

Let's approach this step by step:
// ... (19 lines trimmed)
   - Is there a simpler way?

Work through each step explicitly before implementing.
```

### 2. Task Body

```markdown
<task>
{Subtask description}
</task>

<subtask_context>
// ... (27 lines trimmed)
- Any decisions that affect later steps
- Warnings or considerations for subsequent steps
</output>
```

### 3. Self-Critique Suffix (REQUIRED - MUST BE LAST)

```markdown
## Self-Critique Verification (MANDATORY)

Before completing, verify your work integrates properly with previous steps.

### Verification Questions
// ... (40 lines trimmed)
3. **UPDATE** - Update the "Context for Next Steps" section

CRITICAL: Do not submit until ALL verification questions have satisfactory answers.
```

---

## Judge Verification Protocol

After implementation agent completes, dispatch an **independent judge** to verify the step.

**Judge report location:** `.specs/reports/{task-name}-step-{N}-{YYYY-MM-DD}.md`

### Judge Prompt Template

```markdown
You are verifying completion of Step {N}/{total}: {subtask_name}

<original_task>
{overall_task_description}
</original_task>
// ... (50 lines trimmed)
   - FAIL: Score <3.5/5.0 OR critical issues present

CRITICAL: If FAIL, list specific issues that must be fixed for retry.
```

---

## Dispatch, Verify, and Iterate Loop

For each subtask in sequence:

```
1. Dispatch implementation sub-agent:
   Use Task tool:
     - description: "Step {N}/{total}: {subtask_name}"
     - prompt: {constructed prompt with CoT + task + previous context + self-critique}
     - model: {selected model for this subtask}
// ... (33 lines trimmed)
       → Do NOT proceed to next step

6. Proceed to next subtask with accumulated context
```

### Retry Prompt Template

```markdown
## Retry Required: Step {N}/{total}

Your previous implementation did not pass judge verification.

<original_requirements>
// ... (24 lines trimmed)
6. Provide updated "Context for Next Steps" section

CRITICAL: Focus on fixing the specific issues identified. Do not rewrite everything.
```
