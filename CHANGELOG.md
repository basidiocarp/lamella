# Changelog

All notable changes to Lamella are documented in this file.

## [Unreleased]

## [0.5.2] - 2026-03-27

### Fixed

- **Claude LSP plugin packaging**: Corrected Lamella's LSP plugin output so generated `plugin.json` files point at `./.lsp.json`, and updated the Python, Rust, and TypeScript LSP configs to the schema Claude Code currently validates.
- **Continuous-learning hook path resolution**: Hardened `observe.sh` so it can locate `detect-project.sh` in both plugin installs and copied `.claude/hooks/` layouts without failing every hook invocation.
- **Manual hook guidance**: Updated the manual settings template and continuous-learning docs so pre/post observe hooks pass the correct phase argument, SessionEnd examples point at the current script path, and the shell evaluator loads its skill-root `config.json` correctly.
- **Post-build validation coverage**: Pointed `validate-build.js` at the real `dist/claude/plugins` output and added LSP config checks so invalid hook and LSP packaging is caught before install or release.

## [0.5.1] - 2026-03-27

### Added

- **Cleanup tracking docs**: Added the trimmed-placeholder cleanup plan, classification, and execution log to document the large repo-wide normalization pass.

### Changed

- **Resource surface alignment**: Audited and standardized Lamella skills, agents, commands, hooks, rules, workflows, templates, manifests, and supporting docs so the shipped guidance matches the current plugin layout and authoring model.
- **Reference doc labeling**: Marked imported Claude Code reference pages as upstream snapshots and pointed readers back to Lamella-specific architecture and packaging docs.

### Fixed

- **Stale packaging and path guidance**: Removed outdated `resources/scripts`, standalone rule-install, and legacy template-copy guidance across docs and resource READMEs.
- **Legacy agent and workflow references**: Updated rule and workflow docs to reflect the current agent roster and plugin-bundled resource surfaces.

## [0.5.0] - 2026-03-26

### Added

- **Version source of truth**: Added a root `VERSION` file and a marketplace catalog validator so tracked marketplace metadata stays aligned with the current release target.

### Changed

- **Build-time version stamping**: `build-plugin.sh` and `build-marketplace.sh` now support explicit version overrides and default to the root `VERSION` file for local builds.
- **Main marketplace publishing**: `publish-marketplace.yml` now publishes moving `-dev.<run>` snapshots from `main` instead of reusing tag events for mutable `gh-pages` builds.
- **Release asset versioning**: `release.yml` now stamps the tag-derived semver into built Claude marketplace artifacts before packaging them.

## [0.4.2] - 2026-03-22

### Fixed

- **Marketplace release builds**: `scripts/plugins/build-marketplace.sh` now increments build counters without tripping Bash `set -e`, which fixes GitHub Actions release runs that exited after the first successful plugin build.

## [0.4.1] - 2026-03-22

### Fixed

- **Codex build dirtiness**: `./lamella build-codex` now generates Codex manifests into `dist/generated/` instead of rewriting tracked manifests as a build side effect.

### Changed

- **Manifest sync script**: `builders/sync-codex-manifests.sh` now accepts an explicit output directory and clears stale generated YAML files before rebuilding.
- **Tracked Codex manifests synced**: `manifests/codex/all.yaml` and `manifests/codex/core.yaml` are now aligned with the current Claude manifests.

## [0.4.0] - 2026-03-22

### Added

- **`./lamella` wrapper CLI**: Added a single entry point for listing, building, installing, uninstalling, and refreshing Claude and Codex outputs.
- **Dependency-aware installs**: Claude plugin installs now resolve manifest dependencies, support dry-run planning, and uninstall in reverse dependency order.

### Changed

- **Unified local workflows**: `Makefile`, `install.sh`, and `install-codex.sh` now route through the wrapper so local commands share one code path.
- **Manifest-first plugin listing**: `./lamella list` reads source manifests, so it works before any marketplace build has run.

## [0.3.0] - 2026-03-22

### Directory Restructuring

Reorganized top-level directories under `resources/` and `manifests/` for better code organization and clarity:
- `agents/`, `skills/`, `commands/`, `hooks/`, `rules/`, `templates/`, `workflows/`, `mcp-configs/` → `resources/`
- `plugin-manifests/` → `manifests/claude/`
- Build, validation, and hook scripts moved to dedicated subdirectories

