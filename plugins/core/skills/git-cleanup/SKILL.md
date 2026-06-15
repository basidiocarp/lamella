---
name: git-cleanup
description: "Run this when local git branches have accumulated and need review for deletion — safely analyzes, groups, and confirms before cleanup."
metadata:
  disable-model-invocation: true
origin: lamella
---
# Git Cleanup

Use this skill for local branch and worktree cleanup only. The priority is safe analysis, explicit grouping, and two confirmation gates before any destructive command runs.

## When to Use

- Local branches have accumulated and likely include merged or superseded work
- Worktrees may no longer be needed
- Tracking branches show `[gone]` and need review

## Do Not Use For

- Remote branch deletion
- `git gc`, `git prune`, or repository maintenance
- Unattended destructive automation

## Safety Rules

1. Never delete anything without explicit confirmation.
2. Group related branches before categorizing them individually.
3. Treat squash-merged branches as `git branch -D` cases from the start.
4. Check every worktree for uncommitted changes before proposing removal.

## Core Workflow

1. Detect the default branch and protected branches.
2. Gather branch status, ahead/behind state, `[gone]` tracking info, and worktree state.
3. Group branches by prefix or obvious lineage and determine whether older branches are superseded.
4. Categorize findings into merged, squash-merged, superseded, keep, or manual-review buckets.
5. Present one analysis view, wait for approval, then present the exact delete commands for a second confirmation.

## Required Categories

| Category | Meaning | Expected action |
|----------|---------|-----------------|
| `SAFE_TO_DELETE` | merged normally | `git branch -d` |
| `SQUASH_MERGED` | work incorporated via squash merge | `git branch -D` |
| `SUPERSEDED` | older branch proven unnecessary | `git branch -D` |
| `REMOTE_GONE` | remote deleted, merge status unclear | manual review |
| `UNPUSHED_WORK` | local commits not on remote | keep |
| `LOCAL_WORK` | untracked branch with unique commits | keep |
| `SYNCED_WITH_REMOTE` | active or neutral branch | keep |

## Minimum Analysis Commands

```shell
git branch -vv
git worktree list
git status --porcelain
git log --oneline origin/main..my-branch
```

## Output Contract

- Show related branch groups first.
- Show dirty worktree warnings prominently.
- Use two gates:
  - analysis approval
  - exact-command approval
