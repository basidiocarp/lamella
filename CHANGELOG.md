# Changelog

All notable changes to Lamella are documented in this file.

## [Unreleased]

## [0.5.9] - 2026-04-03

### Added

- **Workflow presets**: New preset system for reusable workflow configurations
- **Create-handoff skill**: New skill for structured agent handoff creation
- **Capture-observation skill**: New workflow skill for observation capture
- **Skill inventory**: Comprehensive skill catalog documentation
- **Content-root split**: New content-root library for resolving resource paths
- **Preset validation**: CI validator for preset manifests
- **Migration docs**: Added migration documentation

### Changed

- **Requires tagging (phases 1-3)**: Complete requires metadata implementation across skills, agents, and build pipeline
- Updated manifests, build scripts, and CI validators for requires-aware content
- Updated documentation across CLAUDE.md, CONTRIBUTING.md, architecture, authoring guides, and getting-started

## [0.5.8] - 2026-04-01

### Added

- **Debugging model guidance**: Expanded `systematic-debugging` with model-selection and escalation guidance for debugging and validator handoff flows.

### Changed

- **Requires-aware installs**: Lamella now validates optional `requires` metadata, preserves it in Claude subagent exports, detects installed ecosystem tools, and filters plugin content at install time when requirements are unmet.
- **Install refresh flow**: `lamella install --refresh` and the underlying Claude plugin installer now re-detect tools, re-evaluate installed content, and update standalone resources accordingly.

### Fixed

- **Ecosystem-coupled Lamella defaults**: Hyphae- and Cortina-specific rules and hook entries are now skipped automatically on installs where those tools are unavailable, instead of shipping as unconditional guidance.

## [0.5.7] - 2026-03-30

### Changed

- **Hook validator coverage**: Expanded `validate-hooks.js` to cover all shipped hook config files under `resources/hooks/`, including standalone bundles and the minimal hook template, so bundle-local script drift is caught before release.
- **Validator docs**: Updated contributor and authoring docs to reference the current validation surface, including `validate-subagents.js` instead of the removed `validate-agents.js`.

### Fixed

- **Shared hook packaging**: Corrected Lamella's plugin build logic so hook scripts referenced from the main shared hook catalog are copied from `scripts/hooks/` into built plugins instead of being omitted at package time.
- **Manual hook template**: Fixed the manual settings template to point at `pre-write-doc-warn.js` instead of the removed `doc-file-warning.js` entrypoint.
- **Post-build hook validation**: Tightened `validate-build.js` and marketplace builds so packaged hook command references are checked against the actual built plugin payload.

## [0.5.6] - 2026-03-30

### Added

- **Routed Rust skill packs**: Added focused Rust skills for API design, async patterns, docs quality, performance, project layout, and testing so deeper guidance can be loaded on demand instead of living in the always-on rule surface.

### Changed

- **Rust plugin core surface**: Reduced the Rust plugin to 15 core rules and routed broader topic coverage through focused skills and updated router guidance.
- **Rule corpus format**: Compressed the common rules and the Rust rules corpus into short normative guidance instead of long tutorial-style mini references.
- **Rust plugin metadata**: Synced the Claude and Codex manifests, marketplace metadata, and plugin index with the reduced core rule set and expanded skill routing surface.

## [0.5.5] - 2026-03-30

### Added

- **Cross-platform shared hook entrypoints**: Added Node-based shared hook scripts for observe, Claude markdown scanning, RTK baseline capture, output validation, session logging, subagent stop handling, and comment-style checks so the shipped Lamella hook path works across Windows, macOS, and Linux.
- **Portable standalone bundles**: Added Node variants for the `auto-format`, `change-summary`, `compaction`, `gh-cli`, `obsidian-vault`, `ralph-wiggum`, `reflexion`, and `skill-improver` hook bundles while keeping the Bash variants as supported Unix-oriented alternatives.

### Changed

- **Hook catalog defaults**: Switched the main shared hook catalog, manual settings template, and specialized hook manifests from shell-first entrypoints to portable Node entrypoints.
- **Obsidian vault command surface**: Added Node-based note-management scripts for init, add, search, update, import, list, tags, linking, and archive flows so the vault bundle no longer depends on Bash for its primary management path.
- **Hook documentation**: Updated Lamella hook docs to document the supported dual-variant model explicitly: Node as the portable default, Bash as the supported Unix-oriented variant.

### Fixed

- **Lamella validation workflow**: Repaired the GitHub Actions validate workflow so it calls the current shared subagent validator instead of the removed `validate-agents.js` path.
- **Obsidian search command docs**: Updated the bundled search command docs to point at the new Node `search-vault` entrypoint instead of the old shell path.

## [0.5.4] - 2026-03-29

### Added

- **Layered plugin manifests**: Added 27 narrower plugin manifests across the `core`, `security`, `devops`, `tools`, `meta`, `frontend`, and `workflow` families while keeping the broad plugin names as compatibility umbrellas.

### Changed

- **Plugin taxonomy**: Split overloaded bundles into capability-based slices such as `security-scanning`, `devops-cloud`, `tools-cli`, and `workflow-planning`, and regenerated the Claude and Codex marketplace indexes for the expanded 52-plugin catalog.
- **Skill metadata**: Tightened all 286 skill frontmatter descriptions to concise action-led summaries to reduce token usage across the packaged skill surface.

### Fixed

- **Codex dependency handling**: Updated manifest sync and Codex profile build steps to preserve and resolve manifest dependencies so umbrella profiles still export their dependent resources correctly.

## [0.5.3] - 2026-03-29

### Added

- **Shared subagent pipeline**: Added `resources/subagents/` as the canonical cross-surface source plus shared validation and emitters for Claude markdown agents and Codex TOML agents.

### Changed

- **Dual-surface agent packaging**: Integrated shared subagents into the main Claude plugin and Codex profile builds, including distribution metadata and Codex install support.
- **Agent source of truth**: Migrated the full legacy agent catalog into the shared subagent model and moved negotiation protocol docs to `resources/protocols/negotiation/`.

### Fixed

- **Release workflow helper**: Restored `scripts/release/extract-changelog-entry.sh` so tagged releases can still extract notes from `CHANGELOG.md`.

### Removed

- **Legacy agent tree**: Removed `resources/agents/` as a source of agent definitions after the shared subagent migration completed.
- **Placeholder cleanup log**: Removed the old trimmed-placeholder execution log now that the cleanup and migration work is captured elsewhere.

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
