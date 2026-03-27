# Browser Session Management

Use named sessions when browser state must stay isolated across different flows.

## Named Sessions

```bash
playwright-cli -s=auth open https://app.example.com/login
playwright-cli -s=public open https://example.com
playwright-cli -s=auth fill e1 "user@example.com"
playwright-cli -s=public snapshot
```

Each session keeps its own cookies, storage, history, and tabs.

## Useful Commands

```bash
playwright-cli list
playwright-cli -s=auth close
playwright-cli close-all
playwright-cli -s=auth delete-data
```

## Persistent Profiles

Use `--persistent` or `--profile=/path/to/profile` when browser state must live
on disk between runs.

## Practical Rules

- Name sessions by purpose, not by temporary numbering.
- Clean up sessions when the task is done.
- Use separate sessions for authenticated and public flows instead of trying to
  unwind state manually.
