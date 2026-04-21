---
name: turborepo-caching
description: "Configures Turborepo for efficient monorepo builds with local and remote caching."
origin: lamella
---

# Turborepo Caching

## When to Use

- Setting up Turborepo build pipelines
- Implementing remote caching (Vercel or self-hosted)
- Debugging cache misses
- Optimizing CI/CD performance

## Pipeline Configuration

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": [".env", ".env.local"],
  "globalEnv": ["NODE_ENV"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**", "build/**"]
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

### Package-Specific Overrides

```json
// apps/web/turbo.json
{
  "extends": ["//"],
  "pipeline": {
    "build": {
      "outputs": [".next/**", "!.next/cache/**"],
      "env": ["NEXT_PUBLIC_API_URL"]
    }
  }
}
```

## Remote Caching

### Vercel
```bash
npx turbo login && npx turbo link
```

CI environment variables: `TURBO_TOKEN`, `TURBO_TEAM`.

### Self-Hosted
Implement a server with `GET/PUT/HEAD /v8/artifacts/:hash` endpoints. Set `turbo build --api="http://cache:3000" --token="..." --team="..."`.

## Filtering

```bash
turbo build --filter=@myorg/web           # Specific package
turbo build --filter=@myorg/web...        # Package + dependencies
turbo build --filter=...@myorg/ui         # Package + dependents
turbo build --filter='...[origin/main]'   # Changed since main
turbo build --filter='!@myorg/docs'       # Exclude package
```

## Debugging Cache

```bash
turbo build --dry-run       # See what would run
turbo build --verbosity=2   # Show hashes
turbo build --summarize     # Cache status
turbo build --force         # Skip cache
turbo build --graph         # Task graph
```

## Guidelines

- Define explicit inputs to avoid unnecessary cache invalidation.
- Use `workspace:*` protocol for internal dependencies.
- Enable remote caching for both CI and local development.
- Filter in CI to build only affected packages.
- Don't cache dev servers (use `persistent: true`).
- Don't include secrets in `env` -- use runtime environment variables.
- Respect `dependsOn` ordering to avoid race conditions.
