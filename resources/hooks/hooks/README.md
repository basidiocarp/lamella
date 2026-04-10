# Hooks

This directory contains Lamella's shared hook catalog plus a few standalone example bundles.

## What Lives Here

- [`../hooks.json`](../hooks.json): the main plugin-level hook catalog
- [`../hooks-minimal.json`](../hooks-minimal.json): a smaller install profile
- `../auto-format/`, `../change-summary/`, and `../compaction/`: standalone examples for local installation
- `../gh-cli/`, `../hookify/`, `../reflexion/`, `../obsidian-vault/`, `../security-guidance/`, and related folders: specialized hook bundles
  `obsidian-vault` now ships supported Node and Bash variants for both its hook entrypoints and its vault-management scripts
- [`../../../scripts/hooks/`](../../../scripts/hooks/): the shared cross-platform Node implementations used by the main catalog, plus a few Bash-only examples

## Main Catalog Overview

The main [`hooks.json`](../hooks.json) wires these shared behaviors:

### `PreToolUse`

- Unix-only tmux guard for dev servers
- tmux reminder for long-running shell commands
- push reminder before `git push`
- warning for non-standard documentation file creation
- manual compaction suggestion
- asynchronous continuous-learning observation

### `PostToolUse`

- PR creation hint after `gh pr create`
- async build completion notice
- JS and TS formatting after edits
- TypeScript checking after `.ts` or `.tsx` edits
- `console.log` warning after edits
- comment style warning after edits or writes
- Cortina runtime capture for errors, validations, self-corrections, and export or ingest signals
- Lamella-only PR review capture hook
- asynchronous continuous-learning observation

### Lifecycle Hooks

- session startup context and package-manager detection
- pre-compaction state logging
- stop-time `console.log` scan
- Cortina stop capture plus Lamella session evaluation

## Cortina Boundary

The shared Lamella catalog no longer owns the primary lifecycle capture runtime.

- Cortina owns reusable capture behavior for `PostToolUse` and `Stop`
- Lamella owns packaging, templates, docs, continuous-learning observation, and local workflow hooks
- the shipped Stop hook routes directly to Cortina, and Lamella keeps only the separate evaluation hook
- the older Lamella JS capture helpers have been removed; the shipped lifecycle path is Cortina

## Cross-Platform Notes

The shipped Lamella hook catalog now uses Node.js entrypoints for the default shared path, so it works across Windows, macOS, and Linux.

Two important exceptions remain:
- the tmux-related warnings are intentionally gated to non-Windows platforms
- the standalone example bundles under `resources/hooks/*` still include supported Bash variants for manual copy-and-paste installs alongside the newer Node variants

## Standalone Examples vs Shared Catalog

The standalone folders are examples you can copy into `~/.claude/hooks/` for manual installation.

They are not a complete mirror of the main catalog, and many of them remain more shell-specific than the shared implementations in [`scripts/hooks/`](../../../scripts/hooks/).

Prefer the shared catalog when:
- you want the Lamella plugin defaults
- you need the current cross-platform behavior
- you want the docs to match the shipped plugin and Cortina-owned lifecycle runtime

Prefer the standalone examples when:
- you want one isolated hook without the full plugin
- you need a simple copy-paste starting point

## Related

- [rules/common/hooks.md](../../rules/common/hooks.md)
- [strategic-compact](../../skills/core/strategic-compact/SKILL.md)
- [compaction README](../compaction/README.md)
