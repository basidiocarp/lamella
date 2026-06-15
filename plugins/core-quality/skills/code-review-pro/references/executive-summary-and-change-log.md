# Executive Summary and Change Log

## Executive Summary

Include:

- severity table
- overall recommendation: `APPROVE`, `REJECT`, or `CONDITIONAL`
- high-signal metrics such as untested risky changes or large blast radius

```markdown
# Executive Summary

| Severity | Count |
| --- | ---: |
| CRITICAL | 1 |
| HIGH | 2 |
| MEDIUM | 4 |
| LOW | 3 |

**Recommendation:** CONDITIONAL

- Untested high-risk functions: 2
- Large blast-radius changes: 1
- Security regressions: 1
```

## What Changed

Summarize the review surface before findings:

```markdown
## What Changed

**Commit Range:** `base..head`
**Commits:** 4
**Files:** 9

| File | Change | Notes |
| --- | --- | --- |
| `src/auth.ts` | modified | auth check removed |
| `src/routes/payments.ts` | modified | new endpoint |

**Total:** +182 / -64
```
