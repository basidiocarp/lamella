# Common Ansible Errors and Solutions

## Contents

- [Overview](#overview)
- [Syntax Errors](#syntax-errors)
- [Module Errors](#module-errors)
- [Template Errors](#template-errors)
- [Connection Errors](#connection-errors)
- [Privilege Escalation Errors](#privilege-escalation-errors)
- [Variable Errors](#variable-errors)
- [Inventory Errors](#inventory-errors)
- [Loop Errors](#loop-errors)
- [Handler Errors](#handler-errors)
- [Include and Import Errors](#include-and-import-errors)
- [Collection Errors](#collection-errors)
- [Dry-Run and Check Mode Errors](#dry-run-and-check-mode-errors)
- [Debugging Tips](#debugging-tips)
- [Performance Issues](#performance-issues)
- [Error Prevention Checklist](#error-prevention-checklist)
- [Quick Reference Commands](#quick-reference-commands)

## Overview

Use this guide when a playbook fails during YAML parsing, module execution, templating, SSH connection setup, privilege escalation, or dry-run validation.

## Syntax Errors

### Error: `mapping values are not allowed here`

```text
ERROR! Syntax Error while loading YAML.
  mapping values are not allowed here
```

**Cause:** YAML indentation error or an unquoted value containing `:`.

**Problem:**

```yaml
- name: Configure app
  template:
    src: config.j2
    dest: /etc/app/config.yml
    vars:
      db_host: localhost:5432
```

**Fix:**

```yaml
- name: Configure app
  ansible.builtin.template:
    src: config.j2
    dest: /etc/app/config.yml
  vars:
    db_host: "localhost:5432"
```

### Error: `found undefined alias`

```text
ERROR! Syntax Error while loading YAML.
  found undefined alias 'anchor'
```

**Cause:** YAML alias used before the anchor is defined.

**Fix:**

```yaml
common_packages: &common_packages
  - git
  - curl
  - vim

- name: Install common packages
  ansible.builtin.apt:
    name: "{{ common_packages }}"
    state: present
```

### Error: `could not find expected ':'`

```text
ERROR! could not find expected ':'
```

**Cause:** Missing colon or malformed YAML structure.

**Problem:**

```yaml
- name Install package
  apt:
    name nginx
```

**Fix:**

```yaml
- name: Install package
  ansible.builtin.apt:
    name: nginx
    state: present
```

## Module Errors

### Error: Unsupported parameters for module

```text
ERROR! Unsupported parameters for (module) module: parameter_name
```

**Cause:** Wrong parameter name, typo, or parameters copied from a different module.

**Problem:**

```yaml
- name: Create file
  ansible.builtin.file:
    path: /tmp/test
    state: touch
    mod: "0644"
```

**Fix:**

```yaml
- name: Create file
  ansible.builtin.file:
    path: /tmp/test
    state: touch
    mode: "0644"
```

Run `ansible-doc ansible.builtin.file` to confirm valid arguments.

### Error: `MODULE FAILURE`

```text
fatal: [host]: FAILED! => {"changed": false, "module_stderr": "..."}
```

**Common causes:**

1. Python is missing on the target.
2. The wrong interpreter is selected.
3. SELinux blocks temporary module execution.

**Fixes:**

```ini
[webservers]
server1 ansible_python_interpreter=/usr/bin/python3
```

```yaml
- hosts: all
  vars:
    ansible_python_interpreter: /usr/bin/python3
  tasks:
    - name: Gather facts explicitly
      ansible.builtin.setup:
```

### Error: Missing required arguments

```text
fatal: [host]: FAILED! => {"changed": false, "msg": "missing required arguments: name"}
```

**Cause:** Required module parameter omitted.

**Fix:**

```yaml
- name: Install package
  ansible.builtin.apt:
    name: nginx
    state: present
```

## Template Errors

### Error: template error while templating string

```text
fatal: [host]: FAILED! => {"msg": "An unhandled exception occurred while templating..."}
```

**Common causes:**

1. Undefined variable.
2. Wrong filter syntax.
3. Jinja expression error.

**Problem:**

```yaml
- name: Configure app
  ansible.builtin.template:
    src: config.j2
    dest: /etc/app/config.yml
  vars:
    port: "{{ app_port }}"
```

**Fixes:**

```yaml
- name: Render config with default
  ansible.builtin.template:
    src: config.j2
    dest: /etc/app/config.yml
  vars:
    port: "{{ app_port | default(8080) }}"

- name: Render config only when variable exists
  ansible.builtin.template:
    src: config.j2
    dest: /etc/app/config.yml
  when: app_port is defined
```

### Error: Unexpected templating type error

```text
fatal: [host]: FAILED! => {"msg": "Unexpected templating type error occurred on (...)"}
```

**Cause:** Variable type does not match the template or module expectation.

**Fix:**

```yaml
vars:
  port_text: "{{ app_port | string }}"
  replicas: "{{ replica_count | int }}"
  feature_enabled: "{{ feature_enabled_raw | bool }}"
```

## Connection Errors

### Error: Failed to connect to the host via ssh

```text
fatal: [host]: UNREACHABLE! => {"msg": "Failed to connect to the host via ssh"}
```

**Common causes:**

1. Host is unreachable.
2. Wrong SSH key or username.
3. SSH service is not running.

**Fixes:**

```bash
ssh ubuntu@server1
ansible -i inventory webservers -m ping
```

```ini
[webservers]
server1 ansible_host=192.168.1.10 ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/id_rsa
```

### Error: Permission denied (publickey)

```text
fatal: [host]: UNREACHABLE! => {"msg": "Failed to connect to the host via ssh: Permission denied (publickey)."}
```

**Fixes:**

```bash
ssh-copy-id ubuntu@server1
ssh-add -l
ssh-add ~/.ssh/id_rsa
```

```ini
[webservers]
server1 ansible_ssh_private_key_file=~/.ssh/custom_key
```

### Error: Authentication or permission failure

```text
fatal: [host]: UNREACHABLE! => {"msg": "Authentication or permission failure."}
```

**Fixes:**

```bash
ansible-playbook -i inventory playbook.yml --ask-pass --ask-become-pass
```

```yaml
- hosts: all
  vars:
    ansible_ssh_pass: "{{ vault_ssh_password }}"
    ansible_become_pass: "{{ vault_become_password }}"
```

## Privilege Escalation Errors

### Error: Missing sudo password

```text
fatal: [host]: FAILED! => {"msg": "Missing sudo password"}
```

**Fixes:**

```bash
ansible-playbook -i inventory playbook.yml --ask-become-pass
```

```text
# /etc/sudoers.d/ansible
ansible_user ALL=(ALL) NOPASSWD: ALL
```

### Error: Permission denied when task needs root

```text
fatal: [host]: FAILED! => {"msg": "Could not create file: Permission denied"}
```

**Problem:**

```yaml
- name: Install package
  ansible.builtin.apt:
    name: nginx
    state: present
```

**Fix:**

```yaml
- name: Install package
  ansible.builtin.apt:
    name: nginx
    state: present
  become: true
```

## Variable Errors

### Error: The task includes an option with an undefined variable

```text
fatal: [host]: FAILED! => {"msg": "The task includes an option with an undefined variable. The error was: 'variable' is undefined"}
```

**Fixes:**

```yaml
- name: Use variable with default
  ansible.builtin.debug:
    msg: "{{ my_var | default('default_value') }}"

- name: Fail early if variable is missing
  ansible.builtin.assert:
    that:
      - my_var is defined
    fail_msg: "my_var must be defined"

- name: Require variable at render time
  ansible.builtin.debug:
    msg: "{{ my_var | mandatory }}"
```

### Warning: Invalid characters in group names

```text
[WARNING]: Invalid characters were found in group names but not replaced, use -vvvv to see details
```

**Cause:** Inventory group names include hyphens, spaces, or other unsupported characters.

**Fix:**

```ini
# Wrong
[web-servers]

# Correct
[web_servers]
```

## Inventory Errors

### Error: Could not match supplied host pattern

```text
[WARNING]: Could not match supplied host pattern, ignoring: webservers
```

**Cause:** Play target does not exist in the inventory being used.

**Fix:**

```ini
[webservers]
web1.example.com
web2.example.com

[databases]
db1.example.com
```

### Error: Unable to parse inventory

```text
[WARNING]: Unable to parse /path/to/inventory as an inventory source
```

**Cause:** Mixed YAML and INI syntax or malformed inventory content.

**Fix:**

```ini
# Wrong
[webservers]
web1 ansible_host=192.168.1.10
web2
  ansible_host: 192.168.1.11

# Correct
[webservers]
web1 ansible_host=192.168.1.10
web2 ansible_host=192.168.1.11
```

## Loop Errors

### Error: Invalid data passed to `loop`

```text
fatal: [host]: FAILED! => {"msg": "Invalid data passed to 'loop', it requires a list"}
```

**Cause:** `loop` received a string or dictionary instead of a list.

**Problem:**

```yaml
- name: Install packages
  ansible.builtin.apt:
    name: "{{ item }}"
    state: present
  loop: nginx
```

**Fix:**

```yaml
- name: Install packages
  ansible.builtin.apt:
    name: "{{ item }}"
    state: present
  loop:
    - nginx
    - python3
```

### Warning: `with_items` is deprecated

```text
[DEPRECATION WARNING]: with_items is deprecated, use loop instead
```

**Fix:**

```yaml
# Old
- name: Install packages
  ansible.builtin.apt:
    name: "{{ item }}"
    state: present
  with_items:
    - nginx
    - python3

# New
- name: Install packages
  ansible.builtin.apt:
    name: "{{ item }}"
    state: present
  loop:
    - nginx
    - python3
```

## Handler Errors

### Error: Handler not found

```text
ERROR! The requested handler 'restart nginx' was not found
```

**Cause:** `notify` string does not exactly match a handler name.

**Fix:**

```yaml
# tasks/main.yml
- name: Render nginx config
  ansible.builtin.template:
    src: nginx.conf.j2
    dest: /etc/nginx/nginx.conf
  notify: Restart nginx

# handlers/main.yml
- name: Restart nginx
  ansible.builtin.service:
    name: nginx
    state: restarted
```

## Include and Import Errors

### Error: Unable to retrieve file contents

```text
fatal: [host]: FAILED! => {"msg": "Unable to retrieve file contents. Could not find or access 'file.yml'"}
```

**Cause:** Included file path is wrong relative to the current playbook or role.

**Fix:**

```yaml
# Wrong
- ansible.builtin.include_tasks: tasks/install.yml

# Correct when file is in the same role task directory
- ansible.builtin.include_tasks: install.yml

# Correct when referencing another role path explicitly
- ansible.builtin.include_tasks: roles/common/tasks/install.yml
```

### Error: Include or import loop detected

```text
ERROR! Recursively included/imported file is causing infinite loop
```

**Cause:** File A includes file B and file B includes file A.

**Fix:** Move shared tasks into a third file and include that from both places instead of mutual includes.

## Collection Errors

### Error: couldn't resolve module/action

```text
ERROR! couldn't resolve module/action 'community.general.docker_container'
```

**Cause:** Required collection is missing.

**Fix:**

```bash
ansible-galaxy collection install community.general
```

```yaml
# requirements.yml
collections:
  - name: community.general
    version: ">=5.0.0"
```

```bash
ansible-galaxy collection install -r requirements.yml
```

### Error: Collection version conflict

```text
ERROR! Requirement already satisfied by a different version
```

**Fix:**

```bash
ansible-galaxy collection install community.general --force
ansible-galaxy collection install community.general:5.0.0
```

## Dry-Run and Check Mode Errors

### Error: This module does not support check mode

```text
fatal: [host]: FAILED! => {"msg": "This module does not support check mode"}
```

**Fix:**

```yaml
- name: Run task outside check mode
  ansible.builtin.command: /usr/local/bin/custom-script.sh
  check_mode: false
```

## Debugging Tips

### Enable verbose output

```bash
ansible-playbook playbook.yml -v
ansible-playbook playbook.yml -vv
ansible-playbook playbook.yml -vvv
ansible-playbook playbook.yml -vvvv
```

### Use the debug module

```yaml
- name: Print a variable
  ansible.builtin.debug:
    var: my_variable

- name: Print a message on Ubuntu only
  ansible.builtin.debug:
    msg: "Debug message"
  when: ansible_distribution == "Ubuntu"
```

### Use the assert module

```yaml
- name: Validate required application settings
  ansible.builtin.assert:
    that:
      - app_version is defined
      - app_version | length > 0
      - app_port | int > 0
      - app_port | int < 65536
    fail_msg: "Invalid configuration"
    success_msg: "Configuration validated"
```

## Performance Issues

### Slow playbook execution

1. Enable SSH pipelining.
   ```ini
   [ssh_connection]
   pipelining = True
   ```

2. Use fact caching.
   ```ini
   [defaults]
   gathering = smart
   fact_caching = jsonfile
   fact_caching_connection = /tmp/ansible_facts
   fact_caching_timeout = 86400
   ```

3. Disable fact gathering when unnecessary.
   ```yaml
   - hosts: all
     gather_facts: false
   ```

4. Use async for long-running tasks.
   ```yaml
   - name: Long task
     ansible.builtin.command: /usr/bin/long-task
     async: 3600
     poll: 0
   ```

### High memory usage

1. Process hosts in batches.
   ```yaml
   - hosts: all
     serial: 10
   ```

2. Use the free strategy.
   ```yaml
   - hosts: all
     strategy: free
   ```

## Error Prevention Checklist

- [ ] Run `yamllint` before `ansible-playbook`.
- [ ] Run `ansible-lint` on changed playbooks and roles.
- [ ] Use `--syntax-check` before the first real run.
- [ ] Test with `--check --diff` when modules support it.
- [ ] Limit scope with `--limit` during debugging.
- [ ] Use tags for incremental verification.
- [ ] Turn on `-vvv` or `-vvvv` for hard-to-reproduce failures.
- [ ] Validate required variables with `assert`.
- [ ] Use Molecule for roles when available.
- [ ] Test in staging before production.

## Quick Reference Commands

```bash
ansible-playbook playbook.yml --syntax-check
ansible-playbook playbook.yml --check --diff
ansible-playbook playbook.yml --limit webservers
ansible-playbook playbook.yml --tags config
ansible-playbook playbook.yml --skip-tags packages
ansible-playbook playbook.yml -vvv
ansible-inventory -i inventory --graph
ansible-doc ansible.builtin.copy
ansible-playbook playbook.yml --start-at-task="Install nginx"
```
