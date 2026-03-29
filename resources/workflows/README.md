# Workflows

Structured workflows for development activities.

Lamella keeps workflow source files under `resources/workflows/`. The `core`
plugin currently bundles the six day-to-day workflows in `development/` and
`quality/`, while `FULL-AUDIT.md` and `release/RELEASE-PREP.md` remain
source-side playbooks until they are promoted into a shipped plugin surface.

## Categories

| Directory | Description |
|-----------|-------------|
| [development/](development/) | TDD, search-first, commits |
| [quality/](quality/) | Verification, critique, full audit |
| [release/](release/) | Release preparation |

## Quick Reference

| Task | Workflow |
|------|----------|
| Develop / fix bug | [TDD.md](development/TDD.md) |
| Research first | [SEARCH-FIRST.md](development/SEARCH-FIRST.md) |
| Commit | [COMMIT.md](development/COMMIT.md) |
| Verify (pre-commit/deploy) | [VERIFICATION.md](quality/VERIFICATION.md) |
| Code review | [CRITIQUE.md](quality/CRITIQUE.md) |
| Full audit | [FULL-AUDIT.md](quality/FULL-AUDIT.md) |
| Prepare release | [RELEASE-PREP.md](release/RELEASE-PREP.md) |

## See Also

- [Audit scripts](../../scripts/audit/)
- Release automation currently lives outside Lamella's shared script surface.
