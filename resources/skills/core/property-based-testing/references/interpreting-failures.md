# Interpreting Property-Based Test Failures

How to analyze failures and determine if they represent genuine bugs.

## Failure Analysis Workflow

1. reproduce with the shrunk example
2. ground the property in docs, types, or existing tests
3. check whether the strategy generates realistic inputs
4. classify the failure
5. choose action

## Classification Guide

| Symptom | Likely Cause | Action |
|---------|--------------|--------|
| Fails on undocumented edge case | Ambiguous specification | Clarify before filing bug |
| Fails outside documented preconditions | Strategy bug | Fix the strategy |
| Property contradicts docs | Wrong property | Fix the property |
| Violates documented guarantee | Genuine bug | Report with evidence |

## Bug Report Template

```markdown
## Summary
[One-line description]

## Minimal Reproducer
```python
from mylib import affected_function

def test_bug():
    result = affected_function("\x00")
    assert result >= 0
```

## Expected Behavior
- [Guarantee from docs or language contract]

## Actual Behavior
- [What happened instead]

## Why This Is a Real Bug
- [Why the input is valid]
- [Why the property is correctly grounded]

## Environment
- Library version: X.Y.Z
- Runtime version: X.Y
- Platform: [OS]
```

## Common Patterns

- numerical instability
- iterator off-by-one
- hash or equality inconsistency
- roundtrip failures on edge cases
