# Release Workflow Selection

Choose the simplest workflow that matches the repo's actual release pattern.

## GitHub Flow

Use when:

- `main` is normally deployable
- feature branches are short-lived
- releases happen continuously

## Git Flow

Use when:

- the repo keeps a `develop` branch
- releases are staged and scheduled
- hotfixes need a branch off production

## Trunk-Based Development

Use when:

- merges happen frequently
- the team relies on strong CI and feature flags
- incomplete work is hidden behind runtime controls

## Rule of Thumb

If the repo already has one of these workflows, match it. Do not invent a new
release model in the middle of a release.
