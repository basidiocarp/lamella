# Git Worktree Workflow Patterns

## Pattern 1: Feature + Hotfix in Parallel

To fix a bug while feature work is in progress:

```bash
# Create worktree for hotfix from main
git worktree add -b hotfix-456 ../project-hotfix origin/main

# Switch to hotfix directory, fix, commit, push
cd ../project-hotfix
git add . && git commit -m "fix: resolve critical bug #456"
git push origin hotfix-456

# Return to feature work
cd ../project

# Clean up when done
git worktree remove ../project-hotfix
```

## Pattern 2: PR Review While Working

To review a PR without affecting current work:

```bash
# Fetch PR branch and create worktree
git fetch origin pull/123/head:pr-123
git worktree add ../project-review pr-123

# Review: run tests, inspect code
cd ../project-review

# Return to work, then clean up
cd ../project
git worktree remove ../project-review
git branch -d pr-123
```

## Pattern 3: Compare Implementations

To compare code across branches side-by-side:

```bash
# Create worktrees for different versions
git worktree add ../project-v1 v1.0.0
git worktree add ../project-v2 v2.0.0

# Diff, compare, or run both simultaneously
diff ../project-v1/src/module.js ../project-v2/src/module.js

# Clean up
git worktree remove ../project-v1
git worktree remove ../project-v2
```

## Pattern 4: Long-Running Tasks

To run tests/builds in isolation while continuing development:

```bash
# Create worktree for CI-like testing
git worktree add ../project-test main

# Start long-running tests in background
cd ../project-test && npm test &

# Continue development in main worktree
cd ../project
```

## Pattern 5: Stable Reference

To maintain a clean main checkout for reference:

```bash
# Create permanent worktree for main branch
git worktree add ../project-main main

# Lock to prevent accidental removal
git worktree lock --reason "Reference checkout" ../project-main
```

## Pattern 6: Selective Merging from Multiple Features

To combine specific changes from multiple feature branches:

```bash
# Create worktrees for each feature to review
git worktree add ../project-feature-1 feature-1
git worktree add ../project-feature-2 feature-2

# Review changes in each worktree
// ... (13 lines trimmed)
# Clean up
git worktree remove ../project-feature-1
git worktree remove ../project-feature-2
```

## Agent Workflow Integration

To isolate parallel agent tasks:

```bash
# Create worktree for isolated task
git worktree add -b task-123 ../project-task-123
cd ../project-task-123
# Make changes, run tests, return
cd ../project
```

To experiment safely with detached HEAD:

```bash
# Create detached worktree (no branch to clean up)
git worktree add --detach ../project-experiment
cd ../project-experiment
# Experiment, then discard or commit to new branch
git worktree remove --force ../project-experiment
```
