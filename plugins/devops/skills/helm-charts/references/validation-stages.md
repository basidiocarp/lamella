# Validation Stages

Use this page as the routing layer for Helm chart validation workflow.

## Load Order

| Need | Reference |
| --- | --- |
| tool readiness and chart structure | `validation-tooling-and-structure.md` |
| render, lint, and YAML checks | `render-and-yaml-validation.md` |
| schema, cluster dry-run, and reporting | `schema-cluster-and-reporting.md` |

## Core Rules

- keep validation stages explicit and ordered
- report skipped stages clearly when tooling or access is missing
- fix source templates, not rendered output
