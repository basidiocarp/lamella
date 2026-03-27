# Ansible Coding Standards

Use this reference when validating or reviewing playbooks against maintainability and policy expectations.

## What Reviewers Should Enforce

```text
Task names are explicit
Module choice is specific and modern
Playbooks are idempotent
Variables are named and scoped clearly
Secrets are protected
Shell usage is justified
```

This file is intentionally validator-oriented. Use `best-practices.md` for generation guidance.

## Task Naming Rules

Good tasks:

```yaml
- name: Create application user
  ansible.builtin.user:
    name: appuser
```

Bad tasks:

```yaml
- name: Do stuff
  ansible.builtin.command: /tmp/script.sh
```

Rules:
- always name tasks
- start with an action verb
- say what resource changes

## Variable Standards

Prefer:

```yaml
nginx_worker_processes: 4
db_backup_dir: /var/backups/db
```

Avoid:

```yaml
workers: 4
db: db.example.com
```

Use role prefixes and snake_case consistently.

## Idempotency Review Rules

Approve:

```yaml
- name: Ensure service is enabled
  ansible.builtin.service:
    name: myapp
    state: started
    enabled: true
```

Flag:

```yaml
- name: Download artifact
  ansible.builtin.command: curl -o /tmp/file.tar.gz https://example.com/file.tar.gz
```

If imperative execution is necessary, require:
- `creates`
- `removes`
- `changed_when`
- `failed_when`

## Module Hierarchy

Review preference order:

```text
1. specific module
2. generic module
3. command
4. shell
```

Examples:
- `ansible.builtin.template` over `copy` for Jinja-driven config
- `ansible.builtin.package` over raw package-manager shell
- `ansible.builtin.command` over `shell` when no shell features are required

## Secret and Safety Rules

Require:
- `no_log: true` for credentials or tokens
- Vault or external secret storage for sensitive values
- explicit privilege decisions with `become`

Flag:
- inline passwords
- shell commands that echo secrets
- world-readable secret files

## Validation-Oriented Checklist

```text
Can this task run twice safely?
Is the module choice the narrowest correct one?
Would a reviewer understand the task name immediately?
Is any secret exposed in logs, vars, or templates?
Does the task rely on shell behavior unnecessarily?
```
