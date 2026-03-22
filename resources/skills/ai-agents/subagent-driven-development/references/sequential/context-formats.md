# Context Format Reference

> Output formats for implementation agents and judges

## Implementation Agent Output Format

```markdown
## Context for Next Steps

### Files Modified
- `src/dto/UserDTO.ts` (new file)
- `src/services/UserService.ts` (modified)
// ... (15 lines trimmed)
- TypeScript compiles without errors
- UserDTO.fromUser() correctly maps all User properties
- Existing service tests still pass
```

## Judge Verdict Format (PASS)

```markdown
---
VERDICT: PASS
SCORE: 4.2/5.0
ISSUES:
  - None
// ... (15 lines trimmed)

### Quality (15%) - Score: 4.0/5.0
[Evidence and analysis...]
```

## Judge Verdict Format (FAIL)

```markdown
---
VERDICT: FAIL
SCORE: 2.8/5.0
ISSUES:
  - Missing User->UserDTO mapping logic in getUser() method
  - Return type annotation changed but actual return value still returns User object
  - No null handling for optional User fields
IMPROVEMENTS:
  - Add static fromUser() factory method to UserDTO
  - Implement toDTO() as instance method on User class
---
```

## Final Summary Report Format

```markdown
## Sequential Execution Summary

**Overall Task:** {original task description}
**Total Steps:** {count}
**Total Agents:** {implementation_agents + judge_agents}
// ... (30 lines trimmed)

### Follow-up Recommendations
{Any improvements suggested by judges, tests to run, or manual verification needed}
```

## Quality Assurance Checklist

- **Two-layer verification:** Self-critique (internal) + Judge (external)
- **Self-critique first:** Implementation agents verify own work before submission
- **External judge second:** Independent judge catches blind spots self-critique misses
- **Iteration loop:** Retry with feedback until passing or max retries
- **Chain validation:** Judges check integration with previous steps
- **Escalation:** Don't proceed past failed steps - get user input
- **Final integration test:** After all steps, verify the complete change works together
