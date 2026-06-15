# Ansible Best Practices

Use this reference for authoring clean, maintainable playbooks and roles.

## Project Structure

Keep the standard shape predictable:

```text
playbook.yml
roles/
  web/
    tasks/main.yml
    handlers/main.yml
    templates/
    files/
    defaults/main.yml
    vars/main.yml
inventory/
  hosts
  group_vars/
  host_vars/
```

Why:
- easier review
- easier reuse
- easier routing for validators and tests

## Naming

Use:
- lowercase file names with underscores
- snake_case variables
- short, descriptive role names
- verb-first task names

Example:

```yaml
- name: Install nginx package
  ansible.builtin.package:
    name: nginx
    state: present
```

## Idempotency

Write every task so it can run repeatedly without unnecessary changes.

```yaml
- name: Ensure config directory exists
  ansible.builtin.file:
    path: /opt/app
    state: directory
    mode: '0755'
```

Avoid:

```yaml
- name: Create directory imperatively
  ansible.builtin.command: mkdir -p /opt/app
```

If `command` or `shell` is unavoidable, pair it with `creates`, `removes`, or explicit change detection.

## FQCN and Module Choice

Prefer fully qualified names:

```yaml
ansible.builtin.copy
ansible.builtin.template
ansible.builtin.service
```

This keeps module origin explicit and avoids ambiguity once collections are involved.

## Variables

Guidelines:
- put defaults in `defaults/main.yml`
- reserve `vars/main.yml` for values that should rarely be overridden
- prefix role-specific variables
- use `default()` for optional values

Example:

```yaml
nginx_port: 80
nginx_worker_processes: 4
```

## Conditionals and Loops

```yaml
- name: Install nginx on Debian
  ansible.builtin.apt:
    name: nginx
    state: present
  when: ansible_os_family == "Debian"

- name: Install packages
  ansible.builtin.package:
    name: "{{ item }}"
    state: present
  loop:
    - nginx
    - postgresql
```

Prefer `loop` over repeated near-identical tasks.

## Handlers and Templates

Use handlers for restart-or-reload behavior:

```yaml
- name: Deploy nginx config
  ansible.builtin.template:
    src: nginx.conf.j2
    dest: /etc/nginx/nginx.conf
  notify: Restart nginx
```

Templates should carry only the dynamic parts that justify templating. Full files with no variables should stay in `files/`.

## Error Handling

Use `block` / `rescue` when the recovery path matters:

```yaml
- block:
    - name: Attempt risky operation
      ansible.builtin.command: /usr/local/bin/risky-operation.sh
  rescue:
    - name: Report failure
      ansible.builtin.debug:
        msg: "Operation failed"
```

## Security and Secrets

Always:
- use `no_log: true` for secrets
- prefer Vault or secret managers over inline credentials
- avoid shell interpolation of untrusted values

## Default Authoring Checklist

```text
Descriptive task names
FQCN modules
Idempotent state declarations
Role-prefixed variables
Handlers for restart behavior
Secret-safe logging and storage
```
