# Shared Subagent Model

Lamella currently ships Claude-focused agent sources and Codex-focused skill
exports. This document defines a cleaner path for subagents so one repo can
author shared intent and emit product-specific outputs for both Claude and
Codex.

## Recommendation

Keep one repository.

Do not try to make one Claude Markdown subagent file serve both products
directly. Claude and Codex use different runtime formats, different config
surfaces, and different levels of support for metadata.

Instead:

- Use one shared canonical source model.
- Generate Claude subagent Markdown from that model.
- Generate Codex custom-agent TOML from that model.
- Keep skills as a separate shared track because many current "agents" are
  better expressed as Codex skills than Codex custom agents.

## Audit Summary

Current state of `resources/agents/`:

- `130` Markdown files under `resources/agents/`
- `128` define `color`
- `124` define `model`
- `63` define `tools`
- `0` define `permissionMode`
- `0` define `disallowedTools`
- `11` include `<example>` blocks in `description`

Observed patterns:

- The current catalog is structurally optimized for Claude subagents.
- The validator is Claude-specific and only checks Claude-style frontmatter.
- Many descriptions are not yet clean trigger descriptions. They often include
  marketing language (`Expert`, `Ultra-specialized`) or imperative routing
  language (`Use PROACTIVELY`) rather than a compact trigger statement.
- `color` is nearly universal, which is useful for Claude UI but has no direct
  Codex equivalent.
- Tool declarations are inconsistent: plain lists, JSON-style arrays, and
  omitted inheritance all appear in the current corpus.
- The current Codex build pipeline does not export agents at all. It exports
  skills, workflow wrappers, templates, and scripts.

Conclusion:

- The repo should not split into separate Claude and Codex repositories.
- The repo should split **source intent** from **surface-specific packaging**.

## Why `subagents/` Is Better Than `agents/`

If Lamella is intended to be first-class for both Claude and Codex, the
canonical source directory should use a product-neutral term.

Recommended canonical source path:

```text
resources/subagents/<category>/<name>/
```

Why:

- Claude documentation uses "subagents".
- Codex documentation also frames these as subagent workflows with custom
  agents.
- `subagents` is clearer than `agents` because it distinguishes authored helper
  workers from the top-level coding assistant itself.
- It avoids implying that the Claude output shape is the canonical source of
  truth.

This is only clean if `subagents/` is the shared source directory. It becomes
messy if we try to force both products to load directly from that directory
without a build step.

## Canonical Layout

Recommended shared source layout:

```text
resources/
  subagents/
    <category>/
      <name>/
        SUBAGENT.md
        references/
        assets/
```

Generated outputs:

```text
dist/claude/plugins/<plugin>/agents/<name>.md
dist/codex/profiles/<profile>/agents/<name>.toml
```

Notes:

- Claude should still receive `agents/<name>.md` because that is the supported
  product-facing format.
- Codex should receive project-scoped `.toml` custom agents because that is the
  supported product-facing format.
- The shared source directory should not mirror either product's on-disk format
  exactly.

## Shared Source Format

Each shared subagent should have one `SUBAGENT.md` file with YAML frontmatter
plus Markdown instructions.

Example:

```md
---
name: code-reviewer
description: Reviews changed code for correctness, security, and missing tests. Use after implementation or before merge.
category: code-quality
capability_profile: review
execution_profile: read-only
reasoning_profile: deep
delegation_style: report-only

distribution:
  claude_plugin: core
  codex_profile: core

claude:
  model: opus
  color: yellow
  tools: [Read, Grep, Glob, Bash]

codex:
  model: gpt-5.4
  model_reasoning_effort: high
  sandbox_mode: read-only
---

# Code Reviewer

Review code like an owner.

## Scope

Review changed code for correctness, security, regressions, and missing tests.

## Workflow

1. Map the changed execution path.
2. Look for correctness and security risks.
3. Check tests and behavioral regressions.
4. Report concrete findings with file references.

## Boundaries

- **Do**: Read broadly enough to verify behavior.
- **Ask first**: Expand into architectural redesign.
- **Never**: Apply fixes directly.

## Output Format

- Severity-ordered findings
- Open questions or assumptions
- Brief risk summary
```

