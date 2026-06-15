# Storage State

Use this reference when you need to persist or inspect browser state.

## Save and Restore

```bash
playwright-cli state-save auth-state.json
playwright-cli state-load auth-state.json
```

Saved state usually contains cookies plus local and session storage data.

## Cookies

```bash
playwright-cli cookie-list
playwright-cli cookie-get session_id
playwright-cli cookie-set session abc123 --domain=example.com --path=/
playwright-cli cookie-delete session_id
```

## Local and Session Storage

```bash
playwright-cli localstorage-set theme dark
playwright-cli sessionstorage-set step 3
playwright-cli localstorage-list
playwright-cli sessionstorage-list
```

Use `run-code` when you need multi-key or structured state changes in one step.

## Practical Rule

Persist state only when it saves real setup time. If the test or workflow can
re-authenticate cheaply, that is usually easier to reason about than carrying a
stale state file.
