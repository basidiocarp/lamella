---
name: atmos-workflows
description: "Automates Atmos workflows with multi-step execution, Go template support, and cross-component orchestration."
origin: lamella
---

# Atmos Workflows

Use this skill when defining reusable multi-step Atmos operations. Keep the main skill focused on workflow boundaries, step sequencing, and stack resolution; use the references for file shape and syntax details.

## When to Use

- Creating a workflow under `workflows.base_path`
- Orchestrating a sequence of Atmos and shell steps
- Deciding where stack, identity, or working-directory context should live
- Reviewing retry and failure behavior for operational workflows

## Core Rules

1. Use workflows for reusable multi-step operations, not one-off command aliases.
2. Keep stack context explicit and override it only where necessary.
3. Mix shell steps only when Atmos commands cannot express the operation cleanly.
4. Make retry behavior deliberate, especially for mutating steps.

## Core Workflow

1. Define the workflow name, file location, and default context.
2. Write the smallest reliable sequence of steps.
3. Keep state-changing operations ordered and named clearly.
4. Test file discovery and explicit `--file` execution paths.
5. Split broad workflows once they start mixing unrelated operational concerns.

## Quick Commands

```shell
atmos workflow deploy -f deploy --stack tenant1-ue2-dev
atmos workflow validate --file validation
```

```powershell
atmos workflow deploy -f deploy --stack tenant1-ue2-dev
atmos workflow validate --file validation
```

## References

- [references/workflow-file-shape.md](references/workflow-file-shape.md)
- [references/workflow-step-shape.md](references/workflow-step-shape.md)
- [references/workflow-syntax.md](references/workflow-syntax.md)
