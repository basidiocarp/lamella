---
name: git-cleanup
description: "Safely analyze and clean up local git branches and worktrees. Use when cleaning up accumulated branches and worktrees, removing merged branches, or tidying local git state."
metadata:
  disable-model-invocation: true
---# Git Cleanup

Safely clean up accumulated git worktrees and local branches by categorizing them into: safely deletable (merged), potentially related (similar themes), and active work (keep).

## When to Use

- When the user has accumulated many local branches and worktrees
- When branches have been merged but not cleaned up locally
- When remote branches have been deleted but local tracking branches remain

## When NOT to Use

- Do not use for remote branch management (this is local cleanup only)
- Do not use for repository maintenance tasks like gc or prune
- Not designed for headless or non-interactive automation (requires user confirmations at two gates)

## Core Principle: SAFETY FIRST

**Never delete anything without explicit user confirmation.** This skill uses a gated workflow where users must approve each step before any destructive action.

## Critical Implementation Notes

### Squash-Merged Branches Require Force Delete

**IMPORTANT:** `git branch -d` will ALWAYS fail for squash-merged branches because git cannot detect that the work was incorporated. This is expected behavior, not an error.

When you identify a branch as squash-merged:
- Plan to use `git branch -D` (force delete) from the start
- Do NOT try `git branch -d` first and then ask again for `-D` - this wastes user confirmations
- In the confirmation step, show `git branch -D` for squash-merged branches

### Group Related Branches BEFORE Categorization

**MANDATORY:** Before categorizing individual branches, group them by name prefix:

```bash
# Extract common prefixes from branch names

## Contents

- [When to Use](#when-to-use)
// ... (25 lines trimmed)


# e.g., feature/auth-*, feature/api-*, fix/login-*
```

Branches sharing a prefix (e.g., `feature/api`, `feature/api-v2`, `feature/api-refactor`) are almost certainly related iterations. Analyze them as a group:

1. Find the oldest and newest by commit date
2. Check if newer branches contain commits from older ones
3. Check which PRs merged work from each
4. Determine if older branches are superseded

Present related branches together with a clear recommendation, not scattered across categories.

### Thorough PR History Investigation

Don't rely on simple keyword matching. For `[gone]` branches:

```bash
# 1. Get the branch's commits that aren't in default branch
git log --oneline "$default_branch".."$branch"

# 2. Search default branch for PRs that incorporated this work
# Search by: branch name, commit message keywords, PR numbers
git log --oneline "$default_branch" | grep -iE "(branch-name|keyword|#[0-9]+)"

# 3. For related branch groups, trace which PRs merged which work
git log --oneline "$default_branch" | grep -iE "(#[0-9]+)" | head -20
```

## Workflow

### Phase 1: Comprehensive Analysis

Gather ALL information upfront before any categorization:

```bash
# Get default branch name
default_branch=$(git symbolic-ref refs/remotes/origin/HEAD \
  2>/dev/null | sed 's@^refs/remotes/origin/@@' || echo "main")

# Protected branches - never analyze or delete
// ... (25 lines trimmed)
  git log --oneline "origin/$branch".."$branch" 2>/dev/null \
    | head -5 || echo "(no remote tracking)"
done
```

**Note on branch names:** Git branch names can contain characters that break shell expansion. Always quote `"$branch"` in commands.

### Phase 2: Group Related Branches

**Do this BEFORE individual categorization.**

Identify branch groups by shared prefixes:

```bash
# List branches and extract prefixes
git branch --format='%(refname:short)' | sed 's/-[^-]*$//' | sort | uniq -c | sort -rn
```

For each group with 2+ branches:

1. **Compare commit histories** - Which branches contain commits from others?
2. **Find merge evidence** - Which PRs incorporated work from this group?
3. **Identify the "final" branch** - Usually the most recent or most complete
4. **Mark superseded branches** - Older iterations whose work is in main or in a newer branch

**SUPERSEDED requires evidence, not just shared prefix:**
- A PR merged the work into main, OR
- A newer branch contains all commits from the older branch
- Name prefix alone is NOT sufficient — similarly named branches may contain independent work

Example analysis for `feature/api-*` branches:

```markdown
### Related Branch Group: feature/api-*

| Branch | Commits | PR Merged | Status |
|--------|---------|-----------|--------|
| feature/api | 12 | #29 (initial API) | Superseded - work in main |
| feature/api-v2 | 8 | #45 (API improvements) | Superseded - work in main |
| feature/api-refactor | 5 | #67 (refactor) | Superseded - work in main |
| feature/api-final | 4 | None found | Superseded by above PRs |

**Recommendation:** All 4 branches can be deleted - work incorporated via PRs #29, #45, #67
```

### Phase 3: Categorize Remaining Branches

For branches NOT in a related group, categorize individually:

```
Is branch merged into default branch?
├─ YES → SAFE_TO_DELETE (use -d)
└─ NO → Is tracking a remote?
        ├─ YES → Remote deleted? ([gone])
// ... (7 lines trimmed)
                ├─ YES → LOCAL_WORK (keep)
                └─ NO → SAFE_TO_DELETE (use -d)
```

**Category definitions:**

