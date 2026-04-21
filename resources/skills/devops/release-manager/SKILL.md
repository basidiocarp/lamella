---
name: release-manager
description: "Plans releases, derives changelogs, recommends semantic version bumps, and checks release readiness."
origin: lamella
---

# Release Manager

Use this skill when the work is larger than "write release notes." It covers the
release mechanics around versioning, readiness, and rollback planning.

## Workflow

1. Determine the release scope and release model.
2. Generate or review the changelog from commit history.
3. Recommend the next version from the commit set.
4. Check release readiness before tagging or deploying.
5. Document the rollback path and any hotfix rules.

## Commands

Generate a changelog from git log output:

```bash
git log --pretty=format:'%h %s' | python3 scripts/changelog_generator.py --version 1.4.0
```

Recommend a semantic version bump:

```bash
git log --pretty=format:'%h %s' | python3 scripts/version_bumper.py --current-version 1.3.2
```

Assess release readiness from a JSON plan:

```bash
python3 scripts/release_readiness.py --input release-plan.json
```

## Rules

- Do not infer a major release unless the commit set contains an explicit breaking change.
- Treat hotfixes as minimal, scoped releases with their own rollback path.
- Pair version changes with changelog changes.
- Do not call a release ready if required approvals or migrations are still unclear.

## References

- `references/conventional-commits.md`
- `references/release-workflow-selection.md`
- `references/hotfix-procedures.md`
