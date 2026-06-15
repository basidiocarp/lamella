---
name: release-notes
description: "Generates changelogs and user-facing release notes from commits and pull requests."
origin: lamella
---

# Release Notes

Use this skill when converting technical change history into changelogs or user-facing release notes.

## Core Workflow

1. detect the last published version — run `git tag --sort=-v:refname | head -1` to find the latest release tag; for a Rust crate, `cargo pkgid` exposes the declared version as a cross-check (note: `cargo pkgid` reflects the *declared* version which may be unreleased — the tag is authoritative for "last published")
2. gather commits, PRs, and issue references since that tag only (e.g. `git log "$(git tag --sort=-v:refname | head -1)"..HEAD`)
3. structure the technical changelog
4. identify the few changes users will actually care about
5. rewrite them in user-benefit language

## Core Rules

- technical changelog and user-facing release notes are different artifacts
- keep user-facing notes jargon-light
- lead with value, not implementation detail
- write notes from diff impact analysis — describe what changed and why it matters; never copy commit-message text verbatim

## References

- [references/implementation-methods.md](references/implementation-methods.md)
- [references/release-templates.md](references/release-templates.md)
- [references/example.md](references/example.md)
- [references/template.md](references/template.md)
