# Ansible Security Checklist

## Contents

- [Overview](#overview)
- [Secrets Management](#secrets-management)
- [Privilege Escalation](#privilege-escalation)
- [File Permissions](#file-permissions)
- [Command Injection Prevention](#command-injection-prevention)
- [Network Security](#network-security)
- [SELinux and AppArmor](#selinux-and-apparmor)
- [Audit and Logging](#audit-and-logging)
- [Security Validation Checklist](#security-validation-checklist)
- [Tools for Security Scanning](#tools-for-security-scanning)
- [Additional Resources](#additional-resources)

## Overview

Use this checklist when reviewing playbooks, roles, and collections for secrets exposure, unsafe privilege use, weak file modes, shell injection risks, and insecure network defaults.

## Secrets Management

### Bad Practices

```yaml
- hosts: db
  vars:
    db_password: "secret123"
    aws_secret_key: "AKIAIOSFODNN7EXAMPLE"
  tasks:
    - name: Create admin user
      ansible.builtin.user:
        name: admin
        password: "P@ssw0rd123"

    - name: Show database password in logs
      ansible.builtin.debug:
        msg: "Database password is {{ db_password }}"
```

### Good Practices

```yaml
- hosts: db
  vars_files:
    - vault.yml
  tasks:
    - name: Create admin user
      ansible.builtin.user:
        name: admin
        password: "{{ vault_admin_password | password_hash('sha512') }}"
      no_log: true

    - name: Read database password from Vault
      ansible.builtin.set_fact:
        db_password: "{{ lookup('community.hashi_vault.hashi_vault', 'secret=secret/data/db:password') }}"
      no_log: true
```

### Review Rules

1. Store secrets in Ansible Vault or an external secret manager.
2. Add `no_log: true` anywhere credentials, tokens, or private keys appear.
3. Never commit plaintext secrets to the repo or inventory.
4. Rotate vault credentials and keep separate vault IDs per environment.
5. Avoid `debug` output for sensitive variables.

## Privilege Escalation

### Bad Practices

```yaml
- hosts: all
  become: true
  become_user: root
  tasks:
    - name: Check application status
      ansible.builtin.command: systemctl status myapp

    - name: Read application config
      ansible.builtin.command: cat /etc/myapp/config.yml

    - name: Install package
      ansible.builtin.apt:
        name: nginx
        state: present
```

### Good Practices

```yaml
- hosts: all
  tasks:
    - name: Check application status
      ansible.builtin.command: systemctl status myapp
      changed_when: false

    - name: Install nginx package
      ansible.builtin.apt:
        name: nginx
        state: present
      become: true

    - name: Write protected configuration
      ansible.builtin.template:
        src: myapp.conf.j2
        dest: /etc/myapp/config.yml
        owner: root
        group: myapp
        mode: "0640"
      become: true
```

### Review Rules

1. Default to no privilege escalation at play level.
2. Add `become: true` only to tasks that need it.
3. Prefer a specific `become_user` when root is unnecessary.
4. Document any unusual `become_flags` or sudo expectations.
5. Audit shell commands run under privilege escalation with extra care.

## File Permissions

### Bad Practices

```yaml
- name: Copy private SSH key with weak mode
  ansible.builtin.copy:
    src: id_rsa
    dest: /home/deploy/.ssh/id_rsa
    mode: "0644"

- name: Install world-writable script
  ansible.builtin.copy:
    src: deploy.sh
    dest: /usr/local/bin/deploy.sh
    mode: "0777"
```

### Good Practices

```yaml
- name: Copy private SSH key with strict mode
  ansible.builtin.copy:
    src: id_rsa
    dest: /home/deploy/.ssh/id_rsa
    owner: deploy
    group: deploy
    mode: "0600"

- name: Install deployment script
  ansible.builtin.copy:
    src: deploy.sh
    dest: /usr/local/bin/deploy.sh
    owner: root
    group: root
    mode: "0755"

- name: Create application config directory
  ansible.builtin.file:
    path: /etc/myapp
    state: directory
    owner: root
    group: myapp
    mode: "0750"
```

### Permission Guidelines

| File Type | Recommended Mode | Owner | Group |
|-----------|------------------|-------|-------|
| Private keys | `0600` | service user | service user |
| Public keys | `0644` | service user | service user |
| Sensitive config | `0640` | root or app user | app group |
| Public config | `0644` | app user | app group |
| Executables | `0755` | root | root |
| Sensitive directories | `0750` | app user | app group |
| Log files | `0640` | app user | app group |

## Command Injection Prevention

### Bad Practices

```yaml
- name: Read user-provided file
  ansible.builtin.shell: "cat {{ user_provided_filename }}"

- name: Create directory from unsanitized input
  ansible.builtin.shell: "mkdir -p {{ directory_name }}"

- name: Run script with raw argument interpolation
  ansible.builtin.shell: "/usr/local/bin/script.sh {{ user_input }}"
```

### Good Practices

```yaml
- name: Validate incoming filename
  ansible.builtin.assert:
    that:
      - user_provided_filename is match("^[A-Za-z0-9._-]+$")
    fail_msg: "Filename contains unsupported characters"

- name: Read validated file
  ansible.builtin.command:
    argv:
      - cat
      - "{{ user_provided_filename }}"
  changed_when: false

- name: Create application directory safely
  ansible.builtin.file:
    path: "{{ directory_name }}"
    state: directory
    mode: "0750"

- name: Run script with stdin instead of shell interpolation
  ansible.builtin.command: /usr/local/bin/script.sh
  args:
    stdin: "{{ user_input }}"
```

### Review Rules

1. Prefer Ansible modules over `shell` or `command`.
2. If shell is unavoidable, validate inputs and use `quote`.
3. Use whitelist validation with `assert` or strict regex tests.
4. Avoid string-built commands when `argv` or module parameters exist.
5. Treat all inventory, extra vars, and prompt input as untrusted.

## Network Security

### Bad Practices

```yaml
- name: Download artifact over HTTP
  ansible.builtin.get_url:
    url: http://example.com/file.tar.gz
    dest: /tmp/file.tar.gz

- name: Fetch certificate without validation
  ansible.builtin.uri:
    url: https://internal.example.com/health
    validate_certs: false

- name: Render service bound to every interface
  ansible.builtin.template:
    src: app.conf.j2
    dest: /etc/app/config.yml
  vars:
    bind_address: "0.0.0.0"
```

### Good Practices

```yaml
- name: Download artifact over HTTPS with checksum
  ansible.builtin.get_url:
    url: https://example.com/file.tar.gz
    dest: /tmp/file.tar.gz
    checksum: "sha256:4d4f8e4dfd2f6b0f5b8cb7d9f9d84b2c4bc53a18d5cb4e41f5d35dca2f1d0abc"

- name: Validate internal health endpoint
  ansible.builtin.uri:
    url: https://internal.example.com/health
    validate_certs: true
    status_code: 200

- name: Restrict app listener and firewall
  block:
    - name: Render service config
      ansible.builtin.template:
        src: app.conf.j2
        dest: /etc/app/config.yml
      vars:
        bind_address: "10.0.5.10"

    - name: Allow HTTPS from internal network only
      ansible.posix.firewalld:
        port: 443/tcp
        source: 10.0.0.0/8
        permanent: true
        state: enabled
        immediate: true
```

### Review Rules

1. Prefer HTTPS and verify certificates by default.
2. Pin downloads with checksums when practical.
3. Bind services to the narrowest interface possible.
4. Restrict ingress with firewall rules or security groups.
5. Review any `validate_certs: false` as an exception, not a default.

## SELinux and AppArmor

### Good Practices

```yaml
- name: Keep SELinux enforcing
  ansible.posix.selinux:
    policy: targeted
    state: enforcing

- name: Label application data path
  community.general.sefcontext:
    target: "/srv/myapp(/.*)?"
    setype: httpd_sys_rw_content_t
    state: present

- name: Apply SELinux labels
  ansible.builtin.command: restorecon -Rv /srv/myapp
  changed_when: false

- name: Reload AppArmor profile
  ansible.builtin.command: apparmor_parser -r /etc/apparmor.d/usr.bin.myapp
  changed_when: false
```

### Review Rules

1. Do not disable SELinux or AppArmor just to make a task pass.
2. Fix labels, profiles, and file contexts instead of weakening enforcement.
3. Use purpose-built modules when available before falling back to shell commands.

## Audit and Logging

### Good Practices

```yaml
- name: Create audited admin user
  block:
    - name: Create admin user
      ansible.builtin.user:
        name: admin
        groups: sudo
        append: true

    - name: Record admin change
      ansible.builtin.lineinfile:
        path: /var/log/ansible-security.log
        create: true
        line: "admin user ensured on {{ inventory_hostname }}"
        mode: "0640"
      changed_when: false
  tags:
    - security
    - identity
```

### Review Rules

1. Tag security-relevant tasks so reviews and selective runs are easier.
2. Make privileged account, firewall, and secret-management changes easy to audit.
3. Avoid logging raw credentials while still preserving operational traceability.

## Security Validation Checklist

Before production runs, verify:

- [ ] No hardcoded passwords, keys, or tokens appear in playbooks, inventory, or vars files.
- [ ] Secrets come from Vault or a secret manager.
- [ ] Sensitive tasks use `no_log: true`.
- [ ] Privilege escalation is limited to tasks that require it.
- [ ] File modes are explicit and appropriate for the resource type.
- [ ] Private keys use `0600`.
- [ ] No world-writable files or directories are created unintentionally.
- [ ] User-controlled input is validated before shell or command execution.
- [ ] Modules replace `shell` and `command` where possible.
- [ ] External downloads use HTTPS and certificate validation.
- [ ] Services do not bind to `0.0.0.0` without a documented reason.
- [ ] SELinux or AppArmor remains enabled.
- [ ] Security-relevant changes are tagged or otherwise auditable.

## Tools for Security Scanning

1. `ansible-lint`
   ```bash
   ansible-lint --profile safety playbook.yml
   ```

2. `checkov`
   ```bash
   checkov -d .
   ```

3. `trivy`
   ```bash
   trivy config .
   ```

4. `git-secrets`
   ```bash
   git secrets --scan
   ```

## Additional Resources

- [Ansible security documentation](https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_privilege_escalation.html)
- [Ansible Vault guide](https://docs.ansible.com/ansible/latest/vault_guide/index.html)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks/)
