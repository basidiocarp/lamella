# Ansible Testing Examples

This directory exists to exercise the Ansible validation and extraction scripts against both good and bad fixtures.

## Contents

- `playbooks/good-playbook.yml`: expected to pass
- `playbooks/bad-playbook.yml`: expected to fail with multiple findings
- `roles/geerlingguy.mysql/`: production-quality role fixture
- `test_regressions.sh`: targeted regression runner

## Typical Commands

```bash
bash ../scripts/validate_playbook.sh playbooks/good-playbook.yml
bash ../scripts/validate_playbook.sh playbooks/bad-playbook.yml
bash test_regressions.sh
bash ../scripts/test_role.sh roles/geerlingguy.mysql
```

## What These Fixtures Cover

- YAML and syntax validation
- Ansible lint and role-structure checks
- Module extraction
- Molecule-driven role validation when runtime dependencies are available

## Expected Outcome

Use these fixtures to confirm that validators catch naming, security, structure, and best-practice failures without regressing on known-good playbooks and roles.
