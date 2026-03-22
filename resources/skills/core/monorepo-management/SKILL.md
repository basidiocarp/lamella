---
name: monorepo-management
description: Monorepo management with Turborepo, Nx, and pnpm workspaces -- setup, build optimization, code sharing, and CI/CD. Use when setting up or optimizing monorepos.
---

# Monorepo Management


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
- Optimizing build and CI performance
- Managing shared dependencies and code sharing
- Versioning and publishing packages

## Turborepo Setup

### turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
// ... (8 lines trimmed)
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

## Common Pitfalls

- Circular dependencies (A depends on B, B depends on A)
- Phantom dependencies (using deps not in package.json -- pnpm strict mode catches this)
- Incorrect cache inputs causing stale builds
- Over-sharing code that should be separate
