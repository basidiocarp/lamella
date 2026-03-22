# Error Handling

> Error handling protocols and escalation procedures

## Judge Verification Failure Loop

The judge-verified iteration loop handles most failures automatically:

```
Judge FAIL (Retry Available):
  1. Parse ISSUES from judge verdict
  2. Dispatch retry implementation agent with feedback
  3. Re-verify with judge
  4. Repeat until PASS or max retries (2)
```

## Step Failure After Max Retries

When a step fails judge verification twice:

1. **STOP** - Do not proceed with broken foundation
2. **Report** - Provide failure analysis:
   - Original step requirements
   - All judge verdicts and scores
   - Persistent issues across retries
3. **Escalate** - Present options to user:
   - Provide additional context/guidance for retry
   - Modify step requirements
   - Skip step (if optional)
   - Abort and report partial progress
4. **Wait** - Do NOT proceed without user decision

### Escalation Report Format

```markdown
## Step {N} Failed Verification (Max Retries Exceeded)

### Step Requirements
{subtask_description}

// ... (19 lines trimmed)
4. **Abort** - Stop execution and preserve partial progress

Awaiting your decision...
```

## Never Do These After Failure

- Continue past a failed step after max retries
- Skip judge verification to "save time"
- Ignore persistent issues across retries
- Make assumptions about what might have worked

## Missing Context Handling

1. **Do NOT guess** what previous steps produced
2. **Re-examine** previous step output for missing information
3. **Check judge reports** - they may have noted missing elements
4. **Dispatch clarification sub-agent** if needed to extract missing context
5. **Update context passing** for future similar tasks

## Step Conflict Resolution

1. **Stop execution** at conflict point
2. **Analyze:** Was decomposition incorrect? Are steps actually dependent?
3. **Check judge feedback** - judges may have flagged integration issues
4. **Options:**
   - Re-order steps if dependency was missed
   - Combine conflicting steps into one
   - Add reconciliation step between conflicting steps
