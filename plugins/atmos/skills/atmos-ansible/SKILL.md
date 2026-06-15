---
name: atmos-ansible
description: "Orchestrates Ansible playbook execution, variable passing, inventory management, and stack-based configuration through Atmos."
origin: lamella
---

# Atmos Ansible Orchestration

Use this skill when Atmos is the wrapper around interactive Ansible execution. It is best for stack-aware operator workflows, not headless CI jobs.

## When to Use

- Running `atmos ansible playbook` from stack configuration
- Resolving playbooks, inventory, and vars from component settings
- Passing environment and native Ansible flags through Atmos
- Debugging stack-aware Ansible runs

## Core Workflow

1. Resolve the component and stack.
2. Generate the vars file from stack config.
3. Resolve playbook and inventory from flags or settings.
4. Apply stack environment variables.
5. Run `ansible-playbook` with any native passthrough flags.
6. Clean up generated artifacts after execution.

## Guardrails

- Use Atmos Ansible for interactive operator sessions.
- Prefer direct `ansible-playbook` in CI if you need non-interactive automation.
- Keep component vars declarative and let the playbook read them directly.

## References

- [references/commands-reference.md](references/commands-reference.md)
