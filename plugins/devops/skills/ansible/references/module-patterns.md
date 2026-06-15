# Common Ansible Module Usage Patterns

Use the most specific built-in module that matches the task. Treat `command` and `shell` as fallbacks, not defaults.

## Package Management

### OS-Agnostic First

```yaml
- name: Ensure nginx is installed
  ansible.builtin.package:
    name: nginx
    state: present
```

Use `package` when the playbook should stay portable across Debian and RedHat families.

### OS-Specific Package Managers

```yaml
- name: Debian packages
  ansible.builtin.apt:
    name:
      - nginx
      - postgresql
    state: present
    update_cache: true

- name: RHEL 8+ packages
  ansible.builtin.dnf:
    name:
      - nginx
      - postgresql
    state: present
```

Guideline:
- `apt` for Debian or Ubuntu specifics
- `dnf` for modern RHEL-family hosts
- `yum` only for older legacy targets

## File and Config Operations

### File / Copy / Template

```yaml
- name: Create config directory
  ansible.builtin.file:
    path: /opt/app/config
    state: directory
    mode: '0755'

- name: Copy static config
  ansible.builtin.copy:
    src: files/nginx.conf
    dest: /etc/nginx/nginx.conf
    mode: '0644'

- name: Render app config
  ansible.builtin.template:
    src: templates/app_config.j2
    dest: /etc/app/config.yml
    mode: '0644'
    validate: '/usr/bin/app validate %s'
```

Use:
- `file` for paths, permissions, links
- `copy` for static content
- `template` for variable-driven config

### Line and Block Edits

```yaml
- name: Ensure host entry exists
  ansible.builtin.lineinfile:
    path: /etc/hosts
    line: '192.168.1.100 app.local'
    state: present

- name: Manage managed block
  ansible.builtin.blockinfile:
    path: /etc/hosts
    marker: '# {mark} ANSIBLE MANAGED BLOCK'
    block: |
      192.168.1.10 web1.local
      192.168.1.11 web2.local
```

Use these for targeted edits, not for full configuration files that should really be templates.

## Services

```yaml
- name: Ensure nginx is enabled and running
  ansible.builtin.service:
    name: nginx
    state: started
    enabled: true

- name: Reload systemd
  ansible.builtin.systemd:
    daemon_reload: true
```

Use `systemd` when you need systemd-specific behavior like `daemon_reload`, masking, or timers.

## Users and Access

```yaml
- name: Ensure app group exists
  ansible.builtin.group:
    name: appgroup
    state: present

- name: Ensure app user exists
  ansible.builtin.user:
    name: appuser
    group: appgroup
    shell: /bin/bash
    create_home: true

- name: Install SSH key
  ansible.builtin.authorized_key:
    user: appuser
    key: "{{ lookup('file', 'files/id_rsa.pub') }}"
```

## Commands and Shell

### Prefer `command`

```yaml
- name: Run migration command
  ansible.builtin.command:
    cmd: /usr/local/bin/app migrate
    chdir: /opt/app
  changed_when: false
```

### Use `shell` Only When Shell Features Are Required

```yaml
- name: Grep and redirect with shell
  ansible.builtin.shell: cat /var/log/app.log | grep ERROR > /tmp/errors.txt
  args:
    executable: /bin/bash
  changed_when: false
```

If you use `command` or `shell`, add one of:
- `creates`
- `removes`
- `changed_when`
- `failed_when`

That is what keeps the task idempotent and reviewable.

## Remote and Control-Node Scripts

```yaml
- name: Run script from control node
  ansible.builtin.script: scripts/setup.sh
```

Use `script` when a standalone script already exists and you do not want to inline it into shell.

## Default Selection Rule

```text
Specific built-in module first
Generic module second
command or shell last
```

If a task starts as `shell`, ask whether a built-in module already models the resource state better.
