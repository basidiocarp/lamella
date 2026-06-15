# YAML and Lint Validation

This reference covers YAML syntax validation and Ansible linting.

## YAML Syntax Validation

```bash
yamllint playbook.yml
yamllint -c .yamllint .
ansible-playbook playbook.yml --syntax-check
```

Run YAML validation before deeper Ansible linting.

## Ansible Lint

```bash
ansible-lint playbook.yml
ansible-lint .
ansible-lint -L
```

Common catches:
- deprecated modules
- missing task names
- `shell` used where `command` is enough
- unquoted template expressions
- weak variable handling

## Validation Order

1. YAML syntax
2. Ansible syntax
3. ansible-lint
4. security scans
