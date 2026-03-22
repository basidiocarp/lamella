# Ansible Best Practices

## Overview

This guide provides comprehensive best practices for writing clean, maintainable, and reliable Ansible playbooks, roles, and collections.

## Playbook Organization

### Directory Structure

```
ansible-project/
├── ansible.cfg              # Ansible configuration
├── inventory/               # Inventory files
│   ├── production/
│   │   ├── hosts           # Production inventory
// ... (22 lines trimmed)
├── vars/                   # Additional variables
│   └── external_vars.yml
└── requirements.yml        # Collection dependencies
```

### Role Structure

```
roles/webserver/
├── README.md              # Role documentation
├── defaults/
│   └── main.yml          # Default variables (lowest precedence)
├── vars/
// ... (15 lines trimmed)
        ├── molecule.yml
        ├── converge.yml
        └── verify.yml
```

## Task Naming and Documentation

### ✅ Good Task Names

```yaml
# Descriptive, action-oriented names
- name: Install nginx web server
  apt:
    name: nginx
    state: present
// ... (15 lines trimmed)
    system: yes
    shell: /bin/false
    home: /var/lib/app
```

### ❌ Bad Task Names

```yaml
# Vague, uninformative names
- name: Install package
  apt:
    name: nginx

// ... (10 lines trimmed)
# No name at all
- apt:
    name: nginx
```

### Best Practices

1. **Always name your tasks** - makes output readable
2. **Use action verbs** - Install, Configure, Enable, Create, etc.
3. **Be specific** - mention what is being installed/configured
4. **Keep names concise** - but not at the expense of clarity
5. **Use consistent naming** - across all playbooks

## Variable Management

### Variable Naming Conventions

```yaml
# ✅ Good - Descriptive, namespaced
nginx_version: "1.18.0"
nginx_worker_processes: 4
nginx_worker_connections: 1024
// ... (5 lines trimmed)
workers: 4         # Unclear
db: "db.example.com"  # Vague
```

### Variable Precedence

Understand variable precedence (from lowest to highest):

