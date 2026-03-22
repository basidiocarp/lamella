# Tool Prerequisites

Run this preflight before validation:

```bash
# Preferred one-shot preflight
bash scripts/setup_tools.sh

# Check Ansible installation
ansible --version
// ... (23 lines trimmed)

# Install molecule with podman driver (alternative)
pip install molecule molecule-podman
```

## Minimum Versions

| Tool | Minimum Version | Recommended |
|------|-----------------|-------------|
| Ansible | >= 2.9 | >= 2.12 |
| ansible-lint | >= 6.0.0 | latest |
| yamllint | >= 1.26.0 | latest |
| molecule | >= 3.4.0 | latest |

## Execution Policy When Tools Are Missing

- If `ansible`/`ansible-lint` are missing, wrappers (`validate_playbook.sh`, `validate_role.sh`) attempt temporary venv bootstrap.
- If Molecule runtime (`docker info` or `podman info`) is unavailable, Molecule is `BLOCKED` and non-Molecule checks continue.
- If `checkov` is missing, security wrappers bootstrap it when possible; otherwise run `scan_secrets.sh` and report reduced security coverage.

## Optional Tools

| Tool | Purpose |
|------|---------|
| `ansible-inventory` | Inventory validation and graphing |
| `ansible-doc` | Module documentation lookup |
| `jq` | JSON parsing for structured output |

## Scripts Reference

### setup_tools.sh

Preflight checker for Ansible validator dependencies. Verifies baseline tools (`ansible`, `ansible-playbook`, `ansible-lint`, `yamllint`) and Molecule runtime readiness (`docker`/`podman`) and provides installation guidance.

```bash
bash scripts/setup_tools.sh
```

### validate_playbook.sh

Comprehensive validation script that runs syntax check, yamllint, and ansible-lint on playbooks. Automatically installs ansible and ansible-lint in a temporary venv if not available on the system.

```bash
bash scripts/validate_playbook.sh <playbook.yml>
```

### validate_role.sh

Comprehensive role validation script that checks role structure, YAML syntax, Ansible syntax, linting, and molecule configuration.

```bash
bash scripts/validate_role.sh <role-directory>
```

Validates:
- Role directory structure (required and recommended directories)
- Presence of main.yml files in each directory
- YAML syntax across all role files
- Ansible syntax using a test playbook
- Best practices with ansible-lint
- Molecule test configuration

### validate_playbook_security.sh

Security validation script that scans playbooks for security vulnerabilities using Checkov.

```bash
bash scripts/validate_playbook_security.sh <playbook.yml>
# Or scan entire directory
bash scripts/validate_playbook_security.sh /path/to/playbooks/
```

### validate_role_security.sh

Security validation script for Ansible roles using Checkov. Scans entire role directory for security issues.

```bash
bash scripts/validate_role_security.sh <role-directory>
```

### test_role.sh

Wrapper script for Molecule testing with automatic dependency installation. Returns exit code `2` for environment/runtime blockers and exit code `1` for role/test failures.

```bash
bash scripts/test_role.sh <role-directory> [scenario]
```

### scan_secrets.sh

Comprehensive secret scanner that uses grep-based pattern matching to detect hardcoded secrets in Ansible files.

```bash
bash scripts/scan_secrets.sh <playbook.yml|role-directory|directory>
```

Detects:
- Hardcoded passwords and credentials
- API keys and tokens
- AWS access keys and secret keys
- Database connection strings with embedded credentials
- Private key content (RSA, OpenSSH, EC, DSA)

**IMPORTANT:** This script should ALWAYS be run alongside Checkov (`validate_*_security.sh`) for comprehensive security scanning.

### check_fqcn.sh

Scans Ansible files to identify modules using short names instead of Fully Qualified Collection Names (FQCN).

```bash
bash scripts/check_fqcn.sh <playbook.yml|role-directory|directory>
```

Detects:
- ansible.builtin modules (apt, yum, copy, file, template, service, etc.)
- community.general modules (ufw, docker_container, timezone, etc.)
- ansible.posix modules (synchronize, acl, firewalld, etc.)

### extract_ansible_info_wrapper.sh

Bash wrapper for extract_ansible_info.py that automatically handles PyYAML dependencies.

```bash
bash scripts/extract_ansible_info_wrapper.sh <path-to-playbook-or-role>
```

Output: JSON structure with modules, collections, and versions

### validate_inventory.sh

Validates Ansible inventory files and directories.

```bash
bash scripts/validate_inventory.sh <inventory-file|inventory-directory>
```

Validation stages:
1. YAML syntax check (yamllint) on all inventory YAML files
2. Inventory parse — `ansible-inventory --list` to verify host/group resolution
3. Host graph — `ansible-inventory --graph` to display group hierarchy
4. Structural checks — plaintext passwords, localhost connection settings, group_vars/host_vars presence
