# Prompt Construction

Use this reference when assembling the implementer prompt for a sequential subtask.

## Required Shape

1. A short reasoning or verification preface
2. The exact subtask body
3. Prior-step context that is still relevant
4. Expected output format
5. A self-check section before completion

## Example

```markdown
## Reasoning Approach
Before taking action, confirm what this subtask must change and what must remain stable.

<task>
Implement step 2: add the repository implementation.
</task>

<subtask_context>
- Step 1 created `UserRepository`
- Constructor must accept `DatabaseConnection`
</subtask_context>

<output>
- Files changed
- Summary of implementation
- Context for next steps
</output>
```