| Category | Meaning | Delete Command |
|----------|---------|----------------|
| SAFE_TO_DELETE | Merged into default branch | `git branch -d` |
| SQUASH_MERGED | Work incorporated via squash merge | `git branch -D` |
| SUPERSEDED | Part of a group, work verified in main via PR or in newer branch | `git branch -D` |
| REMOTE_GONE | Remote deleted, work NOT found in main | Review needed |
| UNPUSHED_WORK | Has commits not pushed to remote | Keep |
| LOCAL_WORK | Untracked branch with unique commits | Keep |
| SYNCED_WITH_REMOTE | Up to date with remote | Keep |

### Phase 4: Dirty State Detection

Check ALL worktrees and current directory for uncommitted changes:

```bash
# For each worktree path
git -C <worktree-path> status --porcelain

# For current directory
git status --porcelain
```

**Display warnings prominently:**

```markdown
WARNING: ../proj-auth has uncommitted changes:
  M  src/auth.js
  ?? new-file.txt

These changes will be LOST if you remove this worktree.
```

### GATE 1: Present Complete Analysis

Present everything in ONE comprehensive view. Group related branches together:

```markdown
## Git Cleanup Analysis

### Related Branch Groups

**Group: feature/api-* (4 branches)**
// ... (45 lines trimmed)
- 1 to keep

Which would you like to clean up?
```

Use AskUserQuestion with clear options:
- Delete all recommended (groups + merged + squash-merged)
- Delete specific groups/categories
- Let me pick individual branches

**Do not proceed until user responds.**

### GATE 2: Final Confirmation with Exact Commands

Show the EXACT commands that will run, with correct flags:

```markdown
I will execute:

# Merged branches (safe delete)
git branch -d fix/typo

// ... (8 lines trimmed)
git worktree remove ../proj-auth

Confirm? (yes/no)
```

**IMPORTANT:** This is the ONLY confirmation needed for deletion. Do not add extra confirmations if `-D` is required.

### Phase 5: Execute

Run each deletion as a **separate command** so partial failures don't block remaining deletions. Report the result of each:

```bash
git branch -d fix/typo
git branch -D feature/login
git branch -D feature/api
git branch -D feature/api-v2
git branch -D feature/api-refactor
git branch -D feature/api-final
git worktree remove ../proj-auth
```

If a deletion fails, report the error and continue with remaining deletions.

### Phase 6: Report

```markdown
## Cleanup Complete

### Deleted
- fix/typo
- feature/login
// ... (9 lines trimmed)
| main | current |
| wip/new-feature | active work |
| experiment/old | needs review |
```

## Safety Rules

1. **Never invoke automatically** - Only run when user explicitly uses `/git-cleanup`
2. **Two confirmation gates only** - Analysis review, then deletion confirmation
3. **Use correct delete command** - `-d` for merged, `-D` for squash-merged/superseded
4. **Never touch protected branches** - main, master, develop, release/* (filtered programmatically)
5. **Block dirty worktree removal** - Refuse without explicit data loss acknowledgment
6. **Group related branches** - Don't scatter them across categories

## Rationalizations to Reject

These are common shortcuts that lead to data loss. Reject them:

| Rationalization | Why It's Wrong |
|-----------------|----------------|
| "The branch is old, it's probably safe to delete" | Age doesn't indicate merge status. Old branches may contain unmerged work. |
| "I can recover from reflog if needed" | Reflog entries expire. Users often don't know how to use reflog. Don't rely on it as a safety net. |
| "It's just a local branch, nothing important" | Local branches may contain the only copy of work not pushed anywhere. |
| "The PR was merged, so the branch is safe" | Squash merges don't preserve branch history. Verify the *specific* commits were incorporated. |
| "I'll just delete all the `[gone]` branches" | `[gone]` only means the remote was deleted. The local branch may have unpushed commits. |
| "The user seems to want everything deleted" | Always present analysis first. Let the user choose what to delete. |
| "The branch has commits not in main, so it has unpushed work" | "Not in main" ≠ "not pushed". A branch can be synced with its remote but not merged to main. Always check `git log origin/<branch>..<branch>`. |

## Advanced Git Operations

Quick reference for complex Git operations beyond cleanup.

### Interactive Rebase
```bash
git rebase -i $(git merge-base HEAD main)  # All commits on current branch
git push --force-with-lease origin feature  # Safe force push
git commit --fixup HEAD && git rebase -i --autosquash main  # Autosquash workflow
```

### Cherry-Pick
```bash
git cherry-pick abc123          # Single commit
git cherry-pick abc123..def456  # Range (exclusive start)
git cherry-pick -n abc123       # Stage without committing
```

### Git Bisect
```bash
git bisect start && git bisect bad HEAD && git bisect good v2.1.0
# Automated:
git bisect start HEAD v2.1.0 && git bisect run npm test
git bisect reset
```

### Worktrees
```bash
git worktree add ../project-hotfix hotfix/critical-bug
git worktree remove ../project-hotfix  # Clean up when done
```

### Recovery
```bash
git reflog                        # Find lost commits (90-day window)
git reset --hard def456           # Recover to specific point
git branch recovered abc123       # Recreate deleted branch
git rebase --abort                # Abort in-progress rebase
git restore --source=abc123 path  # Restore file from commit
```

**Rules:** Always `--force-with-lease` (never bare `--force`). Never rebase shared/pushed commits. Create backup branch before risky rebases.
