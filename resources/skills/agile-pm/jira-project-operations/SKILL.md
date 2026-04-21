---
name: jira-project-operations
description: "Operates Jira projects through JQL, workflow design, automation rules, dashboards, and issue hygiene."
origin: lamella
---
# Jira Project Operations

Use this skill for day-to-day Jira project work: query building, workflow design, automation ideas, dashboard shaping, and bulk issue operations.

## Reference Files

| File | Purpose |
|------|---------|
| [references/jql-examples.md](references/jql-examples.md) | Query patterns for sprint, team, date, and status reporting |
| [references/workflow-patterns.md](references/workflow-patterns.md) | Workflow design guidance, transitions, validators, and post-functions |
| [references/automation-examples.md](references/automation-examples.md) | Repeatable automation patterns for assignment, escalation, and synchronization |

## When to Use

- design or refine Jira workflows for a project
- build JQL filters for boards, dashboards, or reporting
- review Jira automation ideas before enabling them
- plan bulk changes or bulk transitions safely
- audit issue hygiene, stale work, or sprint visibility

If the request is about Atlassian-wide permissions, SSO, app review, or organization admin, use `atlassian-workspace-admin` instead.

## Workflow

### 1. Bound the Jira surface

Confirm:

- project or board in scope
- team workflow or reporting goal
- whether the request is project-specific or org-wide
- whether the user needs a query, workflow change, automation rule, or audit

### 2. Inspect before proposing

Check the current project shape before designing changes:

- issue types in use
- current workflow states and transitions
- existing dashboards or saved filters
- existing automation rules that might overlap

### 3. Build the smallest workable query or workflow

Prefer the simplest version that answers the need.

For query work, use the bundled builder when natural-language phrasing is faster than hand-writing JQL:

```bash
python scripts/jql_query_builder.py "high priority bugs in PROJECT assigned to me"
python scripts/jql_query_builder.py "overdue tasks in PROJ" --format json
```

For workflow reviews, validate the JSON definition before recommending rollout:

```bash
python scripts/workflow_validator.py workflow.json
python scripts/workflow_validator.py workflow.json --format json
```

### 4. Prefer safe rollout patterns

- test workflow changes in a non-production project first
- preview bulk edits from the exact JQL filter
- keep automation rules small and observable
- use group or role assumptions that already exist in the project

### 5. Present the operational plan

Give the user:

- the query, workflow shape, or automation rule
- the reason it matches the team’s goal
- the verification step
- the rollback or fallback path

### 6. Hand off when needed

Use nearby skills when the request drifts:

- `atlassian-workspace-admin` for org-wide Jira admin and permission schemes
- `iterate-refinement-notes` for documenting refinement outcomes
- `deliver-prd` when the work is really about feature definition rather than Jira configuration

## Common Deliverables

- saved JQL filters
- dashboard gadget query sets
- workflow state recommendations
- automation-rule drafts
- issue hygiene reports
- bulk-edit safety checklists

## Boundaries

This skill is not the right place for:

- Atlassian org administration
- product requirements writing
- stakeholder communication plans
- Confluence space architecture
