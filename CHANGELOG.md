# Changelog

All notable changes to Lamella are documented in this file.

## [0.1.0] - 2026-03-16

### Added
- 230 curated skills across 20 specialized plugins
- 175 agents for code review, planning, debugging, and more
- 213 commands for common development workflows
- Official Claude Code plugin format (`.claude-plugin/plugin.json`)
- Plugin build pipeline (`build-plugin.sh`, `build-marketplace.sh`)
- Marketplace support — `dist/` is a proper Claude Code marketplace
- Plugin installer with dependency awareness
- 7 CI validators (agents, skills, commands, manifests, xrefs, build, hooks)
- GitHub Actions workflow for validation on PRs

### Changed
- Renamed from skill-issue to lamella (part of the Basidiocarp ecosystem)

### Completed Phases
- **Phase 1**: Quality & correctness — fixed agent validation, broken xrefs, MkDocs markup
- **Phase 2**: Distribution & onboarding — rewrote installer, added CONTRIBUTING.md, architecture docs
- **Phase 3**: CI & automation — GitHub Actions, manifest validator, xref validator
- **Phase 4**: Taxonomy cleanup — merged languages→tools, councils→meta, clarified shared dirs
- **Phase 5**: Final polish — removed orphans, fixed validator false positives
- **Phase 6**: Official plugin format — Claude Code plugin directories, marketplace builder
