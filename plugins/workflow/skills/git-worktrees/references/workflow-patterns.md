# Git Worktree Workflow Patterns

Use these patterns when worktrees are helping you avoid stashing or branch churn.

## Common Patterns

### Feature + Hotfix

```bash
git worktree add -b hotfix-456 ../project-hotfix origin/main
```

### PR Review in Isolation

```bash
git fetch origin pull/123/head:pr-123
git worktree add ../project-review pr-123
```

### Long-Running Test Worktree

```bash
git worktree add ../project-test main
```

## Rule

Use a worktree when the task needs a separate checkout, not as a substitute for routine branching.
