---
name: e2e-testing
description: Provides Playwright end-to-end testing patterns, Page Object Models, configuration guidance, artifact management, and flaky test strategies. Use when writing Playwright tests, debugging flaky tests, setting up Page Object Models, or configuring CI/CD pipelines.
---

# E2E Testing Patterns


## Contents

- [Test File Organization](#test-file-organization)
- [Page Object Model (POM)](#page-object-model-pom)
- [Test Structure](#test-structure)
- [Playwright Configuration](#playwright-configuration)
- [Flaky Test Patterns](#flaky-test-patterns)
  - [Quarantine](#quarantine)
  - [Identify Flakiness](#identify-flakiness)
  - [Common Causes & Fixes](#common-causes-fixes)
- [Artifact Management](#artifact-management)
  - [Screenshots](#screenshots)
  - [Traces](#traces)
  - [Video](#video)
- [CI/CD Integration](#cicd-integration)
- [Test Report Template](#test-report-template)
- [Summary](#summary)
- [Failed Tests](#failed-tests)
  - [test-name](#test-name)
- [Artifacts](#artifacts)
- [Wallet / Web3 Testing](#wallet-web3-testing)
- [Financial / Critical Flow Testing](#financial-critical-flow-testing)


Build Playwright test suites that stay stable, fast, and maintainable.

## Test File Organization

```
tests/
├── e2e/
│   ├── auth/
│   │   ├── login.spec.ts
│   │   ├── logout.spec.ts
// ... (8 lines trimmed)
│   ├── auth.ts
│   └── data.ts
└── playwright.config.ts
```

## Page Object Model (POM)

```typescript
import { Page, Locator } from '@playwright/test'

export class ItemsPage {
  readonly page: Page
  readonly searchInput: Locator
// ... (22 lines trimmed)
    return await this.itemCards.count()
  }
}
```

## Test Structure

```typescript
import { test, expect } from '@playwright/test'
import { ItemsPage } from '../../pages/ItemsPage'

test.describe('Item Search', () => {
  let itemsPage: ItemsPage
// ... (20 lines trimmed)
    expect(await itemsPage.getItemCount()).toBe(0)
  })
})
```

## Playwright Configuration

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
// ... (26 lines trimmed)
    timeout: 120000,
  },
})
```

## Flaky Test Patterns

### Quarantine

```typescript
test('flaky: complex search', async ({ page }) => {
  test.fixme(true, 'Flaky - Issue #123')
  // test code...
})

test('conditional skip', async ({ page }) => {
  test.skip(process.env.CI, 'Flaky in CI - Issue #123')
  // test code...
})
```

### Identify Flakiness

```bash
npx playwright test tests/search.spec.ts --repeat-each=10
npx playwright test tests/search.spec.ts --retries=3
```

### Common Causes & Fixes

**Race conditions:**
```typescript
// Bad: assumes element is ready
await page.click('[data-testid="button"]')

// Good: auto-wait locator
await page.locator('[data-testid="button"]').click()
```

**Network timing:**
```typescript
// Bad: arbitrary timeout
await page.waitForTimeout(5000)

// Good: wait for specific condition
await page.waitForResponse(resp => resp.url().includes('/api/data'))
```

**Animation timing:**
```typescript
// Bad: click during animation
await page.click('[data-testid="menu-item"]')

// Good: wait for stability
await page.locator('[data-testid="menu-item"]').waitFor({ state: 'visible' })
await page.waitForLoadState('networkidle')
await page.locator('[data-testid="menu-item"]').click()
```

## Artifact Management

### Screenshots

```typescript
await page.screenshot({ path: 'artifacts/after-login.png' })
await page.screenshot({ path: 'artifacts/full-page.png', fullPage: true })
await page.locator('[data-testid="chart"]').screenshot({ path: 'artifacts/chart.png' })
```

### Traces

```typescript
await browser.startTracing(page, {
  path: 'artifacts/trace.json',
  screenshots: true,
  snapshots: true,
})
// ... test actions ...
await browser.stopTracing()
```

### Video

```typescript
// In playwright.config.ts
use: {
  video: 'retain-on-failure',
  videosPath: 'artifacts/videos/'
}
```

## CI/CD Integration

```yaml
# .github/workflows/e2e.yml
name: E2E Tests
on: [push, pull_request]

jobs:
// ... (15 lines trimmed)
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

## Test Report Template

```markdown
# E2E Test Report

**Date:** YYYY-MM-DD HH:MM
**Duration:** Xm Ys
**Status:** PASSING / FAILING
// ... (14 lines trimmed)
- Screenshots: artifacts/*.png
- Videos: artifacts/videos/*.webm
- Traces: artifacts/*.zip
```

## Specialized Testing Modes

For role-based, page-level, and flow-based testing patterns, load the appropriate reference:

| Mode | Reference | Load When |
|------|-----------|-----------|
| Flow Testing | `references/flow-patterns.md` | Testing complete user journeys (registration, checkout, CRUD) |
| Page Testing | `references/page-testing.md` | Systematically testing all pages for errors and rendering |
| Role Testing | `references/role-testing.md` | Testing role-based access control and permissions |
