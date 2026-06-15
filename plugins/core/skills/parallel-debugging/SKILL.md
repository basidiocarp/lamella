---
name: parallel-debugging
description: "Run this when debugging a complex issue with multiple plausible causes — uses competing hypotheses methodology to isolate root cause."
origin: lamella
---

# Parallel Debugging

Framework for debugging with the Analysis of Competing Hypotheses (ACH) methodology.

## When to Use

- Bug has multiple plausible root causes
- Initial debugging attempts haven't identified the issue
- Issue spans multiple modules
- Need to avoid confirmation bias

## Hypothesis Generation

Generate hypotheses across 6 failure mode categories:

1. Logic Error -- wrong condition, off-by-one, missing edge case
2. Data Issue -- invalid input, type mismatch, null/undefined, encoding
3. State Problem -- race condition, stale cache, incorrect initialization, mutation
4. Integration Failure -- API contract violation, version mismatch, config error
5. Resource Issue -- memory leak, connection exhaustion, timeout, disk space
6. Environment -- missing dependency, wrong version, platform-specific behavior

## Evidence Standards

| Type            | Strength | Example                                            |
| --------------- | -------- | -------------------------------------------------- |
| Direct          | Strong   | Code at `file.ts:42` shows wrong comparison        |
| Correlational   | Medium   | Error rate increased after commit `abc123`          |
| Absence         | Variable | No null check found in the code path               |

Always cite with file:line references. Rate confidence: High (>80%), Medium (50-80%), Low (<50%).

## Arbitration

After investigators report:

1. Categorize: Confirmed, Plausible, Falsified, Inconclusive
2. Rank confirmed hypotheses by confidence, evidence count, causal chain strength
3. If one dominates: declare root cause. If multiple are equal: compound issue. If none confirmed: generate new hypotheses.
4. Validate fix: addresses root cause, doesn't introduce new issues, reproduction case passes, tests added.

## Reference Files

- [Hypothesis Testing](references/hypothesis-testing.md)
