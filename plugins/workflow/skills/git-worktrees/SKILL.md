---
name: git-worktrees
description: "Manages Git worktrees for parallel development across multiple branches and working directories."
origin: lamella
---

# Git Worktrees

## Contents

- [Overview](#overview)
- [Core Concepts](#core-concepts)
- [Quick Reference](#quick-reference)
- [Essential Commands](#essential-commands)
- [References](#references)

## Overview

Git worktrees enable checking out multiple branches simultaneously in separate directories, all sharing the same repository. Create a worktree instead of stashing changes or cloning separately.

**Core principle:** One worktree per active branch. Switch contexts by changing directories, not branches.

## Core Concepts

| Concept | Description |
|---------|-------------|
| **Main worktree** | Original working directory from `git clone` or `git init` |
| **Linked worktree** | Additional directories created with `git worktree add` |
| **Shared `.git`** | All worktrees share same Git object database (no duplication) |
| **Branch lock** | Each branch can only be checked out in ONE worktree at a time |

## Quick Reference

| Task | Command |
|------|---------|
| Create worktree (existing branch) | `git worktree add <path> <branch>` |
| Create worktree (new branch) | `git worktree add -b <branch> <path>` |
| Create worktree (from ref) | `git worktree add -b <branch> <path> <start>` |
| Create detached worktree | `git worktree add --detach <path> <commit>` |
| List all worktrees | `git worktree list` |
| Remove worktree | `git worktree remove <path>` |
| Force remove worktree | `git worktree remove --force <path>` |
| Move worktree | `git worktree move <old> <new>` |
| Lock/Unlock worktree | `git worktree lock/unlock <path>` |
| Prune stale worktrees | `git worktree prune` |
| Repair worktree links | `git worktree repair` |

## Essential Commands

### Create a Worktree

```bash
# Create worktree with existing branch
git worktree add ../feature-x feature-x

# Create worktree with new branch from current HEAD
git worktree add -b new-feature ../new-feature

# Create worktree with new branch from specific commit
git worktree add -b hotfix-123 ../hotfix origin/main

# Create worktree with detached HEAD (for experiments)
git worktree add --detach ../experiment HEAD~5
```

### List Worktrees

```bash
git worktree list
# Output:
# /home/user/project           abc1234 [main]
# /home/user/project-feature   def5678 [feature-x]
```

### Remove and Manage

```bash
# Remove worktree (working directory must be clean)
git worktree remove ../feature-x

# Force remove (discards uncommitted changes)
git worktree remove --force ../feature-x

# Lock worktree (prevents pruning if on removable storage)
git worktree lock --reason "On USB drive" ../feature-x

# Prune stale worktree metadata
git worktree prune
```

### Quick Workflow: Feature + Hotfix

```bash
# Create worktree for hotfix
git worktree add -b hotfix-456 ../project-hotfix origin/main
cd ../project-hotfix
git add . && git commit -m "fix: resolve critical bug"
git push origin hotfix-456
cd ../project
git worktree remove ../project-hotfix
```

### Quick Workflow: PR Review

```bash
git fetch origin pull/123/head:pr-123
git worktree add ../project-review pr-123
cd ../project-review
# Review code, run tests
cd ../project
git worktree remove ../project-review
git branch -d pr-123
```

## References

See [references/](references/) for detailed documentation:

- [workflow-patterns.md](references/workflow-patterns.md) - Detailed workflow patterns for parallel development
- [comparing-merging.md](references/comparing-merging.md) - Comparing and merging between worktrees
- [troubleshooting.md](references/troubleshooting.md) - Common issues, best practices, verification checklist
