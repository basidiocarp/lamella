---
name: tech-debt-tracker
description: "Run this when assessing codebase health — scans for technical debt, prioritizes fixes, and tracks trends for backlog planning."
origin: lamella
---

# Tech Debt Tracker

Use this skill when "the codebase needs cleanup" is too vague to act on.
It turns debt signals into a backlog, then shows which fixes are worth doing first.

## Workflow

1. Scan the repository with `scripts/debt_scanner.py`.
2. Remove false positives and merge duplicate findings.
3. Prioritize the cleaned inventory with `scripts/debt_prioritizer.py`.
4. Use `scripts/debt_dashboard.py` when you have multiple scans over time.
5. Turn only the top debt items into real tickets or plan slices.

## Commands

Scan a repository:

```bash
python3 scripts/debt_scanner.py /path/to/repo --output debt-scan.json
```

Prioritize a debt inventory:

```bash
python3 scripts/debt_prioritizer.py debt-scan.json --framework wsjf --output debt-backlog.json
```

Analyze debt trends across snapshots:

```bash
python3 scripts/debt_dashboard.py --input-dir ./debt-scans --output debt-dashboard.json
```

PowerShell uses the same scripts with `python`:

```powershell
python scripts/debt_scanner.py C:\path\to\repo --output debt-scan.json
```

## Rules

- Treat the first scan as a draft inventory, not a final backlog.
- Prioritize debt by user impact, delivery risk, and maintenance drag, not aesthetics.
- Prefer small, repeated paydown over one giant "cleanup sprint" unless the system is blocked.
- Pair architecture-heavy debt with a migration plan before assigning delivery dates.
- Use trend data to justify debt work with stakeholders instead of arguing from instinct.

## References

- `references/debt-frameworks.md`
- `references/prioritization-framework.md`
