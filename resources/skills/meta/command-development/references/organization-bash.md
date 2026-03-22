# Command Organization and Bash Execution

Reference for organizing commands and using bash execution in Claude Code slash commands.

## Bash Execution in Commands

Commands can execute bash commands inline to dynamically gather context before Claude processes the command. This is useful for including repository state, environment information, or project-specific context.

**When to use:**
- Include dynamic context (git status, environment vars, etc.)
- Gather project/repository state
- Build context-aware workflows

**Syntax:** Use `!` followed by backtick-wrapped command:
```markdown
Files changed: !`git diff --name-only`
```

**Best Practices:**
1. **Limit scope:** Use `Bash(git:*)` not `Bash(*)`
2. **Safe commands:** Avoid destructive operations
3. **Handle errors:** Consider command failures
4. **Keep fast:** Long-running commands slow invocation

## Command Organization

### Flat Structure

Simple organization for small command sets:

```
.claude/commands/
├── build.md
├── test.md
├── deploy.md
├── review.md
└── docs.md
```

**Use when:** 5-15 commands, no clear categories

### Namespaced Structure

Organize commands in subdirectories:

```
.claude/commands/
├── ci/
│   ├── build.md        # /build (project:ci)
│   ├── test.md         # /test (project:ci)
│   └── lint.md         # /lint (project:ci)
├── git/
│   ├── commit.md       # /commit (project:git)
│   └── pr.md           # /pr (project:git)
└── docs/
    ├── generate.md     # /generate (project:docs)
    └── publish.md      # /publish (project:docs)
```

**Benefits:**
- Logical grouping by category
- Namespace shown in `/help`
- Avoid name conflicts
- Organize related commands

**Use when:** 15+ commands, clear categories

## Organization Decision Guide

| Commands | Categories | Recommendation |
|----------|------------|----------------|
| 1-5 | Any | Flat structure |
| 5-15 | Unclear | Flat structure |
| 5-15 | Clear | Namespaced optional |
| 15+ | Any | Namespaced required |

## Naming Conventions

- Use verb-noun pattern: `review-pr`, `fix-issue`, `generate-docs`
- Use hyphens for multi-word names
- Avoid generic names: `run`, `do`, `action`
- Be descriptive: `deploy-staging` vs just `deploy`
