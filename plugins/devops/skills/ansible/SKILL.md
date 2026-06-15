---
name: ansible
description: "Generates, validates, lints, and tests Ansible playbooks, roles, inventories, and tasks."
origin: lamella
---

# Ansible

## Contents

- [When to Use](#when-to-use)
- [Generation Workflow](#generation-workflow)
- [Validation Workflow](#validation-workflow)
- [Best Practices](#best-practices)
- [Reference Files](#reference-files)

## When to Use

**Generation triggers:** "Create a playbook", "Generate an Ansible role", "Write inventory files", "Build reusable tasks", "Initialize an Ansible project", "Quick Ansible snippet"

**Validation triggers:** "Validate playbook", "Lint role", "ansible-lint failing", "Run check mode", "Test with Molecule", "Find security issues", "Module not found"

## Generation Workflow

### Stage 0: Classify Request

| Mode | Intent | Deliverable |
|------|--------|-------------|
| `full-generation` | Create/build/generate full playbook/role/inventory | Complete production-ready file(s) |
| `snippet-only` | Quick snippet/example | Focused task/play snippet |
| `docs-only` | Explanation or pattern comparison | Explanatory content |

### Stage 1: Collect Inputs

| Resource | Required | Defaults if missing |
|----------|----------|---------------------|
| Playbook | hosts, become, OS, objective | `hosts: all`, `become: false`, OS-agnostic |
| Role | name, service, supported OS | name from domain, Debian + RedHat vars |
| Tasks | scope, required vars, context | standalone reusable tasks |
| Inventory | environments, groups, hosts | production/staging with placeholders |
| Project config | dependencies, lint policy | minimal ansible.cfg, requirements.yml |

### Stage 2: Extract from References

Before generating, extract patterns from:
- `references/best-practices.md` — FQCN, idempotency, naming, security
- `references/module-patterns.md` — correct module/parameter patterns
- Templates in `assets/templates/` for the target resource type

### Stage 3: Generate

1. Use FQCN module names (`ansible.builtin.*` first)
2. Keep tasks idempotent (`state`, `creates/removes`, `changed_when`)
3. Descriptive verb-first task names
4. Use `true`/`false` booleans (not `yes`/`no`)
5. Add `no_log: true` for sensitive values
6. Replace all placeholders before output
7. Prefer `ansible.builtin.dnf` for RHEL 8+

### Stage 4: Validate Output

For `full-generation`: run validation workflow below.
For `snippet-only`: inline sanity checks (YAML shape, FQCN, idempotency).
For `docs-only`: no validation needed.

## Validation Workflow

### Preflight

```bash
bash scripts/setup_tools.sh
```

**Requirements:** ansible, ansible-playbook, ansible-lint, yamllint
**Optional:** molecule + docker/podman, checkov

### Validation Stages

```
1. Identify scope → playbook / role / collection / inventory
2. Syntax → ansible-playbook --syntax-check, yamllint
3. Lint → ansible-lint, scripts/check_fqcn.sh
4. Dry-run → ansible-playbook --check --diff
5. Molecule → bash scripts/test_role.sh (if molecule/ exists)
6. Module analysis → scripts/extract_ansible_info_wrapper.sh
7. Security → validate_*_security.sh + scan_secrets.sh
8. Reference routing → map errors to reference docs
9. Final report → PASS/FAIL/BLOCKED/SKIPPED per stage
```

**Status contract:** `BLOCKED` = env/runtime issue; `FAIL` = code/test failure

### Primary Scripts

```bash
bash scripts/validate_playbook.sh <playbook.yml>
bash scripts/validate_playbook_security.sh <playbook.yml>
bash scripts/validate_role.sh <role-directory>
bash scripts/validate_role_security.sh <role-directory>
bash scripts/test_role.sh <role-directory> [scenario]
bash scripts/scan_secrets.sh <path>
bash scripts/check_fqcn.sh <path>
bash scripts/validate_inventory.sh <inventory>
```

### Error-Class Reference Routing

| Error class | Detector | Reference | Action |
|-------------|----------|-----------|--------|
| YAML syntax | yamllint, --syntax-check | common_errors.md | Fix YAML |
| Module resolution | ansible-playbook, lint | common_errors.md | `ansible-galaxy collection install` |
| Non-FQCN usage | check_fqcn.sh | module_alternatives.md | FQCN replacement |
| Template/variable | check mode | best_practices.md | `default()` filter |
| Connection/privilege | --check, runtime | common_errors.md | Fix inventory/auth/become |
| Security (CKV_*) | validate_*_security.sh | security_checklist.md | Secure task rewrite |
| Hardcoded secrets | scan_secrets.sh | security_checklist.md | Vault/env/secret manager |

## Best Practices

### Resource Generation

**Playbooks:** Header comments, pre_tasks/tasks/post_tasks, handlers, tags, health checks for services.

**Roles:** defaults in `defaults/main.yml`, OS-specific vars (`vars/Debian.yml`, `vars/RedHat.yml`), `meta/argument_specs.yml` for validation, `molecule/default/` scaffold.

**Tasks:** Narrow scope, document required input variables, conditionals for OS-sensitive operations.

**Inventory:** Logical host groups, variable layering (group_vars/all.yml → group → host). INI for simple, YAML for complex topologies.

### Custom Modules and Collections

1. Identify collection + module and version requirements
2. Check `references/module-patterns.md` first
3. If unresolved, use Context7 or official Ansible docs
4. Include collection installation guidance when collection modules are used

## Reference Files

### Generation References

| Reference | Purpose |
|-----------|---------|
| [references/best-practices.md](references/best-practices.md) | FQCN, idempotency, naming, security |
| [references/module-patterns.md](references/module-patterns.md) | Module/parameter patterns by task type |

### Validation References

| Reference | Purpose |
|-----------|---------|
| [references/core-yaml-lint.md](references/core-yaml-lint.md) | YAML syntax and ansible-lint |
| [references/core-security-scanning.md](references/core-security-scanning.md) | Checkov security scanning |
| [references/core-testing.md](references/core-testing.md) | Check mode and Molecule testing |
| [references/core-module-lookup.md](references/core-module-lookup.md) | Custom module documentation lookup |
| [references/tool-prerequisites.md](references/tool-prerequisites.md) | Tool installation reference |
| [references/error-troubleshooting.md](references/error-troubleshooting.md) | Common errors and debugging |
| [references/workflow-examples.md](references/workflow-examples.md) | Step-by-step examples |
| [references/best_practices.md](references/best_practices.md) | Ansible coding standards |
| [references/common_errors.md](references/common_errors.md) | Error database with solutions |
| [references/module_alternatives.md](references/module_alternatives.md) | Deprecated module replacements |
| [references/security_checklist.md](references/security_checklist.md) | Security validation checklist |

### Templates

Templates in `assets/templates/` for playbooks, roles, inventory, and project config.

## Done Criteria

- Request mode classified (full-generation, snippet-only, docs-only)
- Required references consulted for artifact type
- No unresolved placeholders in generated output
- Validation ran per mode (full validator, inline checks, or none)
- Skipped checks include reason and deferred command(s)
- Final output includes summary, assumptions, usage, and prerequisites
### Additional Resources


| File | Path |
|------|------|
| [Molecule.Yml](assets/molecule.yml.template) | `assets/molecule.yml.template` |
| [Databases](assets/templates/inventory/group_vars/databases.yml) | `assets/templates/inventory/group_vars/databases.yml` |
| [Webservers](assets/templates/inventory/group_vars/webservers.yml) | `assets/templates/inventory/group_vars/webservers.yml` |
| [Web1.Example.Com](assets/templates/inventory/host_vars/web1.example.com.yml) | `assets/templates/inventory/host_vars/web1.example.com.yml` |
| [Hosts](assets/templates/inventory/hosts.yml) | `assets/templates/inventory/hosts.yml` |
| [Basic Playbook](assets/templates/playbook/basic_playbook.yml) | `assets/templates/playbook/basic_playbook.yml` |
| [Readme](assets/templates/role/README.md) | `assets/templates/role/README.md` |
| [Converge](assets/templates/role/molecule/default/converge.yml) | `assets/templates/role/molecule/default/converge.yml` |
| [Molecule](assets/templates/role/molecule/default/molecule.yml) | `assets/templates/role/molecule/default/molecule.yml` |
| [Config](assets/templates/role/templates/config.j2) | `assets/templates/role/templates/config.j2` |
- [Extract Ansible Info](scripts/extract_ansible_info.py)
