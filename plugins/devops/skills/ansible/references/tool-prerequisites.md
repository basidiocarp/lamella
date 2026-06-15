# Tool Prerequisites

Run this preflight before validation:

```bash
bash scripts/setup_tools.sh
ansible --version
ansible-lint --version
yamllint --version
```

## Minimum Versions

| Tool | Minimum Version | Recommended |
|------|-----------------|-------------|
| Ansible | >= 2.9 | >= 2.12 |
| ansible-lint | >= 6.0.0 | latest |
| yamllint | >= 1.26.0 | latest |
| molecule | >= 3.4.0 | latest |

## Execution Policy

- if `ansible` or `ansible-lint` is missing, wrappers may bootstrap a temp environment
- if Docker or Podman is unavailable, Molecule is `BLOCKED`
- if `checkov` is missing, use security fallbacks and report reduced coverage

## Key Scripts

- `setup_tools.sh`
- `validate_playbook.sh`
- `validate_role.sh`
- `validate_playbook_security.sh`
- `validate_role_security.sh`
- `test_role.sh`
- `scan_secrets.sh`
