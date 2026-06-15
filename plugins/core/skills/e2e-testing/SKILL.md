---
name: e2e-testing
description: "Run this when building or reviewing Playwright tests — guides test structure, page models, and flake reduction strategies."
origin: lamella
---

# E2E Testing Patterns

Use this skill when building or reviewing Playwright-based end-to-end tests. Keep the main skill focused on test structure, flake control, and artifact strategy; use the references for role-, page-, and flow-specific patterns.

## When to Use

- Writing Playwright tests for user journeys
- Organizing a test suite into flows, pages, or roles
- Debugging flaky tests or poor CI signal
- Deciding what screenshots, traces, or videos to retain

## Core Rules

1. Prefer explicit user journeys over broad brittle mega-tests.
2. Use locators and observable conditions instead of fixed waits.
3. Keep page objects thin and behavior-oriented.
4. Capture artifacts on failure, not by default for every passing run.

## Core Workflow

1. Choose the test mode: flow, page, or role.
2. Define stable fixtures and selectors.
3. Add assertions at behavior boundaries rather than every click.
4. Reproduce flakiness with repeat runs before changing retries.
5. Tighten CI artifact retention and quarantine only as a temporary measure.

## Quick Commands

```shell
npx playwright test
npx playwright test tests/search.spec.ts --repeat-each=10
npx playwright test --trace on
```

```powershell
npx playwright test
npx playwright test tests/search.spec.ts --repeat-each=10
npx playwright test --trace on
```

## References

- [references/flow-patterns.md](references/flow-patterns.md)
- [references/page-testing.md](references/page-testing.md)
- [references/role-testing.md](references/role-testing.md)
