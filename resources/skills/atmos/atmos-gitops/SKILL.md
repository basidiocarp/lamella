---
name: atmos-gitops
description: "Implements Atmos CI/CD workflows with GitHub Actions, Spacelift, Atlantis, and affected-stack detection."
origin: lamella
---

# Atmos GitOps and CI/CD Integrations

Use this skill when wiring Atmos stacks into CI/CD platforms. Keep the main skill focused on change detection, plan/apply flow, and platform choice; use the references for implementation details.

## When to Use

- Building GitHub Actions workflows around `atmos describe affected`
- Mapping Atmos stacks into Spacelift
- Deciding whether a stack should be driven by GitHub Actions, Atlantis, or Spacelift
- Reviewing promotion, drift detection, or matrix fan-out patterns

## Core Workflow

1. Start with `atmos describe affected` and confirm the output shape your CI system needs.
2. Decide where plan and apply run, and how credentials are injected.
3. Keep PR-time work read-only where possible and move apply to merge or explicit approval.
4. Add grouping or reusable workflows before the matrix becomes too large to manage.
5. Validate promotion, drift handling, and rollback paths separately from the happy path.

## Quick Commands

```shell
atmos describe affected --format json
atmos describe affected --repo-path . --sha-from main --sha-to HEAD --format json
```

```powershell
atmos describe affected --format json
atmos describe affected --repo-path . --sha-from main --sha-to HEAD --format json
```

## References

- [references/github-actions.md](references/github-actions.md)
- [references/spacelift.md](references/spacelift.md)
