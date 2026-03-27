# Full Audit Workflow

Comprehensive audit of entire codebase. Run before major releases.

## Agents Used (9 Auditors in Parallel)
1. `code-auditor` - Code quality
2. `bug-auditor` - Runtime defect and vulnerability sweep
3. `doc-auditor` - Documentation gaps
4. `infra-auditor` - Infrastructure config
5. `ui-auditor` - UI/UX and accessibility
6. `database-architect` - Database design and query review
7. `perf-auditor` - Performance issues
8. `dep-auditor` - Dependency health
9. `api-tester` - API validation

Then: `fix-planner` to consolidate findings

## Trigger
- Manual: Before major release
- Scheduled: Weekly health check

## Execution

```
claude "Run full audit workflow:

Phase 1 - Run ALL auditors in parallel:
- code-auditor on src/
- bug-auditor on src/
- doc-auditor on src/
- infra-auditor on config files
- ui-auditor on src/components/
- database-architect on database layer
- perf-auditor on entire app
- dep-auditor on package.json
- api-tester on API routes

Phase 2 - Consolidate:
- Run fix-planner to create FIXES.md from all audits

Save all reports to .claude/audits/"
```

## Agent Chain

```
┌────────────────────────────────────────────────────────────────────┐
│  PHASE 1: PARALLEL AUDIT                                           │
├────────────────────────────────────────────────────────────────────┤
│  code-auditor    bug-auditor                         doc-auditor   │
│  ↓               ↓               ↓                  ↓              │
│  AUDIT_CODE.md   AUDIT_SECURITY                      AUDIT_DOCS.md │
│                  .md                                               │
├────────────────────────────────────────────────────────────────────┤
│  infra-auditor   ui-auditor      database-architect perf-auditor  │
│  ↓               ↓               ↓                  ↓              │
│  AUDIT_INFRA.md  AUDIT_UI_UX.md  AUDIT_DB.md       AUDIT_PERF.md  │
├────────────────────────────────────────────────────────────────────┤
│  dep-auditor                     api-tester                       │
│  ↓               ↓               ↓                                │
│  AUDIT_DEPS.md                   API_TEST_REPORT.md               │
└────────────────────────────────────────────────────────────────────┘
                                ↓
┌────────────────────────────────────────────────────────────────────┐
│  PHASE 2: CONSOLIDATION                                            │
│  fix-planner reads all AUDIT_*.md files                           │
│  ↓                                                                 │
│  FIXES.md (prioritized action items)                              │
└────────────────────────────────────────────────────────────────────┘
```

## Expected Output

```
.claude/audits/
├── AUDIT_CODE.md
├── AUDIT_SECURITY.md
├── AUDIT_DOCS.md
├── AUDIT_INFRA.md
├── AUDIT_UI_UX.md
├── AUDIT_DB.md
├── AUDIT_PERF.md
├── AUDIT_DEPS.md
├── API_TEST_REPORT.md
└── FIXES.md          ← Consolidated action items
```

## FIXES.md Format

```markdown
# Consolidated Fix Plan

## Summary
| Priority | Count | Effort |
|----------|-------|--------|
| P1 (Critical) | 3 | 4h |
| P2 (High) | 8 | 12h |
| P3 (Medium) | 15 | 20h |
| P4 (Low) | 10 | - |

## P1 - Critical (Fix Immediately)

### 1. SQL Injection in User Search
- **Source:** AUDIT_SECURITY_DEEP.md
- **File:** `src/api/users.ts:47`
- **Effort:** XS (30min)

### 2. N+1 Query on Dashboard
- **Source:** AUDIT_DB.md
- **File:** `src/pages/dashboard.tsx:23`
- **Effort:** S (1h)

## P2 - High (Fix Before Release)
...
```

## Time Estimate

- **9 auditors in parallel:** ~2-5 minutes
- **fix-planner consolidation:** ~1-2 minutes
- **Total:** ~5-7 minutes

## Post-Audit Actions

1. **Review FIXES.md** - Prioritize based on your timeline
2. **Run code-fixer** - Implement P1 fixes
3. **Run test-runner** - Verify fixes work
4. **Re-audit** - Run affected auditors again
