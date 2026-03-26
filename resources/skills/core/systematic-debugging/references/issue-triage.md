# Issue Triage After Root Cause Analysis

Use this reference when the user wants the debugging work turned into an issue,
ticket, or handoff document.

## When to use it

Use this after Phase 1 through Phase 3 of the debugging process are complete.
Do not write the fix plan first and hope the analysis catches up later.

## What to capture

Write the issue in behavior language that will still make sense after the code
layout changes.

Capture:

- Actual behavior
- Expected behavior
- Reliable reproduction steps, if known
- Root cause summary
- The minimal fix direction
- The tests needed to prove the fix

Avoid:

- File paths
- Line numbers
- Diff-shaped instructions
- Internal implementation trivia that will rot quickly

## TDD fix plan format

Break the implementation into RED/GREEN steps:

1. **RED**: Add the smallest failing test that captures the broken behavior.
2. **GREEN**: Make the smallest behavior-level change that passes that test.
3. Repeat until the bug is covered end to end.
4. **REFACTOR**: Clean up only after the behavior is stable.

Each step should preserve a working system. If a step requires multiple risky
changes at once, split it again.

## Template

```markdown
## Problem

- Actual behavior: ...
- Expected behavior: ...
- Reproduction: ...

## Root Cause Analysis

- Failing path: ...
- Why it fails: ...
- Contributing factors: ...

## TDD Fix Plan

1. **RED**: ...
   **GREEN**: ...

2. **RED**: ...
   **GREEN**: ...

## Acceptance Criteria

- [ ] Broken behavior is covered by a failing test first
- [ ] Fix is implemented through the public behavior
- [ ] New tests pass
- [ ] Existing tests still pass
```

## Rule of thumb

The issue should read like a durable engineering note, not a snapshot of
today's file tree.
