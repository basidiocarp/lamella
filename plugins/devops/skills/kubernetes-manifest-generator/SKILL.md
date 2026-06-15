---
name: kubernetes-manifest-generator
description: "Creates production-ready Kubernetes manifests for Deployments, Services, ConfigMaps, and Secrets."
origin: lamella
---

# Kubernetes Manifest Generator


## Contents

- [Purpose](#purpose)
- [When to Use This Skill](#when-to-use-this-skill)
- [Step-by-Step Workflow](#step-by-step-workflow)
- [Best Practices Summary](#best-practices-summary)
- [Reference Files](#reference-files)
- [Related Skills](#related-skills)


## Purpose

This skill provides comprehensive guidance for generating well-structured, secure, and production-ready Kubernetes manifests following cloud-native best practices and Kubernetes conventions.

## When to Use This Skill

Use this skill when you need to:

- Create new Kubernetes Deployment manifests
- Define Service resources for network connectivity
- Generate ConfigMap and Secret resources for configuration management
- Create PersistentVolumeClaim manifests for stateful workloads
- Follow Kubernetes best practices and naming conventions
- Implement resource limits, health checks, and security contexts
- Design manifests for multi-environment deployments

## Step-by-Step Workflow

### 1. Gather Requirements

**Understand the workload:**

- Application type (stateless/stateful)
- Container image and version
- Environment variables and configuration needs
- Storage requirements
- Network exposure requirements (internal/external)
- Resource requirements (CPU, memory)
- Scaling requirements
- Health check endpoints

### 2. Create Deployment Manifest

**Best practices to apply:**

- Always set resource requests and limits
- Implement both liveness and readiness probes
- Use specific image tags (never `:latest`)
- Apply security context for non-root users
- Use labels for organization and selection
- Set appropriate replica count based on availability needs

**Reference:** See `references/manifest-templates.md` for full deployment template

### 3. Create Service Manifest

**Choose the appropriate Service type:**

- **ClusterIP** - internal only
- **LoadBalancer** - external access
- **NodePort** - for development/testing

**Reference:** See `references/manifest-templates.md` for service templates

### 4. Create ConfigMap and Secret

**Best practices:**

- Use ConfigMaps for non-sensitive data only
- Never commit secrets to Git in plain text
- Use Sealed Secrets, External Secrets Operator, or Vault
- Rotate secrets regularly

**Reference:** See `references/manifest-templates.md` for examples

### 5. Apply Security Best Practices

**Security checklist:**

- [ ] Run as non-root user
- [ ] Drop all capabilities
- [ ] Use read-only root filesystem
- [ ] Disable privilege escalation
- [ ] Set seccomp profile
- [ ] Use Pod Security Standards

**Reference:** See `references/manifest-templates.md` for security context template

### 6. Validate and Test

```bash
# Dry-run validation
kubectl apply -f manifest.yaml --dry-run=client

# Server-side validation
kubectl apply -f manifest.yaml --dry-run=server

# Validate with kubeval
kubeval manifest.yaml
```

## Best Practices Summary

1. **Always set resource requests and limits** - Prevents resource starvation
2. **Implement health checks** - Ensures Kubernetes can manage your application
3. **Use specific image tags** - Avoid unpredictable deployments
4. **Apply security contexts** - Run as non-root, drop capabilities
5. **Use ConfigMaps and Secrets** - Separate config from code
6. **Label everything** - Enables filtering and organization
7. **Follow naming conventions** - Use standard Kubernetes labels
8. **Validate before applying** - Use dry-run and validation tools
9. **Version your manifests** - Keep in Git with version control
10. **Document with annotations** - Add context for other developers

## Reference Files

- `references/manifest-templates.md` - Full templates for Deployment, Service, ConfigMap, Secret, PVC, and Security Context
- `references/common-patterns.md` - Common patterns (stateless web app, stateful database, cron jobs, multi-container pods)
- `references/troubleshooting.md` - Debugging pods, services, and common issues

## Related Skills

- `helm-charts` - For templated Kubernetes deployments
- `kustomize` - For environment-specific overlays
- `argocd` - For GitOps deployments
### Additional Resources

- [Configmap Template](assets/configmap-template.yaml)
- [Deployment Template](assets/deployment-template.yaml)
- [Service Template](assets/service-template.yaml)
- [Deployment Spec](references/deployment-spec.md)
- [Service Spec](references/service-spec.md)
