---
name: gitops-workflow
description: "Implements GitOps deployments with ArgoCD, Flux, and reconciliation."
origin: lamella
---

# GitOps Workflow

Use this skill when setting up or reviewing GitOps delivery for Kubernetes.

## Core Rules

1. keep desired state declarative and versioned in Git
2. let agents pull and reconcile instead of pushing imperative changes
3. separate bootstrap, sync policy, and progressive delivery concerns
4. treat secret handling as part of the GitOps design, not an afterthought

## Core Workflow

1. choose ArgoCD or Flux based on the operating model
2. define repository structure and reconciliation scope
3. configure sync and prune behavior deliberately
4. layer in progressive delivery and secret management

## References

- [references/argocd-setup.md](references/argocd-setup.md)
- [references/sync-policies.md](references/sync-policies.md)
