---
description: Fix build, compile, and typecheck failures one issue at a time
argument-hint: [optional error summary]
---

# Build and Fix

Incrementally fix build and type errors with minimal, safe changes.

## Step 1: Detect Build System

Identify the project's build or typecheck command and run the narrowest reliable check first:

| Indicator | Build Command |
|-----------|---------------|
| `package.json` with `build` script | `npm run build` or `pnpm build` |
| `tsconfig.json` (TypeScript only) | `npx tsc --noEmit` |
| `Cargo.toml` | `cargo build 2>&1` |
| `pom.xml` | `mvn compile` |
| `build.gradle` | `./gradlew compileJava` |
| `go.mod` | `go build ./...` |
| `pyproject.toml` | `python -m py_compile` or `mypy .` |

If the user already provided a specific failing command, prefer that over autodetection.

## Step 2: Parse and Group Errors

1. Run the chosen command and capture the current failures.
2. Group errors by file path or subsystem.
3. Fix prerequisite errors first: syntax, imports, generated types, and broken interfaces before downstream logic errors.
4. Keep track of what is resolved and what still remains.

## Step 3: Fix Loop

For each error:

1. **Read the file** to inspect the failure context.
2. **Diagnose** the root cause.
3. **Fix minimally** and avoid speculative refactors.
4. **Re-run the same check** to confirm the current error is gone.
5. **Move to the next failure** once the current one is resolved.

## Step 4: Guardrails

Stop and ask the user if:
- a fix introduces more errors than it resolves
- the same error persists after 3 attempts
- the fix requires architectural change rather than a narrow repair
- the repo needs dependency installation, generated files, or external services the session cannot safely infer

## Step 5: Summary

Show:
- errors fixed
- files changed
- errors remaining
- the next recommended action if the build still fails

## Recovery Strategies

| Situation | Action |
|-----------|--------|
| Missing module or import | Check whether the dependency or generated file exists before editing call sites |
| Type mismatch | Read the surrounding types and fix the narrowest incompatible boundary |
| Circular dependency | Identify the cycle and stop if resolving it requires design work |
| Version conflict | Inspect the relevant manifest or lockfile before changing code |
| Build tool misconfiguration | Read the config file and compare it with the repo's normal conventions |

Prefer minimal diffs over refactoring. Switch to [`/smart-fix`](smart-fix.md) if the issue turns into a broader incident or design failure.
