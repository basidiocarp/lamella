---
name: test-driven-development
description: "Activate when starting feature work — enforces TDD by requiring failing tests before implementation begins."
origin: lamella
---

# Test-Driven Development (TDD)

## Contents

- [Overview](#overview)
- [When to Use](#when-to-use)
- [The Iron Law](#the-iron-law)
- [Red-Green-Refactor](#red-green-refactor)
- [Good Tests](#good-tests)
- [Verification Checklist](#verification-checklist)
- [Final Rule](#final-rule)
- [References](#references)

## Overview

Write the test first. Watch it fail. Write minimal code to pass.

**Core principle:** If you didn't watch the test fail, you don't know if it tests the right thing.

## When to Use

**Always:** New features, bug fixes, refactoring, behavior changes

**Exceptions (ask your human partner):** Throwaway prototypes, generated code, configuration files

Thinking "skip TDD just this once"? Stop. That's rationalization.

## The Iron Law

```
NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST
```

Write code before the test? Delete it. Start over. No exceptions.

## Red-Green-Refactor

```
RED → Verify RED → GREEN → Verify GREEN → REFACTOR → Repeat
```

### RED - Write Failing Test

Write one minimal test showing what should happen:
- One behavior per test
- Clear descriptive name
- Real code (no mocks unless unavoidable)

### Verify RED - Watch It Fail

**MANDATORY. Never skip.** Run test, confirm it fails for the expected reason (feature missing, not typos).

### GREEN - Minimal Code

Write simplest code to pass the test. Don't add features beyond the test.

### Verify GREEN - Watch It Pass

**MANDATORY.** Confirm test passes and other tests still pass.

### REFACTOR - Clean Up

After green only: Remove duplication, improve names, extract helpers. Keep tests green.

→ See [examples.md](references/examples.md) for code examples

## Good Tests

| Quality | Good | Bad |
|---------|------|-----|
| **Minimal** | One thing. "and" in name? Split. | `test('validates email and domain')` |
| **Clear** | Name describes behavior | `test('test1')` |
| **Shows intent** | Demonstrates desired API | Obscures what code should do |

## Verification Checklist

Before marking work complete:

- [ ] Every new function/method has a test
- [ ] Watched each test fail before implementing
- [ ] Each test failed for expected reason
- [ ] Wrote minimal code to pass each test
- [ ] All tests pass
- [ ] Output pristine (no errors, warnings)
- [ ] Tests use real code (mocks only if unavoidable)
- [ ] Edge cases and errors covered

Can't check all boxes? You skipped TDD. Start over.

## When Stuck

| Problem | Solution |
|---------|----------|
| Don't know how to test | Write wished-for API. Write assertion first. |
| Test too complicated | Design too complicated. Simplify interface. |
| Must mock everything | Code too coupled. Use dependency injection. |
| Test setup huge | Extract helpers. Still complex? Simplify design. |

## Final Rule

```
Production code → test exists and failed first
Otherwise → not TDD
```

No exceptions without your human partner's permission.

---

## References

| File | Content |
|------|---------|
| [examples.md](references/examples.md) | Code examples: RED/GREEN phases, bug fix walkthrough |
| [rationale.md](references/rationale.md) | Why TDD order matters, common rationalizations, red flags |
| [anti-patterns.md](references/anti-patterns.md) | Testing anti-patterns: mock behavior, test-only methods, incomplete mocks |
| [troubleshooting.md](references/troubleshooting.md) | Debugging integration, verification commands |
