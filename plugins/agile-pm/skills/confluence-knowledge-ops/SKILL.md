---
name: confluence-knowledge-ops
description: "Designs and audits Confluence spaces, page hierarchies, templates, labels, and embedded reporting."
origin: lamella
---
# Confluence Knowledge Operations

Use this skill for Confluence space design, documentation structure, template strategy, and content-health reviews.

## Reference Files

| File | Purpose |
|------|---------|
| [references/space-architecture-patterns.md](references/space-architecture-patterns.md) | Space organization models, labeling, and governance patterns |
| [references/templates.md](references/templates.md) | Reusable page templates for meetings, decisions, and specs |
| [references/macro-cheat-sheet.md](references/macro-cheat-sheet.md) | Common Confluence macro syntax and selection guidance |

## When to Use

- design a new Confluence space for a team or project
- reorganize a cluttered page tree
- standardize page templates, labels, or status patterns
- review stale, oversized, or orphaned pages
- embed Jira reporting into documentation

If the request is about org-level space permissions or Atlassian-wide administration, use `atlassian-workspace-admin` instead.

## Workflow

### 1. Define the space goal

Confirm:

- team, project, or knowledge-base audience
- whether the main problem is structure, governance, templates, or content decay
- whether the change is local to one space or broader than that

### 2. Choose the simplest space pattern

Do not invent a unique hierarchy unless the use case really needs it. Start from the patterns in `references/space-architecture-patterns.md`.

When the user needs a concrete starter tree, use the bundled generator:

```bash
python scripts/space_structure_generator.py team_info.json
python scripts/space_structure_generator.py team_info.json --format json
```

### 3. Standardize templates and macros

Pick a small set of repeatable page shapes:

- meeting notes
- decision records
- technical specifications
- project overview pages

Use macros to improve navigation and reporting, not to decorate pages without a purpose.

### 4. Audit content health

If the problem is space sprawl, stale docs, or poor adoption, run the audit script:

```bash
python scripts/content_audit_analyzer.py pages.json
python scripts/content_audit_analyzer.py pages.json --format json
```

Use the results to identify:

- stale pages
- low-engagement pages
- unlabeled or orphaned pages
- oversized documents that should be split

### 5. Recommend a governance plan

Give the user:

- the target page hierarchy
- label conventions
- template set
- review cadence
- archive and ownership rules

### 6. Hand off when needed

- `atlassian-workspace-admin` for admin and permission changes
- `jira-project-operations` when the ask is mostly about Jira boards, JQL, or automation
- `deliver-prd` when the user really needs a spec rather than a documentation system

## Common Deliverables

- space hierarchy proposal
- space homepage outline
- label taxonomy
- documentation template pack
- stale-content audit summary
- archive and ownership policy notes

## Boundaries

This skill does not replace:

- Atlassian administration
- product planning artifacts
- meeting facilitation notes
- Jira workflow design
