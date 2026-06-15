# Atmos Ansible Commands

Focus on the operational commands, not full manifest design.

## `playbook`

Use `atmos ansible playbook <component> -s <stack>` to execute a component's
configured playbook.

Rules:

- `component` and `--stack` are required
- `--playbook` and `--inventory` override stack-manifest defaults
- arguments after `--` pass through to native `ansible-playbook`

## `version`

Use `atmos ansible version` to confirm the installed Ansible environment.

## Guidance

- prefer stack-manifest defaults for routine execution
- use path-based component references only when that makes the local workflow
  clearer
- keep configuration details in the Ansible component or stack refs, not this
  command reference
