# Changelog

All notable changes to Lamella are documented in this file.

## [Unreleased]

### Changed

- **Changelog format**: Release headings and entry structure now follow the
  shared ecosystem changelog template.

## [0.5.9] - 2026-04-03

### Added

- **Workflow presets**: Added reusable workflow preset support.
- **Create-handoff skill**: Added a dedicated skill for structured agent
  handoff creation.
- **Capture-observation skill**: Added a workflow skill for observation
  capture.
- **Skill inventory docs**: Added a more complete inventory of the shipped
  skill surface.
- **Content-root split**: Added a content-root library for resolving resource
  paths.
- **Preset validation**: Added a CI validator for preset manifests.
- **Migration docs**: Added migration documentation for the new resource shape.

### Changed

- **Requires tagging**: Requires metadata now flows across skills, agents, and
  the build pipeline.
- **Requires-aware packaging**: Manifests, build scripts, and CI validators now
  understand the requires-aware content surface.
- **Contributor docs**: CLAUDE, CONTRIBUTING, architecture, authoring guides,
  and getting-started docs were updated to match the new packaging model.

## [0.5.8] - 2026-04-01

### Added

- **Debugging model guidance**: Expanded `systematic-debugging` with
  model-selection and escalation guidance for debugging and validator handoff
  flows.

### Changed

- **Requires-aware installs**: Lamella now validates optional `requires`
  metadata, preserves it in Claude subagent exports, detects installed
  ecosystem tools, and filters plugin content at install time when requirements
  are unmet.
- **Install refresh flow**: `lamella install --refresh` and the underlying
  installer now re-detect tools, re-evaluate installed content, and update
  standalone resources.

### Fixed

- **Ecosystem-coupled defaults**: Hyphae- and Cortina-specific rules and hook
  entries are now skipped automatically when those tools are unavailable.

## [0.5.7] - 2026-03-30

### Changed

- **Hook validator coverage**: `validate-hooks.js` now covers all shipped hook
  config files under `resources/hooks/`, including standalone bundles and the
  minimal hook template.
- **Validator docs**: Contributor and authoring docs now reference the current
  validation surface, including `validate-subagents.js`.

### Fixed

- **Shared hook packaging**: Hook scripts referenced from the main shared hook
  catalog are now copied into built plugins instead of being omitted at package
  time.
- **Manual hook template**: The manual settings template now points at
  `pre-write-doc-warn.js` instead of the removed `doc-file-warning.js`.
- **Post-build hook validation**: `validate-build.js` and marketplace builds
  now check packaged hook command references against the actual built plugin
  payload.

## [0.5.6] - 2026-03-30

### Added

- **Routed Rust skill packs**: Added focused Rust skills for API design, async
  patterns, docs quality, performance, project layout, and testing so deeper
  guidance can load on demand.

### Changed

- **Rust plugin core surface**: Reduced the Rust plugin to 15 core rules and
  routed broader topic coverage through focused skills and updated router
  guidance.
- **Rule corpus format**: Common and Rust rules were compressed into short
  normative guidance instead of tutorial-style references.
- **Rust plugin metadata**: Claude and Codex manifests, marketplace metadata,
  and plugin indexes were synced to the reduced core rule set.

## [0.5.5] - 2026-03-30

### Added

- **Cross-platform shared hook entrypoints**: Added Node-based shared hook
  scripts so the shipped Lamella hook path works across Windows, macOS, and
  Linux.
- **Portable standalone bundles**: Added Node variants for the major standalone
  hook bundles while keeping Bash variants as supported Unix-oriented
  alternatives.

### Changed

- **Hook catalog defaults**: The main shared hook catalog, manual settings
  template, and specialized hook manifests now default to portable Node
  entrypoints.
- **Obsidian vault command surface**: Added Node-based note-management scripts
  so the vault bundle no longer depends on Bash for its primary management
  path.
