# Coverage, Blast Radius, and History

## Test Coverage

```markdown
## Test Coverage Analysis

**Coverage:** 63% of changed lines

| Function | Risk | Gap |
| --- | --- | --- |
| `withdraw()` | HIGH | missing auth regression test |
| `syncLedger()` | MEDIUM | no retry-path coverage |
```

## Blast Radius

```markdown
## Blast Radius Analysis

| Function | Callers | Risk | Priority |
| --- | ---: | --- | --- |
| `authorizeTransfer()` | 14 | HIGH | P0 |
| `normalizeUser()` | 6 | MEDIUM | P1 |
```

## Historical Context

- call out removed validations, auth checks, or earlier security fixes
- use history to explain regression risk, not to pad the report

```markdown
## Historical Context

- `requireOwner()` removed here; originally added in `def456` after audit issue 45
- same pattern was reverted once before in `abc123`
```
