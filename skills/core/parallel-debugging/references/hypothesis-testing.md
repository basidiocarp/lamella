# Hypothesis Testing Reference

Templates and decision trees for parallel debugging.

## Hypothesis Task Template

```markdown
## Hypothesis Investigation: {Title}

### Statement
{Clear, falsifiable statement about the root cause}

### Category
{Logic Error | Data Issue | State Problem | Integration Failure | Resource Issue | Environment}

### Scope
- Files: {file list or directory}
- Tests: {test files}
- Git: {relevant commits or date range}

### Evidence Criteria
Confirming: {what would support this}
Falsifying: {what would disprove this}
```

## Evidence Report Template

```markdown
## Report: {Title}

Verdict: {Confirmed | Falsified | Inconclusive}
Confidence: {High | Medium | Low}

### Confirming Evidence
1. `file:line` -- {description}

### Contradicting Evidence
1. `file:line` -- {description}

### Causal Chain (if confirmed)
1. {cause} -> 2. {intermediate} -> 3. {symptom}

### Recommended Fix
{Specific code change with location}
```

## Arbitration Decision Tree

```
All reported?
├── NO -> Wait
└── YES -> Count confirmed
          ├── 0: Any medium confidence? Investigate further. All low/falsified? New hypotheses.
          ├── 1: High confidence? Declare root cause. Low? Flag as likely, verify.
          └── 2+: Related? Compound issue. Unrelated? Rank by confidence.
```

## Common Patterns by Error Type

- 500 error: unhandled exception (logic), DB connection failure (resource), missing env var (environment)
- Intermittent failure: shared state mutation (state), async ordering (logic), cache staleness (state)
- Works locally, fails in prod: env var mismatch (environment), different dependency version (environment), resource limits (resource)
- Regression after deploy: new code bug (logic), config change (integration), migration issue (data)
