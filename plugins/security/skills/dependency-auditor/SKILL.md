---
name: dependency-auditor
description: "Audits dependencies for vulnerabilities, licenses, staleness, and upgrades."
origin: lamella
---

# Dependency Auditor

Use this skill when the dependency problem is broader than a single upgrade.
It covers security, licensing, maintenance risk, and upgrade planning in one pass.

## Workflow

1. Scan the project with `scripts/dep_scanner.py`.
2. Review license risk with `scripts/license_checker.py`.
3. Build an upgrade plan with `scripts/upgrade_planner.py`.
4. Separate immediate security fixes from scheduled maintenance work.
5. Hand high-risk dependency takeover concerns to `supply-chain-risk-auditor` when you need a deeper maintainer-risk review.

## Commands

Scan dependency inventory:

```bash
python3 scripts/dep_scanner.py /path/to/project --format json
```

Check licenses:

```bash
python3 scripts/license_checker.py /path/to/project --format text
```

Build an upgrade plan:

```bash
python3 scripts/upgrade_planner.py inventory.json --timeline 90
```

PowerShell equivalents:

```powershell
python scripts\dep_scanner.py C:\path\to\project --format json
python scripts\license_checker.py C:\path\to\project --format text
```

## Rules

- Treat critical vulnerabilities and incompatible licenses as stop-ship issues until proven otherwise.
- Split security response, legal review, and routine freshness work into separate tracks.
- Prefer small, verified upgrade waves over all-at-once version churn.
- Do not assume a dependency is safe because it is popular.
- Document whether a finding is direct, transitive, or dev-only before prioritizing it.

## References

- `references/dependency-management-best-practices.md`
- `references/license-compatibility-matrix.md`
- `references/vulnerability-assessment-guide.md`
