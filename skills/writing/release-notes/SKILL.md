---
name: release-notes
description: Generate changelogs and user-facing release notes from commits and PRs. Use when automating releases, writing update announcements, or standardizing commit conventions.
---

# Release Notes

## Contents

- [When to Use](#when-to-use)
- [Conventional Commits](#conventional-commits)
- [Keep a Changelog](#keep-a-changelog)
- [Semantic Versioning](#semantic-versioning)
- [Changelog Automation Tools](#changelog-automation-tools)
- [User-Facing Release Notes](#user-facing-release-notes)
- [Quality Checklist](#quality-checklist)
- [References](#references)

Generate technical changelogs from commits and translate them into user-facing release notes.

## When to Use

- Setting up automated changelog generation
- Writing user-facing release notes for a shipping update
- Implementing Conventional Commits in a project
- Preparing app store update descriptions
- Communicating changes to customers or stakeholders
- Managing semantic versioning

## Conventional Commits

```
<type>[optional scope]: <description>

[optional body]
[optional footer(s)]
```

| Type | Description | Changelog Section |
|------|-------------|-------------------|
| `feat` | New feature | Added |
| `fix` | Bug fix | Fixed |
| `refactor` | Code restructure | Changed |
| `perf` | Performance | Changed |
| `revert` | Revert commit | Removed |
| `docs` | Documentation | (excluded) |
| `chore` | Maintenance | (excluded) |

## Keep a Changelog

```markdown
# Changelog

## [Unreleased]
### Added
- New feature X

## [1.2.0] - 2024-01-15
### Added
- User profile avatars

### Fixed
- Login timeout issue (#123)

[Unreleased]: https://github.com/user/repo/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/user/repo/compare/v1.1.0...v1.2.0
```

## Semantic Versioning

```
MAJOR.MINOR.PATCH

MAJOR: Breaking changes (feat! or BREAKING CHANGE)
MINOR: New features (feat)
PATCH: Bug fixes (fix)
```

## Changelog Automation Tools

| Tool | Language | Best For |
|------|----------|----------|
| standard-version | Node.js | Simple projects |
| semantic-release | Node.js | Full CI/CD automation |
| git-cliff | Rust | Speed, customization |
| commitizen | Python | Python projects |

### Best Practices
- **Follow Conventional Commits** — enables automation
- **Reference issues** — link commits to tickets
- **Use scopes consistently** — define team conventions
- **One logical change per commit** — don't mix changes
- **Use commitlint** — don't skip validation

## User-Facing Release Notes

Release notes translate technical changes into user benefits. Unlike changelogs (which document what changed technically), release notes communicate value.

### Writing Process

1. **Gather the Changelog** — Collect all changes: features, improvements, bug fixes from commits/PRs/tickets
2. **Identify Highlights** — Select 1-3 changes users will notice and care about most
3. **Translate to Benefits** — Rewrite in terms of user value. "Added pagination to search results" → "Find what you need faster with improved search that handles large result sets"
4. **Categorize** — Group into: New Features, Improvements, Bug Fixes. Order by impact within each
5. **Write Scannable Descriptions** — 1-2 sentences per item. Lead with the benefit, optionally followed by the "how"
6. **Acknowledge Known Issues** — Be transparent about limitations. Reduces support burden
7. **Tease Coming Soon** (optional) — Hint at what's next to build anticipation

### Release Note Template

```markdown
# [Product] v[X.Y.Z] — [Release Title]

## Highlights
[1-3 most impactful changes with benefit-focused descriptions]

// ... (8 lines trimmed)

## Known Issues
- [Issue]: [Workaround if available]
```

## Quality Checklist

### Changelog
- [ ] Follows Keep a Changelog format
- [ ] All entries linked to commits/PRs
- [ ] Correct semantic version bump
- [ ] Breaking changes clearly marked

### Release Notes
- [ ] Highlights feature 1-3 most impactful changes
- [ ] Each item leads with user benefit, not technical description
- [ ] Language is jargon-free and accessible
- [ ] Items are concise (1-2 sentences each)
- [ ] Bug fixes mention the problem that was solved
- [ ] Tone is positive and professional

## References

- [references/implementation-methods.md](references/implementation-methods.md) - Setup guides for all tools
- [references/release-templates.md](references/release-templates.md) - GitHub release templates and commit examples
- [references/example.md](references/example.md) - Completed release note example
- [references/template.md](references/template.md) - Release note template

### External Resources
- [Keep a Changelog](https://keepachangelog.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
