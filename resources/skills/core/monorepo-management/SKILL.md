---
name: monorepo-management
description: "Run this when setting up or working with monorepos — guides Turborepo, Nx, and pnpm workspace configuration and management."
origin: lamella
---

# Monorepo Management

Use this skill for both monorepo setup and monorepo orientation. Start by
mapping the workspace before changing build or dependency behavior.

## Contents

- [When to Use](#when-to-use)
- [Turborepo Setup](#turborepo-setup)
- [pnpm Workspaces](#pnpm-workspaces)
- [Nx](#nx)
- [Code Sharing Patterns](#code-sharing-patterns)
- [CI/CD](#cicd)
- [Publishing with Changesets](#publishing-with-changesets)
- [Guidelines](#guidelines)
- [Common Pitfalls](#common-pitfalls)

## When to Use

- Setting up a new monorepo
- Migrating from multi-repo
- Mapping existing workspace packages and internal dependencies
- Optimizing build and CI performance
- Managing shared dependencies and code sharing
- Versioning and publishing packages

## Workspace Mapping

Use the bundled analyzer to detect workspace tooling, package roots, and
internal dependency edges before planning changes:

```bash
python3 scripts/monorepo_analyzer.py /path/to/monorepo
python3 scripts/monorepo_analyzer.py /path/to/monorepo --json
```

## Turborepo Setup

### turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"]
    },
    "lint": {
      "outputs": []
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "dev": { "cache": false, "persistent": true }
  }
}
```

### Remote Caching

```bash
npx turbo login && npx turbo link  # Vercel remote cache
```

## pnpm Workspaces

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
```

```bash
pnpm add react --filter @repo/ui        # Add to specific package
pnpm add @repo/ui --filter web           # Add workspace dependency
pnpm --filter "...web" build             # Build web and its deps
pnpm -r --parallel dev                   # Dev all packages in parallel
```

## Nx

```bash
npx create-nx-workspace@latest my-org
nx affected -t test --base=main          # Test only affected projects
nx graph                                 # Visualize dependency graph
```

Key Nx concept: use tags (`type:feature`, `scope:web`) with `@nx/enforce-module-boundaries` to enforce architecture rules via ESLint.

## Code Sharing Patterns

### Shared UI Components
```typescript
// packages/ui/src/index.ts
export { Button, type ButtonProps } from './button';

// apps/web/src/app.tsx
import { Button } from '@repo/ui';
```

### Shared Types
```typescript
// packages/types/src/user.ts -- used in both frontend and backend
export interface User { id: string; email: string; role: "admin" | "user"; }
```

### Shared Configs
Centralize ESLint, TypeScript, and Prettier configs in packages. Apps extend them:
```json
{ "extends": "@repo/tsconfig/react.json" }
```

## CI/CD

```yaml
# .github/workflows/ci.yml
steps:
  - uses: actions/checkout@v3
    with: { fetch-depth: 0 }
  - uses: pnpm/action-setup@v2
  - run: pnpm install --frozen-lockfile
  - run: pnpm turbo run build test lint
```

## Publishing with Changesets

```bash
pnpm add -Dw @changesets/cli
pnpm changeset init
pnpm changeset         # Create changeset
pnpm changeset version # Version packages
pnpm changeset publish # Publish
```

## Guidelines

- Lock dependency versions across workspace
- Keep dependency graph acyclic
- Configure cache inputs/outputs correctly to avoid stale builds
- Share types between frontend and backend
- Use changesets for versioning
- Scope CI and local commands to affected packages whenever the toolchain supports it
- Keep a repo map so shared-package changes do not surprise downstream apps

## Common Pitfalls

- Circular dependencies (A depends on B, B depends on A)
- Phantom dependencies (using deps not in package.json -- pnpm strict mode catches this)
- Incorrect cache inputs causing stale builds
- Over-sharing code that should be separate

## References

- `references/monorepo-patterns.md`
- `references/monorepo-tooling-reference.md`
