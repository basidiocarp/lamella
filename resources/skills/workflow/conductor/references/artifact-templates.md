# Artifact Templates

Starter templates for each Conductor context artifact. Copy and fill in for new projects.

> Contributed by [@fernandezbaptiste](https://github.com/fernandezbaptiste) ([#437](https://github.com/wshobson/agents/pull/437))

## product.md

```markdown
# [Product Name]

> One-line description of what this product does.

## Problem
// ... (27 lines trimmed)

- **Phase 1**: scope
- **Phase 2**: scope
```

## tech-stack.md

```markdown
# Tech Stack

## Languages & Frameworks

| Technology | Version | Purpose |
// ... (22 lines trimmed)
|---|---|---|
| pytest | Testing (target: 80% coverage) | pyproject.toml |
| ruff | Linting + formatting | ruff.toml |
```

## workflow.md

```markdown
# Workflow

## Methodology

TDD with trunk-based development.
// ... (19 lines trimmed)
2. CI runs tests + build
3. Auto-deploy to staging
4. Manual promotion to production
```

## tracks.md

```markdown
# Tracks

## Active

| ID | Title | Status | Priority | Assignee |
|---|---|---|---|---|
| TRACK-001 | Feature name | in-progress | high | @person |

## Completed

| ID | Title | Completed |
|---|---|---|
| TRACK-000 | Initial setup | 2024-01-15 |
```

## product-guidelines.md

```markdown
# Product Guidelines

## Voice & Tone

- Professional but approachable
// ... (11 lines trimmed)

Format: `[Component] What happened. What to do next.`
Example: `[Auth] Session expired. Please sign in again.`
```
