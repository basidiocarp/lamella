# Modern GitHub Actions Features

Use this page as the routing layer for newer workflow features that need extra validation attention.

## Load Order

| Need | Reference |
| --- | --- |
| reusable workflows and typed inputs | `reusable-workflows.md` |
| OIDC and attestations | `oidc-and-attestations.md` |
| environments and job summaries | `environments-and-job-summaries.md` |
| containers, matrix, and concurrency | `containers-matrix-and-concurrency.md` |

## Core Rules

- validate permissions before validating feature syntax
- keep feature-specific examples current and scoped
- treat OIDC and attestations as security surfaces, not convenience add-ons
