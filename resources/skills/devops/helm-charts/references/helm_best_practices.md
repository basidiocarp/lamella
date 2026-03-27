# Helm Chart Best Practices

Use this file as the top-level checklist for Helm chart authoring. The detailed
examples now live in focused references.

## Load Order

| Need | Reference |
| --- | --- |
| Chart layout, metadata, dependencies, hooks, and packaging | `chart-structure.md` |
| Example templates for common chart files | `chart-templates.md` |
| Template authoring techniques and helper usage | `templating-best-practices.md` |
| Helm/Sprig function usage | `template_functions.md` |
| Kubernetes metadata, selectors, probes, and workload safety | `k8s_best_practices.md` |
| Validation and release checks | `validation-stages.md` |

## Core Rules

- Keep charts installable with sane defaults.
- Prefer reusable helpers over repeated template fragments.
- Keep Kubernetes safety defaults explicit in rendered workloads.
- Validate charts before release instead of relying on install-time discovery.
- Keep packaging and versioning intentional.

## Review Checklist

- Is the chart layout obvious and internally consistent?
- Are helpers, defaults, and required values used deliberately?
- Are probes, resources, and security context represented in workload templates?
- Are validation, packaging, and upgrade checks part of the release path?