## Required Shared Fields

These fields are required in every `SUBAGENT.md` because they carry portable
intent:

| Field | Purpose |
|-------|---------|
| `name` | Stable identifier |
| `description` | Trigger description for both products |
| `category` | Source organization and manifest grouping |
| `capability_profile` | High-level role such as `review`, `implement`, `explore`, `plan`, `docs` |
| `execution_profile` | Shared access intent such as `read-only`, `edit-code`, `run-commands` |
| `reasoning_profile` | Shared reasoning tier such as `fast`, `balanced`, `deep` |
| `delegation_style` | Expected behavior such as `report-only`, `execute`, `orchestrate` |
| `distribution` | Target Claude plugin and Codex profile ownership |
| body instructions | Shared behavior and workflow |

## Required Surface-Specific Fields

Keep only the minimum required product-specific fields in nested sections.

### Claude required

| Field | Reason |
|-------|--------|
| `model` | Claude model alias or full model id |
| `color` | Claude UI concept |
| `tools` | Claude tool allowlist |

### Codex required

| Field | Reason |
|-------|--------|
| `model` | Codex model slug |
| `model_reasoning_effort` | Codex runtime setting |
| `sandbox_mode` | Codex execution policy |

## Optional Surface-Specific Fields Supported Today

These fields are recognized by the shared schema and validator today.

### Claude optional

| Field | Type | Notes |
|-------|------|-------|
| `disallowedTools` | `string[]` | Denylist layered on top of `tools` |
| `permissionMode` | `string` | `default`, `acceptEdits`, `dontAsk`, `bypassPermissions`, or `plan` |
| `maxTurns` | `number` | Positive integer |
| `skills` | `string[]` | Skills to preload |
| `mcpServers` | `string \| string[] \| map` | String reference, list of references, or inline config map |
| `hooks` | `map` | Subagent-scoped hook config |
| `memory` | `string` | `user`, `project`, or `local` |
| `background` | `boolean` | Run as a background task |
| `isolation` | `string` | Currently modeled as `worktree` |

### Codex optional

| Field | Type | Notes |
|-------|------|-------|
| `nickname_candidates` | `string[]` | Presentation-only nicknames; `name` remains the identity key |

## Not Yet Modeled

Some product-specific fields are documented in the upstream Claude or Codex
references but are not part of Lamella's shared schema yet.

Examples:

- Codex config-layer keys such as `mcp_servers` and `skills.config`
- Any future Claude or Codex subagent fields that are not yet validated and
  emitted by Lamella

Rule:

- If a field is not portable, keep it in `claude:` or `codex:`.
- If the behavior itself is not portable, the subagent is not truly shared and
  should be classified as Claude-only or Codex-only.

## Distribution Metadata

Every shared subagent should declare where it belongs in the built outputs.

```yaml
distribution:
  claude_plugin: core
  codex_profile: core
```

When one shared subagent belongs in more than one built destination, use arrays:

```yaml
distribution:
  claude_plugin: [writing, tools]
  codex_profile: [writing, tools]
```

Rules:

- `distribution.claude_plugin` must be a non-empty string or array of manifest
  names under
  `manifests/claude/`.
- `distribution.codex_profile` must be a non-empty string or array of manifest
  names under
  `manifests/codex/`.
- Keep the two values separate even when they happen to match.
- Array entries must be unique.
- Do not infer ownership from `category`; declare it explicitly.

## Mapping Rules

Map shared source to outputs as follows.

### Shared to Claude

