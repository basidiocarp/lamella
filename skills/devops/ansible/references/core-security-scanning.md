# Security Scanning

This reference covers security scanning with Checkov and general security validation.

## Security Scanning (Checkov)

**Purpose:** Identify security vulnerabilities and compliance violations in Ansible code using Checkov, a static code analysis tool for infrastructure-as-code.

**What Checkov Provides Beyond ansible-lint:**

While ansible-lint focuses on code quality and best practices, Checkov specifically targets security policies and compliance:

- **SSL/TLS Security:** Certificate validation enforcement
- **HTTPS Enforcement:** Ensures secure protocols for downloads
- **Package Security:** GPG signature verification for packages
- **Cloud Security:** AWS, Azure, GCP misconfiguration detection
- **Compliance Frameworks:** Maps to security standards
- **Network Security:** Firewall and network policy validation

**Workflow:**

```bash
# Scan playbook for security issues
bash scripts/validate_playbook_security.sh playbook.yml

# Scan entire directory
bash scripts/validate_playbook_security.sh /path/to/playbooks/
// ... (9 lines trimmed)

# Scan and skip specific checks
checkov -d . --framework ansible --skip-check CKV_ANSIBLE_1
```

## Common Security Issues Detected

### Certificate Validation

| Check ID | Description |
|----------|-------------|
| CKV_ANSIBLE_1 | URI module disabling certificate validation |
| CKV_ANSIBLE_2 | get_url disabling certificate validation |
| CKV_ANSIBLE_3 | yum disabling certificate validation |
| CKV_ANSIBLE_4 | yum disabling SSL verification |

### HTTPS Enforcement

| Check ID | Description |
|----------|-------------|
| CKV2_ANSIBLE_1 | URI module using HTTP instead of HTTPS |
| CKV2_ANSIBLE_2 | get_url using HTTP instead of HTTPS |

### Package Security

| Check ID | Description |
|----------|-------------|
| CKV_ANSIBLE_5 | apt installing packages without GPG signature |
| CKV_ANSIBLE_6 | apt using force parameter bypassing signatures |
| CKV2_ANSIBLE_4 | dnf installing packages without GPG signature |
| CKV2_ANSIBLE_5 | dnf disabling SSL verification |
| CKV2_ANSIBLE_6 | dnf disabling certificate validation |

### Error Handling

| Check ID | Description |
|----------|-------------|
| CKV2_ANSIBLE_3 | Block missing error handling |

### Cloud Security (when managing cloud resources)

| Check ID | Description |
|----------|-------------|
| CKV_AWS_88 | EC2 instances with public IPs |
| CKV_AWS_135 | EC2 instances without EBS optimization |

## Example Violation

```yaml
# BAD - Disables certificate validation
- name: Download file
  get_url:
    url: https://example.com/file.tar.gz
    dest: /tmp/file.tar.gz
    validate_certs: false  # Security issue!

# GOOD - Certificate validation enabled
- name: Download file
  get_url:
    url: https://example.com/file.tar.gz
    dest: /tmp/file.tar.gz
    validate_certs: true  # Or omit (true by default)
```

## Integration with Validation Workflow

Checkov complements ansible-lint:
1. **ansible-lint** catches code quality issues, deprecated modules, best practices
2. **Checkov** catches security vulnerabilities, compliance violations, cryptographic issues

**Best Practice:** Run both tools for comprehensive validation:
```bash
# Complete validation workflow
bash scripts/validate_playbook.sh playbook.yml           # Syntax + Lint
bash scripts/validate_playbook_security.sh playbook.yml  # Security
```

## Output Format

Checkov provides clear security scan results:
```
Security Scan Results:
  Passed:  15 checks
  Failed:  2 checks
  Skipped: 0 checks

Failed Checks:
  Check: CKV_ANSIBLE_2 - "Ensure that certificate validation isn't disabled with get_url"
    FAILED for resource: tasks/main.yml:download_file
    File: /roles/webserver/tasks/main.yml:10-15
```

## Security and Best Practices Validation

**Security Checks:**

### 1. Secrets Detection

```bash
# Check for hardcoded credentials
grep -r "password:" *.yml
grep -r "secret:" *.yml
grep -r "api_key:" *.yml
grep -r "token:" *.yml
```

**Remediation:** Use Ansible Vault, environment variables, or external secret management

### 2. Privilege Escalation

- Unnecessary use of `become: yes`
- Missing `become_user` specification
- Over-permissive sudo rules
- Running entire playbooks as root

### 3. File Permissions

- World-readable sensitive files
- Missing mode parameter on file/template tasks
- Incorrect ownership settings
- Sensitive files not encrypted with vault

### 4. Command Injection

- Unvalidated variables in shell/command modules
- Missing `quote` filter for user input
- Direct use of {{ var }} in command strings

### 5. Network Security

- Unencrypted protocols (HTTP instead of HTTPS)
- Missing SSL/TLS validation
- Exposing services on 0.0.0.0
- Insecure default ports

## Remediation Resources

- Checkov Policy Index: https://www.checkov.io/5.Policy%20Index/ansible.html
- Ansible Security Checklist: `references/security_checklist.md`
- Ansible Best Practices: `references/best_practices.md`

## Installation

Checkov is automatically installed in a temporary environment if not available system-wide. For permanent installation:

```bash
pip3 install checkov
```

## When to Use

- Before deploying to production
- In CI/CD pipelines for automated security checks
- When working with sensitive infrastructure
- For compliance audits and security reviews
- When downloading files or installing packages
- When managing cloud resources with Ansible
