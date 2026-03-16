---
name: dep-auditor
description: Dependency auditor. Outdated packages, vulnerabilities, licenses, unused deps.
tools: Read, Grep, Glob, Bash
model: inherit
---

# Dependency Audit

Analyze project dependencies for security, maintenance, and bloat. Output to `.claude/audits/AUDIT_DEPS.md`.

## Check

**Security**
- Known vulnerabilities (CVEs)
- Packages with no maintenance
- Packages with known malicious versions
- Transitive dependency risks

**Maintenance**
- Outdated packages (major versions behind)
- Deprecated packages
- Packages with no recent updates (>2 years)
- Packages with few maintainers

**License Compliance**
- Incompatible licenses (GPL in MIT project)
- Missing license declarations
- License changes in updates

**Bundle Impact**
- Large dependencies (>500KB)
- Duplicate dependencies
- Dependencies with many transitive deps
- Dev dependencies in production bundle

**Unused Dependencies**
- Installed but never imported
- Only used in dead code
- Redundant (multiple packages doing same thing)

## Commands

```bash
# Security vulnerabilities
npm audit --json 2>/dev/null | head -100

# Outdated packages
npm outdated --json 2>/dev/null

# Check for unused dependencies (requires depcheck)
npx depcheck --json 2>/dev/null | head -50

# Package sizes
du -sh node_modules/* 2>/dev/null | sort -rh | head -20

# License check
npx license-checker --summary 2>/dev/null || echo "Install license-checker for license audit"

# Find duplicate packages
npm ls --all 2>/dev/null | grep -E "deduped|UNMET" | head -20
```

## Output

```markdown
# Dependency Audit

## Summary
| Category | Critical | High | Medium | Low |
|----------|----------|------|--------|-----|
# ... (80 lines trimmed)
1. Replace moment with date-fns
2. Use lodash-es with tree shaking
3. Lazy load heavy dependencies
```

Focus on actionable findings. Include specific commands to fix issues.
