# Hooks

This directory contains Lamella's shared hook catalog plus a few standalone example bundles.

## What Lives Here

- [`../hooks.json`](/Users/williamnewton/projects/claude-mycelium/lamella/resources/hooks/hooks.json): the main plugin-level hook catalog
- [`../hooks-minimal.json`](/Users/williamnewton/projects/claude-mycelium/lamella/resources/hooks/hooks-minimal.json): a smaller install profile
- `../auto-format/`, `../change-summary/`, and `../compaction/`: standalone examples for local installation
- `../gh-cli/`, `../hookify/`, `../reflexion/`, `../obsidian-vault/`, `../security-guidance/`, and related folders: specialized hook bundles
- [`../../../scripts/hooks/`](/Users/williamnewton/projects/claude-mycelium/lamella/scripts/hooks): the shared Node and Bash implementations used by the main catalog

## Main Catalog Overview

The main [`hooks.json`](/Users/williamnewton/projects/claude-mycelium/lamella/resources/hooks/hooks.json) wires these shared behaviors:

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
- Hyphae capture hooks for errors, test failures, PR reviews, and self-corrections
- asynchronous continuous-learning observation

### Lifecycle Hooks

- session startup context and package-manager detection
- pre-compaction state logging
- stop-time `console.log` scan
- session-end persistence and evaluation

## Cross-Platform Notes

Most shared hooks use Node.js and work across Windows, macOS, and Linux.

Two important exceptions:
- the tmux-related warnings are intentionally gated to non-Windows platforms
- [`comment-style-check.sh`](/Users/williamnewton/projects/claude-mycelium/lamella/scripts/hooks/comment-style-check.sh) is a Bash script, so Windows users should run it through Git Bash or WSL if they enable the shared catalog outside the default plugin environment

## Standalone Examples vs Shared Catalog

The standalone folders are examples you can copy into `~/.claude/hooks/` for manual installation.

They are not a complete mirror of the main catalog, and they may be more shell-specific than the shared implementations in [`scripts/hooks/`](/Users/williamnewton/projects/claude-mycelium/lamella/scripts/hooks).

Prefer the shared catalog when:
- you want the Lamella plugin defaults
- you need the current cross-platform behavior
- you want the docs to match the shipped plugin

Prefer the standalone examples when:
- you want one isolated hook without the full plugin
- you need a simple copy-paste starting point

## Related

- [rules/common/hooks.md](/Users/williamnewton/projects/claude-mycelium/lamella/resources/rules/common/hooks.md)
- [strategic-compact](/Users/williamnewton/projects/claude-mycelium/lamella/resources/skills/core/strategic-compact/SKILL.md)
- [compaction README](/Users/williamnewton/projects/claude-mycelium/lamella/resources/hooks/compaction/README.md)
