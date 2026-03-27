# Security Scanning

Use both linting and security scanning when validating Ansible.

## Checkov Workflow

```bash
bash scripts/validate_playbook_security.sh playbook.yml
bash scripts/validate_playbook_security.sh /path/to/playbooks/
checkov -d . --framework ansible --skip-check CKV_ANSIBLE_1
```

## What to Look For

- certificate validation disabled
- HTTP used where HTTPS is expected
- package verification bypassed
- missing block error handling
- insecure cloud defaults

## Complementary Checks

```bash
bash scripts/validate_playbook.sh playbook.yml
bash scripts/scan_secrets.sh playbook.yml
```

Use `ansible-lint` for quality and `Checkov` plus secret scanning for security.
