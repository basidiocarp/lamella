---
name: playwright
description: >-
  Playwright browser automation and E2E testing. Use when automating browsers with playwright-cli, writing E2E tests (.spec.ts),
  fixing flaky tests, testing local web apps, or designing Page Object Models.
---
# Playwright


## Contents

- [playwright-cli Quick Start](#playwright-cli-quick-start)
  - [Core Commands](#core-commands)
  - [Navigation & Keyboard](#navigation-keyboard)
  - [Mouse](#mouse)
  - [Tabs](#tabs)
  - [Screenshots & Export](#screenshots-export)
  - [Storage](#storage)
  - [Network Mocking](#network-mocking)
  - [DevTools](#devtools)
  - [Sessions & Config](#sessions-config)
- [E2E Test Patterns](#e2e-test-patterns)
  - [Page Object Model](#page-object-model)
  - [Config](#config)
  - [Flaky Tests](#flaky-tests)
  - [CI Integration](#ci-integration)
  - [File Organization](#file-organization)
- [Local Web App Testing](#local-web-app-testing)

## Installation

```bash
# Node.js
npm install @playwright/test
npx playwright install

# Python
pip install playwright
playwright install
```

## playwright-cli Quick Start

```bash
playwright-cli open https://example.com
playwright-cli snapshot                    # get page state with element refs
playwright-cli click e15                   # interact via refs from snapshot
playwright-cli type "search query"
playwright-cli fill e5 "user@example.com"
playwright-cli screenshot
playwright-cli close
```

### Core Commands

```bash
playwright-cli open [url]          # open browser (optionally navigate)
playwright-cli goto <url>          # navigate
playwright-cli click <ref>         # click element
playwright-cli dblclick <ref>      # double-click
playwright-cli fill <ref> "value"  # fill input
playwright-cli select <ref> "val"  # select option
playwright-cli hover <ref>         # hover element
playwright-cli drag <ref1> <ref2>  # drag and drop
playwright-cli upload ./file.pdf   # upload file
playwright-cli check <ref>         # check checkbox
playwright-cli uncheck <ref>       # uncheck checkbox
playwright-cli eval "document.title"
playwright-cli snapshot [--filename=name.yaml]
```

### Navigation & Keyboard

```bash
playwright-cli go-back | go-forward | reload
playwright-cli press Enter | ArrowDown | Escape
playwright-cli keydown Shift | keyup Shift
```

### Mouse

```bash
playwright-cli mousemove 150 300
playwright-cli mousedown [right] | mouseup [right]
playwright-cli mousewheel 0 100
```

### Tabs

```bash
playwright-cli tab-list | tab-new [url] | tab-close [index] | tab-select <index>
```

### Screenshots & Export

```bash
playwright-cli screenshot [ref] [--filename=page.png]
playwright-cli pdf --filename=page.pdf
```

### Storage

```bash
playwright-cli state-save [file.json] | state-load <file.json>
playwright-cli cookie-list [--domain=x] | cookie-get <name> | cookie-set <name> <val> | cookie-delete <name> | cookie-clear
playwright-cli localstorage-list | localstorage-get <key> | localstorage-set <key> <val> | localstorage-delete <key> | localstorage-clear
playwright-cli sessionstorage-list | sessionstorage-get <key> | sessionstorage-set <key> <val>
```

### Network Mocking

```bash
playwright-cli route "**/*.jpg" --status=404
playwright-cli route "https://api.example.com/**" --body='{"mock": true}'
playwright-cli route-list | unroute ["pattern"]
```

### DevTools

```bash
playwright-cli console [warning|error]
playwright-cli network
playwright-cli tracing-start | tracing-stop
playwright-cli video-start | video-stop <file.webm>
```

### Sessions & Config

```bash
playwright-cli -s=mysession open example.com --persistent
playwright-cli -s=mysession close
playwright-cli list | close-all | kill-all
playwright-cli open --browser=chrome|firefox|webkit|msedge
playwright-cli open --persistent | --profile=/path | --config=file.json
playwright-cli delete-data
```

After each command, playwright-cli provides a snapshot with element refs. Use `snapshot` on demand. If running globally fails, use `npx playwright-cli`.

See `references/` for detailed guides: request-mocking, running-code, session-management, storage-state, test-generation, tracing, video-recording.

---

## E2E Test Patterns

### Page Object Model

```typescript
import { Page, Locator } from '@playwright/test'

export class ItemsPage {
  readonly page: Page
  readonly searchInput: Locator
// ... (15 lines trimmed)
    await this.page.waitForResponse(resp => resp.url().includes('/api/search'))
  }
}
```

Rules:
- One POM per page/major component
- Locators as readonly properties in constructor
- Methods for user-visible actions, not implementation details
- Use `data-testid` attributes — never CSS classes or tag hierarchies

### Config

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
// ... (24 lines trimmed)
    timeout: 120000,
  },
})
```

### Flaky Tests

Identify: `npx playwright test tests/search.spec.ts --repeat-each=10`

**Race condition** — use locator, not `page.click()`:
```typescript
await page.locator('[data-testid="button"]').click()  // auto-waits
```

**Network timing** — wait for response, not arbitrary sleep:
```typescript
await page.waitForResponse(resp => resp.url().includes('/api/data'))
```

**Animation** — wait for visibility before clicking:
```typescript
await page.locator('[data-testid="menu-item"]').waitFor({ state: 'visible' })
await page.locator('[data-testid="menu-item"]').click()
```

Quarantine with tracking reference:
```typescript
test.fixme(true, 'Flaky — Issue #123')
test.skip(process.env.CI, 'Flaky in CI — Issue #123')
```

### CI Integration

```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
// ... (12 lines trimmed)
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

### File Organization

```
tests/
├── e2e/
│   ├── auth/
│   │   └── login.spec.ts
│   ├── features/
│   │   └── search.spec.ts
│   └── api/
│       └── endpoints.spec.ts
├── fixtures/
│   ├── auth.ts
│   └── data.ts
└── playwright.config.ts
```

Group by feature. `.spec.ts` for Playwright (distinguishes from unit `.test.ts`).

---

## Local Web App Testing

For testing local/dev web apps, write Python Playwright scripts.

**Helper script**: `scripts/with_server.py` manages server lifecycle.

```bash
# Single server
python scripts/with_server.py --server "npm run dev" --port 5173 -- python your_automation.py

# Multiple servers
python scripts/with_server.py \
  --server "cd backend && python server.py" --port 3000 \
  --server "cd frontend && npm run dev" --port 5173 \
  -- python your_automation.py
```

Always run `--help` first. Use scripts as black boxes — don't read source unless necessary.

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto('http://localhost:5173')
    page.wait_for_load_state('networkidle')  # CRITICAL: wait for JS
    # ... automation logic
    browser.close()
```

Reconnaissance-then-action: navigate → wait for networkidle → screenshot/inspect DOM → identify selectors → execute actions. Never inspect DOM before networkidle on dynamic apps.

See `examples/` for patterns: element_discovery.py, static_html_automation.py, console_logging.py.

## Reference Files


| File | Path |
|------|------|
| [Request Mocking](references/request-mocking.md) | `references/request-mocking.md` |
| [Running Code](references/running-code.md) | `references/running-code.md` |
| [Session Management](references/session-management.md) | `references/session-management.md` |
| [Storage State](references/storage-state.md) | `references/storage-state.md` |
| [Test Generation](references/test-generation.md) | `references/test-generation.md` |
| [Tracing](references/tracing.md) | `references/tracing.md` |
| [Video Recording](references/video-recording.md) | `references/video-recording.md` |