- **Hook docs**: Lamella hook docs now document the dual-variant model
  explicitly: Node as the portable default, Bash as the Unix-oriented variant.

### Fixed

- **Validation workflow**: The GitHub Actions validate workflow now calls the
  current shared subagent validator instead of the removed `validate-agents.js`
  path.
- **Obsidian search docs**: Bundled search-command docs now point at the new
  Node `search-vault` entrypoint.

## [0.5.4] - 2026-03-29

### Added

- **Layered plugin manifests**: Added 27 narrower plugin manifests across the
  core, security, devops, tools, meta, frontend, and workflow families while
  keeping broad compatibility umbrellas.

### Changed

- **Plugin taxonomy**: Overloaded bundles were split into capability-based
  slices such as `security-scanning`, `devops-cloud`, `tools-cli`, and
  `workflow-planning`.
- **Skill metadata**: All 286 skill descriptions were tightened into concise
  action-led summaries.

### Fixed

- **Codex dependency handling**: Manifest sync and Codex profile build steps
  now preserve and resolve manifest dependencies correctly.

## [0.5.3] - 2026-03-29

### Added

- **Shared subagent pipeline**: Added `resources/subagents/` as the canonical
  cross-surface source plus shared validation and emitters for Claude markdown
  agents and Codex TOML agents.

### Changed

- **Dual-surface agent packaging**: Shared subagents are now part of the main
  Claude plugin and Codex profile builds.
- **Agent source of truth**: The legacy agent catalog was migrated into the
  shared subagent model, and negotiation docs moved to
  `resources/protocols/negotiation/`.

### Fixed

- **Release workflow helper**: Restored
  `scripts/release/extract-changelog-entry.sh` so tagged releases can still
  extract notes from `CHANGELOG.md`.

### Removed

- **Legacy agent tree**: Removed `resources/agents/` as a source of agent
  definitions after the shared subagent migration.
- **Placeholder cleanup log**: Removed the old trimmed-placeholder execution
  log.

## [0.5.2] - 2026-03-27

### Fixed

- **Claude LSP plugin packaging**: Generated `plugin.json` files now point at
  `./.lsp.json`, and the Python, Rust, and TypeScript LSP configs now match the
  schema Claude Code validates.
- **Continuous-learning hook path resolution**: `observe.sh` can now locate
  `detect-project.sh` in both plugin installs and copied `.claude/hooks/`
  layouts.
- **Manual hook guidance**: The manual settings template and
  continuous-learning docs now point at the current phase arguments and script
  paths.
- **Post-build validation coverage**: `validate-build.js` now checks the real
  `dist/claude/plugins` output and validates LSP config packaging.

## [0.5.1] - 2026-03-27

### Added

- **Cleanup tracking docs**: Added the trimmed-placeholder cleanup plan,
  classification, and execution log for the large repo-wide normalization pass.

### Changed

- **Resource surface alignment**: Skills, agents, commands, hooks, rules,
  workflows, templates, manifests, and supporting docs were standardized so the
  shipped guidance matches the current layout.
- **Reference doc labeling**: Imported Claude Code reference pages are now
  marked as upstream snapshots and point readers back to Lamella-specific docs.

### Fixed

- **Stale packaging guidance**: Removed outdated `resources/scripts`,
  standalone-rule install guidance, and legacy template-copy instructions.
- **Legacy references**: Rule and workflow docs now reflect the current agent
  roster and plugin-bundled resource surfaces.

## [0.5.0] - 2026-03-26

### Added

- **Version source of truth**: Added a root `VERSION` file and a marketplace
  catalog validator so tracked marketplace metadata stays aligned with the
  current release target.

### Changed

- **Build-time version stamping**: `build-plugin.sh` and
  `build-marketplace.sh` now support explicit version overrides and default to
  the root `VERSION` file for local builds.
- **Main marketplace publishing**: `publish-marketplace.yml` now publishes
  moving `-dev.<run>` snapshots from `main` instead of reusing tag events for
  mutable `gh-pages` builds.
