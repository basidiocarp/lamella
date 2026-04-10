---
name: create-handoff
description: Create a structured handoff document with verification
category: development
version: 0.1.0
---

Create a handoff document for delegating work to another agent.

## Arguments

- `project` (required): Target project (canopy, mycelium, hyphae, rhizome, cortina, lamella, spore, stipe, cap, volva, cross-project)
- `topic` (required): Short kebab-case topic name

## Workflow

1. Ask for the problem description and scope
2. Create `.handoffs/<project>/<topic>.md` from the repo-level work-item handoff template
3. Create `.handoffs/<project>/verify-<topic>.sh` with one check per assertion
4. Update `.handoffs/HANDOFFS.md` index
5. Validate the handoff structure
