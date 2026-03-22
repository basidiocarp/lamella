# Git Integration

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code change without feature/fix
- `test`: Adding tests
- `docs`: Documentation
- `chore`: Maintenance

## Git Notes for Rich Summaries

Attach detailed notes to commits:

```bash
git notes add -m "<detailed summary>"
```

View notes:

```bash
git log --show-notes
```

Benefits:

- Preserves context without cluttering commit message
- Enables semantic queries across commits
- Supports track-based operations

## SHA Recording in plan.md

Always record the commit SHA when completing tasks:

```markdown
- [x] **Task 1.1**: Setup schema `abc1234`
- [x] **Task 1.2**: Add model `def5678`
```

This enables:

- Traceability from plan to code
- Semantic revert operations
- Progress auditing

## Verification Checkpoints

### Why Checkpoints Matter

Checkpoints create restore points for semantic reversion:

- Revert to end of any phase
- Maintain logical code state
- Enable safe experimentation

### When to Create Checkpoints

Create checkpoint after:

- All phase tasks complete
- All phase verifications pass
- User approval received

### Checkpoint Commit Content

Include in checkpoint commit:

- All uncommitted changes
- Updated plan.md
- Updated metadata.json
- Any documentation updates

### How to Use Checkpoints

For reverting:

```bash
# Revert to end of Phase 1
git revert --no-commit <phase-2-commits>...
git commit -m "revert: rollback to phase 1 checkpoint"
```

For review:

```bash
# See what changed in Phase 2
git diff <phase-1-sha>..<phase-2-sha>
```
