# Getting Started

This guide is the shortest path to using the current library of 301 skills
across 52 plugins.

## Prerequisites

- Claude Code CLI if you want Claude plugin installs
- Codex if you want Codex skill exports
- Bash on macOS or Linux, or WSL on Windows
- `jq`, `make`, and Node.js for local validation and build flows

## Quick Start

### Claude Code

```bash
# Build the local marketplace
./lamella build-marketplace

# Install a few plugins
./lamella install core python typescript

# Inspect what is available
./lamella list
```

### Codex

```bash
# Build Codex skill exports
./lamella build-codex

# Install exported skills
./lamella install-codex --all
```

## What You Should Learn Next

1. [What Are Skills?](what-are-skills.md)
2. [Your First Skill](your-first-skill.md)
3. [Categorizing Skills](categorizing-skills.md)

## Notes

- The Claude install flow resolves manifest dependencies before installing.
- The Codex flow builds exported skills from the same source library instead of
  maintaining a separate skill tree by hand.
- If you are on Windows, prefer WSL for local Lamella build steps. Built
  Claude marketplace output can still be consumed from Windows paths after the
  build completes.