This change has no impact on the official Claude Code plugin format or build output.

### Agent Consolidation

Reduced agent count from 175 to 129 through systematic audit, merge, and cleanup.

**Deleted (15 low-value/narrow agents):**
- search-specialist, reference-builder, learning-guide, test-automator,
  content-marketer, performance-engineer, legal-advisor, mermaid-expert,
  pm-agent, schema-drift-detector, ad-creator, landing-designer,
  persona-strategist, every-style-editor, article-writer-agent

**Merged (22 agents absorbed into targets):**
- software-architect → architect
- hybrid-cloud-architect → cloud-architect
- devops-architect → deployment-engineer
- error-detective → debugger
- silent-failure-hunter → bug-auditor
- e2e-test-agent → e2e-runner
- pr-test-analyzer → test-coverage-reviewer
- doc-updater → docs-specialist (now docs-writer)
- deep-research + search-specialist → researcher
- historical-context-reviewer → git-history-analyzer
- code-simplifier → refactoring-specialist (now refactorer)
- go-build-resolver → build-error-resolver
- backend/frontend/mobile-security-coder → security-expert (now security-reviewer)
- deployment-verification-agent → deploy-checker
- publishing-optimizer → seo-expert (now seo-optimizer)
- data-migration-expert → data-integrity-guardian
- env-validator → infra-auditor
- design-system-architect → ui-designer
- visual-diff → ui-visual-validator

**Absorbed (7 narrow agents into broader ones):**
- clippy-researcher, crate-researcher, std-docs-researcher → researcher
- layer1/2/3-analyzer → rust-developer
- console-monitor → browser-qa-agent (now browser-tester)
- learnings-researcher → researcher

### Agent Renames

Standardized naming: dropped -specialist, -expert, -pro, -agent suffixes.

- docker-specialist-agent → docker-engineer
- terminal-specialist-agent → terminal-engineer
- browser-qa-agent → browser-tester
- refactoring-specialist → refactorer
- pattern-recognition-specialist → pattern-analyzer
- docs-specialist → docs-writer
- security-expert → security-reviewer
- threat-modeling-expert → threat-modeler
- seo-expert → seo-optimizer
- accessibility-expert → accessibility-reviewer
- language-expert → language-developer
- python-expert → python-developer
- database-expert → database-architect
- service-mesh-expert → service-mesh-architect
- django-pro → django-developer
- fastapi-pro → fastapi-developer
- performance-oracle → performance-analyzer
- repo-research-analyst → repo-analyzer
- vector-database-engineer → vector-db-architect
- structure-architect → content-architect
- graphql-patterns (name field) → graphql-architect

### Agent Moves

- content-architect: architecture/ → content/ (content structure, not software)
- performance-analyzer: ai-ml/ → analysis/ (code analysis, not AI/ML)
- reverse-engineer: specialized/ → security/ (binary analysis is security)
- repo-analyzer: research/ → analysis/ (codebase analysis)

### Agent Standardization

All 129 agents rewritten to follow new agent-style-guide.md:

- Added `model` field to 31 agents (opus for planning/research, sonnet for coding, haiku for lookup)
- Added `color` field to all 129 agents (blue=architecture, cyan=analysis, green=testing, yellow=audit, magenta=writing, red=security)
- Removed non-standard frontmatter fields (category, assistant, user) from 15 agents
- Average agent size reduced from ~130 lines to 65 lines
- 92% of agents now have standardized Scope sections
- 93% have Workflow and Boundaries sections
- 99% have Output Format sections
- Stripped capability lists, filler adjectives, and repeated purpose sections
- Enforced second-person imperative voice throughout
- Added three-tier boundaries (Do / Ask first / Never) to all agents
- Added status blocks to dep-auditor and db-auditor (completing auditor consistency)

### Added

- **CLAUDE.md**: Project instructions for agents working in this repo — build commands, directory layout, authoring reference table, checklists
- **docs/authoring/agent-style-guide.md**: Voice rules, body skeleton, section order, size targets, color scheme, degrees of freedom
- **docs/authoring/writing-specs-for-agents.md**: Six core areas, three-tier boundaries, modular context, self-verification (adapted from Addy Osmani)

### Changed

- All 22 plugin manifests updated to reflect agent deletions, renames, and moves
- Agent authoring checklist in CLAUDE.md now references style guide with model/color/skeleton rules

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
