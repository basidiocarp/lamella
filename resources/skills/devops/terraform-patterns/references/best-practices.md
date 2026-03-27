# Terraform Best Practices

Use this file as the top-level checklist. Load the focused references below for
the detailed examples.

## Load Order

| Need | Reference |
| --- | --- |
| Module structure, reusable composition, example layout | `module-patterns.md` |
| DRY patterns, naming, file layout, data source usage | `code-organization.md` |
| Secrets, encryption, least privilege, tagging, cost controls | `security-and-cost.md` |
| Provider pinning, alias boundaries, upgrade discipline | `provider-versioning.md` |

## Core Rules

- Keep modules small enough to explain in one README.
- Prefer data sources, locals, and `for_each` over duplicated blocks.
- Keep credentials and sensitive values outside Terraform code.
- Tag resources consistently so ownership, environment, and cost are obvious.
- Make upgrade, plan, and state behavior predictable before merging changes.

## Review Checklist

- Is there one clear module boundary, or is the stack hiding multiple concerns?
- Are names, tags, and file layout consistent across the stack?
- Are provider versions pinned and credentials handled outside the codebase?
- Are security, encryption, and least-privilege controls explicit?
- Are production cost-affecting defaults deliberate rather than inherited?