1. role defaults (defaults/main.yml)
2. inventory file or script group vars
3. inventory group_vars/all
4. playbook group_vars/all
5. inventory group_vars/*
6. playbook group_vars/*
7. inventory file or script host vars
8. inventory host_vars/*
9. playbook host_vars/*
10. host facts / cached set_facts
11. play vars
12. play vars_prompt
13. play vars_files
14. role vars (vars/main.yml)
15. block vars
16. task vars
17. include_vars
18. set_facts / registered vars
19. role (and include_role) params
20. include params
21. extra vars (always win precedence)

### Variable Organization

```yaml
# defaults/main.yml - Intended to be overridden
---
nginx_port: 80
nginx_user: www-data
// ... (5 lines trimmed)
nginx_log_dir: /var/log/nginx
nginx_pid_file: /run/nginx.pid
```

### Using Defaults and Required Variables

```yaml
# Use default filter for optional variables
- name: Set API endpoint
  set_fact:
    api_endpoint: "{{ custom_api_endpoint | default('https://api.example.com') }}"
// ... (6 lines trimmed)
  vars:
    db_password: "{{ database_password | required('database_password must be defined') }}"
```

## Idempotency

### What is Idempotency?

Idempotency means running the same playbook multiple times produces the same result without making unnecessary changes.

### ✅ Idempotent Tasks

```yaml
# File module - inherently idempotent
- name: Ensure configuration directory exists
  file:
    path: /etc/myapp
    state: directory
// ... (21 lines trimmed)
    name: myapp
    state: started
    enabled: yes
```

### ⚠️ Non-Idempotent Tasks (Need Fixes)

```yaml
# Command/shell without creates/removes
- name: Download file
  command: curl -o /tmp/file.tar.gz https://example.com/file.tar.gz
  # This runs every time!

// ... (22 lines trimmed)
  register: service_status
  changed_when: false
  failed_when: service_status.rc not in [0, 3]
```

### Best Practices for Idempotency

1. **Use modules instead of command/shell** whenever possible
2. **Use creates/removes** parameters for command/shell when necessary
3. **Set changed_when appropriately** for read-only commands
4. **Test idempotency** - run playbook twice, second run should show no changes
5. **Use check mode** to verify idempotency without making changes

## Module Selection

### Prefer Modules Over Commands

```yaml
# ❌ Bad - Using shell/command
- name: Create directory
  shell: mkdir -p /opt/myapp

- name: Install package
// ... (19 lines trimmed)
    path: ~/.bashrc
    line: 'export PATH=$PATH:/opt/bin'
    create: yes
```

### Module Hierarchy

1. **First choice**: Specific module (apt, yum, systemd, copy, etc.)
2. **Second choice**: Generic module (package, service, etc.)
3. **Last resort**: command or shell module

## Error Handling

### Using Blocks

```yaml
- name: Handle errors gracefully
  block:
    - name: Attempt risky operation
      command: /usr/local/bin/risky-operation.sh
      register: result
// ... (17 lines trimmed)
      file:
        path: /tmp/operation.lock
        state: absent
```

### Failed When and Changed When

```yaml
# Custom failure conditions
- name: Check disk space
  shell: df -h / | tail -1 | awk '{print $5}' | sed 's/%//'
  register: disk_usage
  failed_when: disk_usage.stdout | int > 90
// ... (14 lines trimmed)
  failed_when:
    - health.status != 200
    - "'healthy' not in health.json.status"
```

### Ignoring Errors (Use Sparingly)

```yaml
# Only when failure is acceptable
- name: Try to stop service (may not exist)
  systemd:
    name: old-service
    state: stopped
// ... (11 lines trimmed)
    name: old-service
    state: stopped
  when: service_status.status.ActiveState is defined
```

## Conditionals and Loops

### When Conditions

```yaml
# Simple condition
- name: Install Apache (Debian)
  apt:
    name: apache2
    state: present
// ... (24 lines trimmed)
    - ansible_os_family == "Debian"
    - firewall_enabled | default(true) | bool
    - ansible_virtualization_type != "docker"
```

### Loops

```yaml
# Simple loop
- name: Install packages
  apt:
    name: "{{ item }}"
    state: present
// ... (33 lines trimmed)
    - tcpdump
    - gdb
  when: environment == "development"
```

## Templates and Jinja2

### Template Best Practices

```jinja2
{# templates/nginx.conf.j2 #}

{# Use comments to explain complex logic #}
user {{ nginx_user }};
worker_processes {{ nginx_worker_processes }};
// ... (22 lines trimmed)
{# Filters #}
upstream_servers = {{ backend_servers | join(',') }}
max_connections = {{ max_connections | default(1024) }}
```

### Useful Jinja2 Filters

```yaml
# String manipulation
- debug:
    msg: "{{ 'hello' | upper }}"  # HELLO
    msg: "{{ 'HELLO' | lower }}"  # hello
    msg: "{{ '  hello  ' | trim }}"  # hello
// ... (19 lines trimmed)
    msg: "{{ my_dict | to_json }}"
    msg: "{{ my_dict | to_nice_json }}"
    msg: "{{ my_dict | to_yaml }}"
```

## Tags

### Using Tags Effectively

```yaml
---
- name: Configure web server
  hosts: webservers
  tasks:
    - name: Install nginx
// ... (26 lines trimmed)
      tags:
        - security
        - firewall
```

### Running with Tags

```bash
# Run only nginx tasks
ansible-playbook site.yml --tags nginx

# Run configuration tasks only
// ... (5 lines trimmed)
# Multiple tags
ansible-playbook site.yml --tags "nginx,firewall"
```

## Handlers

### Handler Best Practices

```yaml
# tasks/main.yml
- name: Configure nginx
  template:
    src: nginx.conf.j2
    dest: /etc/nginx/nginx.conf
// ... (22 lines trimmed)
  systemd:
    name: nginx
    state: reloaded
```

### Handler Facts

1. **Handlers run once** at the end of a play, even if notified multiple times
2. **Handlers run in order** they're defined, not in order they're notified
3. **Use listen** for handler groups
4. **Flush handlers** with `meta: flush_handlers` to run immediately

## Check Mode and Diff Mode

### Supporting Check Mode

```yaml
# Task that supports check mode naturally (file module)
- name: Create directory
  file:
    path: /opt/myapp
    state: directory
// ... (8 lines trimmed)
- name: Apply complex changes
  command: /usr/local/bin/complex-script.sh
  when: not ansible_check_mode
```

### Using Check Mode

```bash
# Run in check mode (dry-run)
ansible-playbook site.yml --check

# Check mode with diff (show changes)
ansible-playbook site.yml --check --diff

# See what would change
ansible-playbook site.yml --check --diff | grep -A 10 "changed:"
```

## Documentation

### Playbook Documentation

```yaml
---
# site.yml - Master playbook for deploying web application
#
# This playbook:
#   - Configures common settings on all hosts
// ... (24 lines trimmed)
  roles:
    - webserver
  tags: webserver
```

### Role Documentation (README.md)

```markdown
# Webserver Role

## Description

Installs and configures Nginx web server with virtual hosts and SSL support.
// ... (21 lines trimmed)

## Example Playbook

```yaml
- hosts: webservers
  roles:
    - role: webserver
      vars:
        nginx_vhosts:
          - server_name: example.com
            port: 80
            document_root: /var/www/example
```

## License

MIT

## Author

Your Name
```

## Testing Best Practices

See the molecule configuration and testing section in the main SKILL.md for comprehensive testing guidance.

## Performance Tips

1. **Use pipelining** in ansible.cfg
   ```ini
   [ssh_connection]
   pipelining = True
   ```

2. **Enable fact caching**
   ```ini
   [defaults]
   gathering = smart
   fact_caching = jsonfile
   fact_caching_connection = /tmp/ansible_facts
   fact_caching_timeout = 86400
   ```

3. **Limit fact gathering**
   ```yaml
   - hosts: all
     gather_facts: no  # Don't gather if not needed
   ```

4. **Use async for long-running tasks**
   ```yaml
   - name: Long running task
     command: /usr/local/bin/long-task.sh
     async: 3600
     poll: 0
// ... (6 lines trimmed)
     until: job_result.finished
     retries: 30
   ```

## Summary Checklist

- [ ] Playbooks and roles have clear directory structure
- [ ] All tasks have descriptive names
- [ ] Variables use namespacing (role_variable_name)
- [ ] Sensitive data encrypted with Ansible Vault
- [ ] Playbooks are idempotent (can run multiple times safely)
- [ ] Using modules instead of shell/command where possible
- [ ] Error handling with blocks, failed_when, changed_when
- [ ] Conditionals used appropriately
- [ ] Templates properly commented
- [ ] Tags used for granular execution
- [ ] Handlers used for service restarts
- [ ] Check mode supported
- [ ] Documentation complete (README, comments)
- [ ] Tested with molecule or similar framework
- [ ] No hardcoded secrets
- [ ] File permissions explicitly set
