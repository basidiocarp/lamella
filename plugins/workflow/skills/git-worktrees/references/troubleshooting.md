# Git Worktrees Troubleshooting

## Common Issues and Solutions

### Issue: "Branch is already checked out"

**Cause:** Attempting to checkout a branch that's active in another worktree.

**Solution:**

```bash
# Find where the branch is checked out
git worktree list

# Either work in that worktree or remove it first
git worktree remove ../other-worktree
```

### Issue: Stale worktree after manual deletion

**Cause:** Deleted worktree directory without using `git worktree remove`.

**Solution:**

```bash
# Clean up stale metadata
git worktree prune
```

### Issue: Worktree moved manually

**Cause:** Moved worktree directory without using `git worktree move`.

**Solution:**

```bash
# Repair the worktree links
git worktree repair
# Or specify the new path
git worktree repair /new/path/to/worktree
```

### Issue: Worktree on removed drive

**Cause:** Worktree was on removable storage that's no longer connected.

**Solution:**

```bash
# If temporary, lock it to prevent pruning
git worktree lock ../usb-worktree

# If permanent, prune it
git worktree prune
```

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Using `rm -rf` to delete worktree | Always use `git worktree remove`, then `git worktree prune` if needed |
| Forgetting branch is locked to worktree | Run `git worktree list` before checkout errors |
| Not cleaning up temporary worktrees | Remove worktrees immediately after task completion |
| Creating worktrees in nested locations | Use sibling directories (`../project-feature`) not subdirs |
| Moving worktree directory manually | Use `git worktree move` or run `git worktree repair` after |

## Best Practices

| Practice | Rationale |
|----------|-----------|
| **Use sibling directories** | Keep worktrees at same level as main project for easy navigation |
| **Name by purpose** | `project-review` is clearer than `project-pr-123` |
| **Clean up promptly** | Remove worktrees when done to avoid confusion |
| **Lock remote worktrees** | Prevent pruning if worktree is on network/USB storage |
| **Use `--detach` for experiments** | Avoid creating throwaway branches |
| **Commit before removing** | Always commit or stash before `git worktree remove` |

## Directory Structure Conventions

Organize worktrees predictably:

```
~/projects/
  myproject/              # Main worktree (main/master branch)
  myproject-feature-x/    # Feature branch worktree
  myproject-hotfix/       # Hotfix worktree
  myproject-review/       # Temporary PR review worktree
```

**Naming convention:** `<project>-<purpose>` or `<project>-<branch>`

## Verification Checklist

Before using worktrees:

- [ ] Understand that branches can only be checked out in one worktree
- [ ] Know where worktrees will be created (use sibling directories)
- [ ] Plan cleanup strategy for temporary worktrees

When creating worktrees:

- [ ] Use descriptive directory names
- [ ] Verify branch is not already checked out elsewhere
- [ ] Consider using `--detach` for experiments

When removing worktrees:

- [ ] Commit or stash any uncommitted changes
- [ ] Use `git worktree remove`, not `rm -rf`
- [ ] Run `git worktree prune` if directory was deleted manually
