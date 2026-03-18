# Changelog

All notable changes to Lamella are documented in this file.

## [0.2.0] - 2026-03-18

### Added

- **`capture-errors.js` PostToolUse hook**: Real-time error capture from tool outputs, storing structured error data in Hyphae for pattern analysis.
- **`capture-corrections.js` PostToolUse hook**: Detects self-correction patterns (reverts, retries, "actually" pivots) and logs them for session review.
- **`capture-test-results.js` PostToolUse hook**: Tracks test failures across tool invocations, building a per-session test result timeline.
- **`capture-pr-reviews.js` PostToolUse hook**: Captures PR review feedback from GitHub tool calls for downstream analysis.
- **`hyphae-context.md` rule**: Reminds agents to check Hyphae for relevant memories before starting new tasks.
- **`pr-review-context.md` rule**: Instructs agents to pull prior PR review feedback from Hyphae when creating or updating pull requests.
- **Hyphae integration in `evaluate-session.js`**: Session evaluation hook stores session summaries and metrics in Hyphae for cross-session learning.
- **LSP configs for rust, typescript, python plugins**: Language-specific plugin configurations for LSP-aware skill execution.
- **Comment style check hook**: PreToolUse hook that validates comment formatting matches the project's boxed section header convention.

### Changed

- **Plugin cache auto-clear on rebuild**: `build-plugin.sh` now clears the plugin cache directory before rebuilding, preventing stale skill/agent definitions.

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