- **Release asset versioning**: `release.yml` now stamps tag-derived semver
  into built Claude marketplace artifacts before packaging.

## [0.4.2] - 2026-03-22

### Fixed

- **Marketplace release builds**: `scripts/plugins/build-marketplace.sh` now
  increments build counters without tripping Bash `set -e`.

## [0.4.1] - 2026-03-22

### Changed

- **Manifest sync script**: `builders/sync-codex-manifests.sh` now accepts an
  explicit output directory and clears stale generated YAML files before
  rebuilding.
- **Tracked Codex manifests**: `manifests/codex/all.yaml` and
  `manifests/codex/core.yaml` are now aligned with the current Claude manifests.

### Fixed

- **Codex build dirtiness**: `./lamella build-codex` now generates Codex
  manifests into `dist/generated/` instead of rewriting tracked manifests as a
  build side effect.

## [0.4.0] - 2026-03-22

### Added

- **`./lamella` wrapper CLI**: Added one entry point for listing, building,
  installing, uninstalling, and refreshing Claude and Codex outputs.
- **Dependency-aware installs**: Claude plugin installs now resolve manifest
  dependencies, support dry-run planning, and uninstall in reverse dependency
  order.

### Changed

- **Unified local workflows**: `Makefile`, `install.sh`, and
  `install-codex.sh` now route through the wrapper so local commands share one
  code path.
- **Manifest-first plugin listing**: `./lamella list` now reads source
  manifests, so it works before any marketplace build has run.

## [0.3.0] - 2026-03-22

### Added

- **Resource and manifest layout**: Top-level content was reorganized under
  `resources/` and `manifests/` for clearer packaging boundaries.
- **Agent style guide**: Added `CLAUDE.md`,
  `docs/authoring/agent-style-guide.md`, and
  `docs/authoring/writing-specs-for-agents.md` to standardize agent voice,
  structure, and boundaries.

### Changed

- **Agent consolidation**: The agent roster was reduced from 175 to 129 through
  deletes, merges, renames, moves, and broader standardization.
- **Agent metadata standardization**: Models, colors, scope, workflow,
  boundaries, and output-format sections were normalized across the remaining
  agents.
- **Plugin manifest alignment**: All plugin manifests were updated to match the
  agent deletions, renames, and moves from the consolidation pass.

## [0.2.0] - 2026-03-18

### Added

- **Capture hooks**: Added `capture-errors.js`, `capture-corrections.js`,
  `capture-test-results.js`, and `capture-pr-reviews.js`.
- **Hyphae context rules**: Added `hyphae-context.md` and
  `pr-review-context.md` to pull relevant memory before new work.
- **Session evaluation storage**: `evaluate-session.js` now stores session
  summaries and metrics in Hyphae.
- **LSP plugin configs**: Added Rust, TypeScript, and Python LSP configs.
- **Comment-style hook**: Added a PreToolUse hook that checks the project's
  boxed section-header comment style.

### Changed

- **Plugin cache rebuilds**: `build-plugin.sh` now clears the plugin cache
  directory before rebuilding.

## [0.1.0] - 2026-03-16

### Added

- **Initial plugin catalog**: The first release shipped 230 curated skills
  across 20 plugins, 175 agents, and 213 commands.
- **Official Claude plugin format**: Lamella adopted the official
  `.claude-plugin/plugin.json` format from the start.
- **Build pipeline**: Added the initial plugin and marketplace builders plus a
  dependency-aware installer.
- **Marketplace support**: `dist/` shipped as a real Claude Code marketplace.
- **Validation pipeline**: Added validators for agents, skills, commands,
  manifests, xrefs, build output, and hooks.
- **Release automation**: Added the initial GitHub Actions validation workflow.

### Changed

- **Project rename**: The project was renamed from `skill-issue` to `lamella`
  as part of the Basidiocarp ecosystem.