- `name` -> `name`
- `description` -> `description`
- body Markdown -> body Markdown
- `claude.model` -> `model`
- `claude.color` -> `color`
- `claude.tools` -> `tools`
- `claude.disallowedTools` -> `disallowedTools`
- `claude.permissionMode` -> `permissionMode`
- `claude.maxTurns` -> `maxTurns`
- `claude.skills` -> `skills`
- `claude.mcpServers` -> `mcpServers`
- `claude.hooks` -> `hooks`
- `claude.memory` -> `memory`
- `claude.background` -> `background`
- `claude.isolation` -> `isolation`

### Shared to Codex

- `name` -> TOML `name`
- `description` -> TOML `description`
- body Markdown + normalized sections -> TOML `developer_instructions`
- `codex.model` -> TOML `model`
- `codex.model_reasoning_effort` -> TOML `model_reasoning_effort`
- `codex.sandbox_mode` -> TOML `sandbox_mode`
- `codex.nickname_candidates` -> TOML `nickname_candidates`

## Classification Rules For Existing Catalog

Every current agent should be put in one of these buckets during migration.

### 1. Shared subagent

Use when:

- The role is meaningful in both products.
- The instructions are portable.
- Product-specific metadata is small and isolated.

Examples likely to fit:

- reviewers
- explorers
- debuggers
- planners
- docs auditors
- code quality auditors

### 2. Claude-only subagent

Use when:

- The value depends on Claude-only metadata or plugin mechanics.
- The instructions assume Claude routing or Claude-specific tool semantics.
- The artifact is tightly coupled to Claude plugin packaging.

Examples likely to fit:

- Claude command auditors
- plugin-format validators that target Claude plugin behavior directly

### 3. Codex skill, not Codex custom agent

Use when:

- The content is really a reusable workflow or knowledge pack.
- The user should invoke it directly or Codex should load it as a skill.
- The artifact does not need a dedicated spawned-agent identity.

Examples likely to fit:

- highly instructional writing helpers
- reference-heavy domain specialists
- workflow guides that do not need their own runtime config

## Naming Recommendation

Use these terms consistently:

- **shared source**: `subagent`
- **Claude output**: `agent` or `subagent`, matching Claude docs
- **Codex output**: `custom agent` in docs, stored under `.codex/agents/`

In code and repo layout:

- `resources/subagents/` for canonical source
- `dist/claude/.../agents/` for Claude output
- `dist/codex/.../agents/` or installable `.codex/agents/` output for Codex

This gives the repo one neutral vocabulary without fighting either product's
official naming.

## Migration Plan

1. Add a new validator for `resources/subagents/**/SUBAGENT.md`.
2. Add a builder that emits:
   - Claude Markdown agent files
   - Codex TOML custom-agent files
3. Migrate 3 to 5 representative agents first:
   - one reviewer
   - one implementer
   - one explorer
   - one planner
   - one docs or research agent
4. Classify the rest of the current `resources/agents/` catalog into:
   - shared subagent
   - Claude-only subagent
   - Codex skill instead
5. Only after the pilot works, migrate the full catalog.

## Naming And Consolidation Policy

Do not rename aggressively during the pilot.

Rules:

- Keep the current stable `name` unless the existing name is clearly misleading,
  collides with another worker, or blocks a clean cross-product mapping.
- Prefer behavioral clarity over taxonomy purity. A slightly imperfect stable
  name is better than a wave of churn that obscures the migration.
- Record consolidation candidates during the pilot, but defer actual merges
  until after the first shared-source model is validated.
- Rename only when the role itself changes materially, not just because the new
  folder structure offers a cleaner wording.

For the first pilot wave, stability is more important than elegance.

## Initial Pilot Set

Recommended first shared-source ports:

- `code-reviewer`
- `code-explorer`
- `planner`
- `build-error-resolver`
- `docs-writer`
- `refactorer`
- `test-runner`
- `git-history-analyzer`

## Immediate Next Step

Do not bulk-rename `resources/agents/` yet.

First build a pilot around a handful of representative subagents and validate
that:

- the shared source model is expressive enough
- Claude output remains clean
- Codex output is actually useful as a custom-agent catalog

If the pilot fails, adjust the model before migrating the rest of the repo.
