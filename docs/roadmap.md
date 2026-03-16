# Lamella Roadmap

> Current state: **230 skills** | **175 agents** | **213 commands** | **20 plugins** | **160 scripts**

After 11 cleanup phases, the library is lean and well-organized. This roadmap captures forward-looking improvements.

---

## Phase 1 — Quality & Correctness (Quick Wins) ✅

All items completed.

### 1.1 Fix agent validation ✅

Updated `validate-agents.js` to match official Claude Code subagent spec (required fields: `name`+`description`, not `model`+`tools`). Added `inherit` and full model IDs as valid models. Fixed 18 remaining genuine errors (8 missing frontmatter, 10 missing `name` field). **0 errors now.**

### 1.2 Fix 17 broken command cross-references ✅

Replaced 10 broken xrefs with correct paths (`/code-review` → `/audit/review`, `/rust-review` → `/languages/rust`, `/agents` → `/meta/agent`, etc.). Added allowlist for built-in Claude commands (`/help`, `/mcp`) and HTTP endpoints (`/health`, `/ready`, `/up`, `/users`) to validator. **0 errors now.**

### 1.3 Fix MkDocs markup in docs/index.md ✅

Replaced MkDocs card grid with standard Markdown table. Replaced `:material-*:` icons with emoji and `:octicons-arrow-right-24:` with `→`. Removed wrapping code fence.

### 1.4 Move best-practices.md and skills-spec.md into docs/ ✅

Moved to `docs/authoring/`. No stale references found.

---

## Phase 2 — Distribution & Onboarding ✅

All items completed.

### 2.1 Rewrite install.sh ✅

Replaced legacy curl-pipe installer (24 hardcoded agents from GitHub URL) with a plugin-aware installer. New install.sh supports interactive selection, `--all`, `--list`, and named plugins. Wraps `build-plugin.sh` + `install-plugin.sh` into a single command. Updated `uninstall.sh` to match.

### 2.2 Add CONTRIBUTING.md ✅

Created 150-line contribution guide covering: adding skills/agents/commands, frontmatter requirements, plugin manifests, running validators, build/install workflow, code style, and PR process.

### 2.3 Add docs/architecture.md ✅

Created 105-line architecture overview with Mermaid pipeline diagram, directory structure, resource type descriptions, plugin system explanation, and validation pipeline summary.

### 2.4 Add Makefile ✅

Created Makefile with targets: `validate`, `build`, `install`, `uninstall`, `audit`, `clean`, `count`, `help`. All tested and working.

---

## Phase 3 — CI & Automation ✅

All items completed.

### 3.1 Add GitHub Actions CI workflow ✅

Created `.github/workflows/validate.yml` running all 7 validators on PRs and pushes to main (Node 20).

### 3.2 Add plugin manifest validator ✅

Created `scripts/ci/validate-manifests.js` — checks all 830 resources across 20 manifests resolve to real files. Found and fixed 3 broken template paths in `core.json`. **0 errors now.**

### 3.3 Add cross-reference validator ✅

Created `scripts/ci/validate-xrefs.js` — scans agents/ and commands/ for path references to skills/, workflows/, templates/ and verifies targets exist. Found 55 broken xrefs to deleted skills; all fixed across 28 files. Excludes docs/reference (example paths) and ROADMAP (future plans). **0 errors now.**

Both new validators added to Makefile `validate` target and GitHub Actions workflow.

---

## Phase 4 — Taxonomy Cleanup ✅

All items completed.

### 4.1 Merge `languages` skill into `tools` ✅

Moved `skills/languages/php-pro` → `skills/tools/php-pro`. Removed empty `skills/languages/` directory. Updated `languages.json` and `tools.json` manifests (tools now has 26 skills). Updated README plugin table.

### 4.2 Merge `councils` agent into `meta` ✅

Moved `agents/councils/output-evaluator.md` → `agents/meta/output-evaluator.md`. Removed `agents/councils/` directory. Updated `commands/planning/deepen-plan.md` reference.

### 4.3 Clarify `_shared` and `_negotiation` agent directories ✅

Added README.md to both directories explaining their purpose (shared utility fragments for research agents, negotiation protocol definitions), contents, and that they are not standalone agents.

---

## Phase 5 — Content Expansion

New skills for common gaps.

