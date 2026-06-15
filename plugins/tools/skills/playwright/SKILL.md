---
name: playwright
description: "Automates browsers and Playwright end-to-end tests."
origin: lamella
---
# Playwright

Use this skill when automating browsers or building Playwright test coverage. Keep the main skill focused on command surface, session handling, and escalation to deeper references.

## When to Use

- driving a browser with `playwright-cli`
- writing or debugging Playwright tests
- managing storage state, request mocking, traces, or videos
- testing local applications that need interactive browser control

## Core Workflow

1. decide whether the task is ad hoc browser automation or test authoring
2. start a session and inspect the page state before acting
3. use stable refs or locators instead of brittle selectors
4. capture traces, video, or storage only when they help debug or reproduce
5. move to the focused references once the task becomes specialized

## Quick Commands

```shell
playwright-cli open https://example.com
playwright-cli snapshot
playwright-cli click e15
playwright-cli screenshot
npx playwright test
```

```powershell
playwright-cli open https://example.com
playwright-cli snapshot
playwright-cli click e15
playwright-cli screenshot
npx playwright test
```

## References

- [references/request-mocking.md](references/request-mocking.md)
- [references/running-code.md](references/running-code.md)
- [references/session-management.md](references/session-management.md)
- [references/storage-state.md](references/storage-state.md)
- [references/test-generation.md](references/test-generation.md)
- [references/tracing.md](references/tracing.md)
- [references/video-recording.md](references/video-recording.md)
