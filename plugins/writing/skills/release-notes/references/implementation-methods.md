# Changelog Implementation Methods

Use this page to choose a release-note automation approach.

## Common Options

| Method | Best Fit |
|--------|----------|
| Conventional Changelog / `standard-version` | Node-based repos with conventional commits |
| `semantic-release` | Fully automated tagged release pipelines |
| `git-cliff` | Fast git-based changelog generation |
| `commitizen` | Python-centric conventional release workflow |

## Rule

Pick one release-note path and keep commit conventions, tagging, and CI aligned with it. Mixing multiple automation systems usually creates drift.
