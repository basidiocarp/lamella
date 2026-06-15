# Verification Workflow

Comprehensive verification system for code changes. Covers pre-commit, pre-PR, and pre-deploy gates.

## When to Use

| Trigger | Scope |
|---------|-------|
| Before committing | Staged files only (quick) |
| After completing a feature | Full verification |
| Before creating a PR | Full verification |
| Before deploying | Full + deploy checks |

---

## Core Verification Phases

### Phase 1: Build
```bash
npm run build 2>&1 | tail -20
```
If build fails, STOP and fix before continuing.

### Phase 2: Type Check
```bash
# TypeScript
npx tsc --noEmit 2>&1 | head -30

# Python
pyright . 2>&1 | head -30
```

### Phase 3: Lint
```bash
# JavaScript/TypeScript
npm run lint 2>&1 | head -30

# Python
ruff check . 2>&1 | head -30
```

### Phase 4: Test Suite
```bash
npm run test -- --coverage 2>&1 | tail -50
# Target: 80% minimum coverage
```

### Phase 5: Security Scan
```bash
# Secrets check
grep -rn "sk-\|api_key\|secret" --include="*.ts" --include="*.js" . 2>/dev/null | head -10

# Debug code check
grep -rn "console.log" --include="*.ts" --include="*.tsx" src/ 2>/dev/null | head -10

# Dependency audit
npm audit --production
```

### Phase 6: Diff Review
```bash
git diff --stat
git diff HEAD~1 --name-only
```

Review each changed file for unintended changes, missing error handling, edge cases.

---

## Pre-Commit Gate

For quick pre-commit checks, use agents:

**Agents:** `code-auditor` → `test-runner` → Decision

Focus on staged files only:
- No new `any` types
- No empty catch blocks
- No console.logs in production code
- All tests pass

### Git Hook Integration

```bash
#!/bin/bash
# .git/hooks/pre-commit
echo "Running pre-commit checks..."
npx tsc --noEmit && npx lint-staged && npm test
```

---

## Pre-Deploy Gate

Run all core phases PLUS deployment-specific checks in parallel:

**Agents (parallel):** `deploy-checker` + `infra-auditor` + `dep-auditor`

Additional checks:
- All required env vars set
- No secrets in code
- Production config valid
- No critical/high vulnerabilities
- Bundle size acceptable

### Rollback Plan
1. **Vercel/Netlify:** Instant rollback in dashboard
2. **Manual:** `git revert HEAD && git push`
3. **Database:** Have migration rollback ready

---

## Output Format

```
VERIFICATION REPORT
==================

Build:     [PASS/FAIL]
Types:     [PASS/FAIL] (X errors)
Lint:      [PASS/FAIL] (X warnings)
Tests:     [PASS/FAIL] (X/Y passed, Z% coverage)
Security:  [PASS/FAIL] (X issues)
Diff:      [X files changed]

Overall:   [READY/NOT READY]

Issues to Fix:
1. ...
```

---

## Continuous Mode

For long sessions, run verification every 15 minutes or after major changes:
- After completing each function
- After finishing a component
- Before moving to the next task
