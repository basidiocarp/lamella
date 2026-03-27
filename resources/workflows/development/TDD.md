# Development Workflows

Step-by-step workflows for feature development and bug fixing using TDD.

## Agent Chain

All development workflows use this agent chain:

```
code-fixer → test-runner → browser-tester or e2e-runner (if UI)
```

1. **code-fixer** — Write tests first, then implement to pass them
2. **test-runner** — Run all tests, verify no regressions, check coverage (80%+)
3. **browser-tester** or **e2e-runner** — UI verification when the change
   affects browser flows (skip for pure API or library work)

---

## New Feature

```
claude "Develop [FEATURE] using TDD:

Feature specification:
[Describe the feature requirements]

1. Write failing tests for expected behavior (RED)
2. Implement feature to make tests pass (GREEN)
3. Refactor while keeping tests green (IMPROVE)
4. Verify coverage ≥ 80%
5. Visual check in browser (if UI)"
```

---

## Bug Fix

```
claude "Fix bug using TDD:

Bug: [DESCRIPTION]
Steps to reproduce:
1. [Step 1]
2. [Step 2]
Expected: [What should happen]
Actual: [What happens]

1. Write test that reproduces the bug (should FAIL)
2. Implement minimal fix (test should PASS)
3. Verify no regressions
4. Confirm fix in browser (if UI bug)"
```

---

## TDD Cycle

1. **RED** — Write failing test
2. **GREEN** — Minimal implementation to pass
3. **IMPROVE** — Refactor with confidence

Coverage target: **80%+ minimum** (unit + integration + E2E).

### Test Types

| Type | Covers | When |
|------|--------|------|
| Unit | Functions, utilities, components | Always |
| Integration | API endpoints, DB operations | Always |
| E2E (Playwright) | Critical user flows | UI features |

---

## Best Practices

- Write tests BEFORE code
- One assert per test
- Test error paths, not just happy paths
- Mock external dependencies
- Keep tests fast (< 50ms each for unit)
- Don't refactor unrelated code during bug fixes

---

**See also:** `skills/core/test-driven-development`, `skills/core/systematic-debugging`
