# Debugging

## 3-Strike Escalation

If the same fix fails 3 times, stop fixing and start questioning.

```
Strike 1: Fix at current level (maybe a simple mistake)
Strike 2: Try alternative approach (maybe wrong method)
Strike 3: Escalate — question the design (maybe wrong approach entirely)
```

Three levels of abstraction:

| Level | Focus | Example Question |
|-------|-------|-----------------|
| Implementation (HOW) | Syntax, runtime errors, API misuse | "Is this the right API call?" |
| Design (WHAT) | Patterns, data model, abstractions | "Is this pattern appropriate here?" |
| Requirements (WHY) | Domain rules, business constraints | "Are the requirements understood correctly?" |

Escalation path: Implementation → Design → Requirements. Each failed level means the problem lives higher up.

### When to Escalate Early

Skip straight to Design or Requirements when:
- Each fix reveals a new problem in a different place
- The fix requires "massive refactoring" to implement
- The user says "I've tried everything"
- The problem is clearly architectural

### When NOT to Escalate

Typos, missing imports, syntax errors, copy-paste mistakes. These are bugs, not design problems. Fix them and move on.

### After Escalating

1. Document what you tried (all 3 strikes)
2. Ask the escalation question for the next level
3. Reset the strike counter once you have a new approach
4. Trace back down with the new understanding

## Root Cause First

No fixes without root cause investigation. Read the error message completely, reproduce consistently, check recent changes, trace data flow. Symptom fixes are failure.

See the `systematic-debugging` skill for the full 4-phase process.
