# Commit Workflow

Create well-formatted commits with conventional commit messages and emoji.

## Trigger
- Manual: When ready to commit changes

## Execution Steps

1. **Branch check**: Check if current branch is `master` or `main`. If so, ask whether to create a separate branch before committing.
2. **Pre-commit checks**: Unless `--no-verify`, run pre-commit checks (lint, build)
3. **Stage files**: Check staged files with `git status`. If 0 files staged, add all modified files
4. **Analyze diff**: `git diff` to understand changes
5. **Split check**: Determine if multiple distinct logical changes are present
6. **Commit**: Create commit message using emoji conventional commit format

## Agent Chain

```
┌─────────────────────────────────────────────────┐
│  1. Pre-commit validation                       │
│     - Run linter (pnpm lint / npm run lint)     │
│     - Run build if applicable                   │
│     - Skip with --no-verify flag                │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  2. Stage management                            │
│     - git status to check staged files          │
│     - git add if nothing staged                 │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  3. Diff analysis                               │
│     - git diff for change review                │
│     - Identify logical groupings                │
│     - Suggest splits if needed                  │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  4. Commit creation                             │
│     - Generate conventional commit message      │
│     - Add appropriate emoji                     │
│     - Execute git commit                        │
└─────────────────────────────────────────────────┘
```

## Conventional Commit Format

```
<emoji> <type>: <description>
```

### Commit Types with Emoji

| Emoji | Type | Description |
|-------|------|-------------|
| ✨ | feat | New feature |
| 🐛 | fix | Bug fix |
| 📝 | docs | Documentation |
| 💄 | style | Formatting/style |
| ♻️ | refactor | Code refactoring |
| ⚡️ | perf | Performance improvements |
| ✅ | test | Tests |
| 🔧 | chore | Tooling, configuration |
| 🚀 | ci | CI/CD improvements |
| 🗑️ | revert | Reverting changes |
| 🔒️ | fix | Fix security issues |
| 🚚 | refactor | Move or rename resources |
| 🏗️ | refactor | Architectural changes |
| ➕ | chore | Add a dependency |
| ➖ | chore | Remove a dependency |
| 🏷️ | feat | Add or update types |
| 💥 | feat | Breaking changes |
| ♿️ | feat | Accessibility improvements |
| 🗃️ | db | Database changes |
| 🚨 | fix | Fix linter warnings |
| 🚑️ | fix | Critical hotfix |
| 💚 | fix | Fix CI build |
| ⚰️ | refactor | Remove dead code |

## Guidelines for Splitting Commits

Split commits when changes involve:
1. **Different concerns**: Changes to unrelated parts of the codebase
2. **Different types**: Mixing features, fixes, refactoring
3. **File patterns**: Source code vs documentation
4. **Logical grouping**: Changes easier to understand separately
5. **Size**: Very large changes that would be clearer if broken down

## Example Commit Messages

Good commit messages:
- ✨ feat: add user authentication system
- 🐛 fix: resolve memory leak in rendering process
- 📝 docs: update API documentation with new endpoints
- ♻️ refactor: simplify error handling logic in parser
- 🔒️ fix: strengthen authentication password requirements

Example split commits:
1. ✨ feat: add new solc version type definitions
2. 📝 docs: update documentation for new solc versions
3. 🔧 chore: update package.json dependencies
4. ✅ test: add unit tests for new solc version features

## Branch Naming Convention

When committing on `master` or `main`, create a branch with pattern:

```
<type>/<git-username>/<description>
```

Examples:
- `feature/leovs09/add-new-command`
- `fix/johndoe/resolve-memory-leak`
- `docs/alice/update-api-docs`

## Best Practices

- **Verify before committing**: Ensure code is linted and builds correctly
- **Atomic commits**: Each commit serves a single purpose
- **Present tense, imperative mood**: "add feature" not "added feature"
- **Concise first line**: Keep under 72 characters
- **Always review diff**: Ensure message matches changes

## Command Options

| Option | Effect |
|--------|--------|
| `--no-verify` | Skip pre-commit checks (lint, build) |
