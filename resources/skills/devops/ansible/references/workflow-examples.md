# Workflow Examples

Examples for common validation scenarios.

## Validate a Single Playbook

1. run `bash scripts/setup_tools.sh`
2. run `bash scripts/validate_playbook.sh playbook.yml`
3. run check mode if inventory is available
4. run security wrappers
5. report PASS, FAIL, BLOCKED, or SKIPPED

## Validate an Ansible Role

1. run `bash scripts/setup_tools.sh`
2. run `bash scripts/validate_role.sh ./roles/webserver/`
3. run Molecule if configured
4. run security scans
5. report blockers and rerun steps

## Dry-Run for Production

1. verify inventory
2. run `ansible-playbook --check --diff`
3. review changes and handlers
4. flag risk before recommending apply

## FQCN Migration Check

1. run `bash scripts/check_fqcn.sh <path>`
2. review short module names
3. recommend exact FQCN replacements
