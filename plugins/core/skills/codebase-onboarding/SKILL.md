---
name: codebase-onboarding
description: "Run this when you need to onboard engineers or create handoff docs — analyzes repository structure and produces practical onboarding material."
origin: lamella
---

# Codebase Onboarding

Use this skill to turn a repository scan into a practical onboarding document.
Keep the output grounded in the actual repo state.

## Workflow

1. Scan the repository with `scripts/codebase_analyzer.py`.
2. Verify the setup path against real scripts, config files, and docs.
3. Choose the audience: new engineer, senior engineer, or contractor.
4. Draft the onboarding doc with `references/onboarding-template.md`.
5. Trim anything speculative, stale, or too deep for the audience.

## Output Rules

- Start with what the project does and who should care.
- Keep setup steps executable and time-bounded.
- Include verification steps after setup.
- Call out high-signal files and directories.
- Link to canonical docs instead of duplicating long material.

## Commands

Repository scan:

```bash
python3 scripts/codebase_analyzer.py /path/to/repo
```

Machine-readable output:

```bash
python3 scripts/codebase_analyzer.py /path/to/repo --json
```

## What Good Output Looks Like

- New contributors can get the project running without guessing.
- Senior contributors can spot the main architecture boundaries quickly.
- Contractors can see the safe edges of the codebase and the common tasks.

## References

- `references/onboarding-template.md`
