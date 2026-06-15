# Agent Execution Patterns

Use this reference when designing the execution loop for an agent-native app.

## Completion Signals

Give the agent an explicit completion tool. Do not infer completion from
timeouts, missing tool calls, or file heuristics.

```typescript
tool("complete_task", {
  summary: z.string(),
  status: z.enum(["success", "partial", "blocked"]).default("success"),
}, async ({ summary, status }) => ({
  text: `${status}: ${summary}`,
  shouldContinue: false,
}));
```

Key rule: success and continuation are separate concepts. A tool can fail and
still allow the loop to continue, or succeed and explicitly stop the loop.

## Partial Completion

Track subtask state so interrupted work can resume cleanly:

- pending
- in progress
- completed
- failed

Persist only the session summary, task list, and durable paths you need to
restore work. Large artifacts should remain in files, not in the checkpoint
blob.

## Model Tiers

- fast: simple transforms or high-volume classification
- balanced: most tool loops and normal synthesis
- powerful: complex synthesis, ranking, or multimodal reasoning

Default to the cheapest tier that still achieves the product outcome. Save
intermediate artifacts so expensive steps are not repeated after interruption.

## Context Limits

Design tools for iterative retrieval rather than full dumps:

- previews before full file reads
- summary or match modes before raw content
- explicit consolidation tools or summaries for long sessions

Important context should live in one of three places:

1. the system prompt
2. durable files the agent can re-read
3. concise session summaries or `context.md`

## Operational Checklist

- Does the agent have an explicit stop signal?
- Can a partially completed task resume without replaying the entire session?
- Is model selection tied to task complexity rather than guesswork?
- Will the loop still work when older turns are truncated?