## Phase 5 — Final Polish ✅

Revised from the original content expansion plan after discovering the proposed skills already existed.

### 5.1 Auth patterns — Already exists ✅

`skills/security/auth-implementation-patterns` covers OAuth2, OIDC, JWT, sessions, RBAC. No new skill needed.

### 5.2 Deployment strategies — Already exists ✅

`skills/devops/deployment` covers blue-green, canary, CI/CD, rollback, feature flags. No new skill needed.

### 5.3 Fix command validator false positives ✅

`findLeafDirs()` in `validate-commands.js` skipped skills with subdirectories (assets/, references/). Replaced with `findSkillDirs()` that collects all skill names at depth 2. Fixed 5 warnings.

### 5.4 Fix skill validator multiline YAML parsing ✅

`extractFrontmatter()` in `validate-skills.js` couldn't parse YAML multiline scalars. Added continuation-line handling. Fixed `workflow/context-handoff` warning.

### 5.5 Remove `languages` plugin ✅

Its only skill (`php-pro`) was already moved to `tools/` in Phase 4. Removed `languages.json`, removed from `index.json` and plugin registry. 21 → 20 plugins.

### 5.6 Remove orphaned `agents/_shared/` ✅

`fetch-strategy.md` had zero references anywhere in the codebase. Removed directory entirely.

---

## Phase 6 — Official Plugin Format ✅

Migrated the build pipeline to output official Claude Code plugin directories.

### 6.1 Rewrite build-plugin.sh ✅

Complete rewrite of `scripts/plugins/build-plugin.sh`. Now generates self-contained Claude Code plugin directories with `.claude-plugin/plugin.json`, flattened `agents/`, `commands/`, `skills/` dirs, and `hooks/hooks.json`. Non-plugin resources (rules, workflows, templates) go to `_standalone/` for separate installation.

### 6.2 Create build-marketplace.sh ✅

New `scripts/plugins/build-marketplace.sh` builds all 20 plugins to `dist/plugins/` and generates `dist/.claude-plugin/marketplace.json` — making the dist/ directory a proper Claude Code marketplace. Install via `/plugin marketplace add ./dist`.

### 6.3 Update install pipeline ✅

Rewrote `install-plugin.sh` to install plugins as official plugin directories to `~/.claude/plugins/lamella/<name>/` (with `.claude-plugin/plugin.json`, agents, commands, skills, hooks). Standalone resources (rules, templates, workflows) still copy to `~/.claude/` directly. Updated `install.sh` orchestrator and Makefile with `build-marketplace` target.

### 6.4 Post-build validator ✅

Created `scripts/ci/validate-build.js` — validates all built plugin directories have valid `.claude-plugin/plugin.json`, flat agents, skill dirs with SKILL.md, and correct marketplace.json entries. All 20 plugins pass with 0 errors.

---

## Phase 7 — Advanced Packaging

Longer-term distribution improvements.

### 7.1 Plugin dependency resolution

Plugin manifests declare `dependencies` but the build/install scripts don't resolve them. Installing `typescript` alone misses required `core` skills.

**Action:** Update `install-plugin.sh` to resolve and install deps automatically.

**Effort:** Medium

### 7.2 CLI wrapper

A `lamella` CLI that wraps build + install:

```bash
lamella install core python typescript
lamella list
lamella update
```

**Effort:** Medium

### 7.3 Pre-built releases

Publish plugin bundles as GitHub Releases so users can install without cloning the full repo or needing `jq`.

**Effort:** Large

---

## Completed Work

| Phase | Result |
|-------|--------|
| Skills audit | 508 → 230 |
| Agent dedup/removal | 239 → 176 |
| Command audit/dedup/merge | 302 → 213 |
| Plugin audits | All 21 audited |
| Infrastructure cleanup | secretary/taskmanager/zeroize-audit removed |
| Agent debloating | 31,147 → 25,619 lines (-18%) |
| Skill debloating | 303,555 → 221,833 lines (-27%) |
| Workflows/Templates | 39 → 26 files (-50%) |
| Hooks audit | 32 → 25 bash scripts, 4 fixed |
| Documentation refresh | Counts/links fixed across 5 docs |
| Scripts cleanup | 222 → 160 files (-34%), 6 CI scripts fixed |
