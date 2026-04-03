# Create Shared Subagents

Create new cross-product subagents under `resources/subagents/`. This is the
canonical source for any worker that should emit to both Claude and Codex.

Use this path shape:

```text
resources/subagents/<category>/<name>/SUBAGENT.md
```

Example:

```text
resources/subagents/code-quality/code-reviewer/SUBAGENT.md
```

## Before You Start

Create a shared subagent only when the role is meaningful in both Claude and
Codex. If the behavior is surface-specific, keep that logic inside `claude:`
or `codex:` rather than pushing it into the shared body. If the workflow is
really reference material or a reusable checklist, it may belong in
`resources/skills/` instead.

## Required Frontmatter

Every `SUBAGENT.md` must define these top-level fields:

```yaml
name: code-reviewer
description: Reviews changed code for correctness, security, performance, and missing tests. Use after implementation or before merge.
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
  tools:
    - Read
    - Grep
    - Glob
    - Bash
codex:
  model: gpt-5.4
  model_reasoning_effort: high
  sandbox_mode: read-only
```

`name` must match the containing directory name. `category` must match the
category directory. `distribution.claude_plugin` must match a manifest under
`manifests/claude/` and `distribution.codex_profile` must match one under
`manifests/codex/`. Use arrays for `distribution.*` only when the same subagent
should emit to multiple plugin or profile outputs.

## Supported Shared Profiles

Choose the closest existing value instead of inventing new ones.

| Field | Supported values |
|-------|------------------|
| `capability_profile` | `review`, `explore`, `plan`, `implement`, `docs`, `verify`, `orchestrate` |
| `execution_profile` | `read-only`, `edit-code`, `edit-docs`, `run-commands` |
| `reasoning_profile` | `fast`, `balanced`, `deep` |
| `delegation_style` | `report-only`, `execute`, `orchestrate` |

## Required Body Sections

The validator expects every shared subagent body to include `# <Title>`,
`## Scope`, `## Workflow`, `## Boundaries`, and `## Output Format`. Keep the
body portable and put product-specific runtime settings in frontmatter, not
in the shared instructions.

## Optional Frontmatter

Lamella recognizes these optional fields today:

- Claude: `disallowedTools`, `permissionMode`, `maxTurns`, `skills`,
  `mcpServers`, `hooks`, `memory`, `background`, `isolation`
- Codex: `nickname_candidates`

If you need a field outside that set, update the shared schema and validator
before using it.

## Choosing Distribution

Pick the destination that already owns the worker's domain.

Examples:

- code review or implementation helpers usually belong in `core`
- research or command-heavy helpers often belong in `tools`
- documentation writers and editors usually belong in `writing`
- security auditors and threat-modeling helpers belong in `security`

Do not infer ownership from the folder name alone. The manifest choice controls
where the generated Claude and Codex artifacts land.

## Validate And Build

Run these commands after adding or editing a shared subagent:

```bash
node scripts/ci/validate-subagents.js
node scripts/ci/validate-xrefs.js
bash builders/build-claude-subagents.sh
bash builders/build-codex-agents.sh
```

If you changed distribution metadata, also build the integrated outputs:

```bash
./lamella build-marketplace
./lamella build-codex
```

## Output Paths

Shared source emits to:

- Claude: `dist/claude/plugins/<plugin>/agents/<name>.md`
- Codex: `dist/codex/profiles/<profile>/agents/<name>.toml`

For the full schema and mapping rules, see
`docs/authoring/shared-subagent-model.md`.
