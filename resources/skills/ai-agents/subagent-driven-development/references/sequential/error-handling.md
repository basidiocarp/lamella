# Error Handling

> Error handling protocols and escalation procedures

## Judge Verification Failure Loop

The judge-verified iteration loop handles most failures automatically:

```text
Judge FAIL (Retry Available):
  1. Parse ISSUES from judge verdict
  2. Dispatch retry implementation agent with feedback
  3. Re-verify with judge
  4. Repeat until PASS or max retries (2)
```

## Step Failure After Max Retries

When a step fails judge verification twice:

1. **STOP** - Do not proceed with a broken foundation.
2. **Report** - Provide failure analysis:
   - original step requirements
   - all judge verdicts and scores
   - persistent issues across retries
3. **Escalate** - Present options to the user:
   - provide additional context for retry
   - modify step requirements
   - skip the step if it is optional
   - abort and report partial progress
4. **Wait** - Do not proceed without a user decision.

### Escalation Report Format

```markdown
## Step {N} Failed Verification (Max Retries Exceeded)

### Step Requirements
{subtask_description}

### Judge History
1. Attempt 1: {score} — {top issues}
2. Attempt 2: {score} — {top issues}

### Persistent Problems
- {issue 1}
- {issue 2}

### Available Options
1. **Retry with more context**
2. **Modify the step**
3. **Skip if optional**
4. **Abort** and preserve partial progress

Awaiting your decision...
```

## Never Do These After Failure

- continue past a failed step after max retries
- skip judge verification to save time
- ignore persistent issues across retries
- assume a later step will repair the broken foundation

## Missing Context Handling

1. Do not guess what previous steps produced.
2. Re-examine previous step output for missing information.
3. Check judge reports for omitted requirements.
4. Dispatch a clarification sub-agent if needed.
5. Update the context handoff for future similar runs.

## Step Conflict Resolution

1. Stop execution at the conflict point.
2. Decide whether decomposition was wrong or the dependency was missed.
3. Check judge feedback for integration issues.
4. Choose one of:
   - re-order the steps
   - combine conflicting steps
   - add a reconciliation step
