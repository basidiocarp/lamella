---
name: atmos-helmfile
description: "Orchestrates Helmfile operations, Kubernetes deployments, varfile generation, EKS integration, and source management through Atmos."
origin: lamella
---

# Atmos Helmfile Orchestration

Use this skill when running Helmfile through Atmos stack context. Keep the main skill focused on stack resolution, varfile generation, and cluster targeting; use the commands reference for the detailed command surface.

## When to Use

- Running `diff`, `apply`, `sync`, `destroy`, or `deploy` through Atmos
- Resolving Helmfile component inheritance from stack manifests
- Wiring EKS-backed kubeconfig generation into deployments
- Reviewing source-based component provisioning or runtime flags

## Core Workflow

1. Confirm the target stack and Helmfile component resolve correctly.
2. Verify the generated vars match the intended environment.
3. Check cluster auth before debugging Helmfile template behavior.
4. Use `diff` before `apply` or `deploy`.
5. Keep JIT vendoring and source pinning predictable across environments.

## Quick Commands

```shell
atmos helmfile diff ingress-nginx -s ue2-dev
atmos helmfile apply ingress-nginx -s ue2-dev
atmos helmfile generate varfile ingress-nginx -s ue2-dev
```

```powershell
atmos helmfile diff ingress-nginx -s ue2-dev
atmos helmfile apply ingress-nginx -s ue2-dev
atmos helmfile generate varfile ingress-nginx -s ue2-dev
```

## References

- [references/commands-reference.md](references/commands-reference.md)
