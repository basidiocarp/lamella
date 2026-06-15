---
name: dependency-upgrade
description: "Run this when upgrading major dependencies — manages compatibility analysis, staged rollout, testing, and rollback strategies."
origin: lamella
---

# Dependency Upgrade

Manage major version upgrades with staged rollout, compatibility analysis, and rollback plans.

## When to Use

- Upgrading major framework versions
- Updating security-vulnerable dependencies
- Resolving dependency conflicts
- Planning incremental upgrade paths
- Use `security/dependency-auditor` first when you need a wider scan of vulnerability, license, and stale-package risk

## Semver Quick Reference

```
MAJOR.MINOR.PATCH
^2.3.1 = >=2.3.1 <3.0.0  (minor updates)
~2.3.1 = >=2.3.1 <2.4.0  (patch updates)
```

## Dependency Analysis

```bash
# Audit
npm outdated && npm audit
npx npm-check-updates        # Check for major updates

# Dependency tree
npm ls package-name           # Why is this installed?
npm dedupe                    # Remove duplicates
```

## Staged Upgrade Strategy

### Phase 1: Planning

1. Identify current versions: `npm list --depth=0`
2. Read changelogs and migration guides for breaking changes
3. Determine upgrade order (build tools → framework → libraries → test tools)
4. Create feature branch, tag current state for rollback

### Phase 2: Incremental Updates

**One dependency at a time:**
```bash
npm install typescript@latest && npm run test && npm run build
npm install react@18 react-dom@18 && npm run test
# Continue with remaining packages
```

### Phase 3: Validation

- Run full test suite (unit + integration + E2E)
- Check bundle size impact
- Deploy to staging and monitor for runtime errors
- Verify peer dependencies resolve cleanly

## Breaking Change Handling

1. Read changelogs for breaking changes
2. Use codemods when available (`npx jscodeshift -t <transform-url> src/`)
3. Write custom migration scripts for bulk API changes
4. Fix TypeScript errors incrementally

## Lock File Management

```bash
npm ci                        # Clean install from lock file (CI)
npm install --legacy-peer-deps # Ignore peer deps (npm 7+)
npm install --workspaces      # Update all workspace packages
```

## Automated Updates

Configure Renovate or Dependabot to auto-merge minor/patch and flag major updates for review.

## Upgrade Checklist

**Pre-Upgrade:**
- [ ] Read changelogs for breaking changes
- [ ] Create feature branch and tag baseline
- [ ] Run full test suite (baseline)

**During:**
- [ ] One dependency at a time
- [ ] Fix TypeScript/build errors after each upgrade
- [ ] Run tests after each upgrade

**Post-Upgrade:**
- [ ] Full regression testing
- [ ] Performance/bundle size check
- [ ] Deploy to staging, monitor for errors
- [ ] Update documentation

## Common Pitfalls

- Upgrading all dependencies at once
- Skipping major versions (e.g., React 16 → 18 without 17)
- Ignoring peer dependency warnings
- Not having a rollback plan

## References

- [references/code-examples.md](references/code-examples.md) — Compatibility matrix, codemod examples, Renovate/Dependabot configs, migration scripts, rollback script
