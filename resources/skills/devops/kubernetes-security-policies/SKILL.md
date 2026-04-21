---
name: kubernetes-security-policies
description: "Implement Kubernetes security policies including NetworkPolicy, PodSecurityPolicy, and RBAC for production-grade security."
origin: lamella
---

# Kubernetes Security Policies

Use this skill to enforce least privilege at the cluster, namespace, pod, and network layers. Keep the main skill focused on policy selection and rollout order, not long manifest catalogs.

## When to Use

- Locking down workloads in a multi-tenant or production cluster
- Rolling out Pod Security Standards
- Adding NetworkPolicy defaults and explicit allow rules
- Hardening RBAC and admission policy coverage

## Core Workflow

1. Set namespace security posture first.
2. Add default-deny network behavior before selective allows.
3. Review RBAC for least privilege and scope creep.
4. Harden pod security contexts.
5. Add admission controls or policy engines only after the base model is clear.

## Baseline Controls

| Layer | Default Direction |
|-------|-------------------|
| Namespace posture | `restricted` unless there is a real exception |
| Network | Default deny, then explicit allow |
| RBAC | Namespace-scoped roles first, cluster-wide only when needed |
| Pod context | Non-root, drop capabilities, read-only FS where practical |
| Enforcement | Gatekeeper or similar when policy drift is recurring |

## Practical Guardrails

- Keep service accounts narrowly scoped.
- Avoid wildcard verbs and resources in RBAC.
- Permit DNS and required service-to-service traffic explicitly.
- Treat privileged namespaces as exceptions with visible justification.
- Validate policies against real workloads before enforcing cluster-wide.

## References

- [references/rbac-patterns.md](references/rbac-patterns.md)
- [assets/network-policy-template.yaml](assets/network-policy-template.yaml)
