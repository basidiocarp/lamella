# Workflow Examples

Detailed step-by-step examples for common validation scenarios.

## Example 1: Validate a Single Playbook

```
User: "Check if this playbook.yml file is valid"

Steps:
1. Run preflight: `bash scripts/setup_tools.sh`
2. Run wrapper: `bash scripts/validate_playbook.sh playbook.yml`
3. If inventory is provided, run check mode: `ansible-playbook -i <inventory> playbook.yml --check --diff`
4. Run security wrappers:
   - `bash scripts/validate_playbook_security.sh playbook.yml`
   - `bash scripts/scan_secrets.sh playbook.yml`
5. If custom modules are detected, run docs lookup workflow (Context7 first, web fallback)
6. Report results with PASS/FAIL/BLOCKED/SKIPPED counts and remediation steps
```

## Example 2: Validate an Ansible Role

```
User: "Validate my ansible role in ./roles/webserver/"

Steps:
1. Run preflight: `bash scripts/setup_tools.sh`
2. Run role wrapper: `bash scripts/validate_role.sh ./roles/webserver/`
// ... (13 lines trimmed)
   - `bash scripts/scan_secrets.sh ./roles/webserver/`
6. If custom modules detected, run documentation lookup workflow
7. Provide final report with severity, blockers, and rerun actions
```

## Example 3: Dry-Run Testing for Production

```
User: "Run playbook in check mode for production servers"

Steps:
1. Verify inventory file exists
2. Run ansible-playbook --check --diff -i production
3. Analyze check mode output
4. Highlight tasks that would change
5. Review handler notifications
6. Flag any security concerns
7. Provide recommendation on safety of applying
```

## Example 4: Understanding Custom Collection Module

```
User: "I'm using community.postgresql.postgresql_db version 2.3.0, what parameters are available?"

Steps:
1. Try Context7 MCP: `mcp__context7__resolve-library-id("ansible community.postgresql")`
2. If found, query docs with `mcp__context7__query-docs` for `postgresql_db`
3. If not found, use `web.search_query`: "ansible community.postgresql version 2.3.0 postgresql_db module documentation"
4. Extract module parameters (required vs optional)
5. Provide examples of common usage patterns
6. Note any version-specific considerations
```

## Example 5: Testing Role with Molecule

```
User: "Test my nginx role with molecule"

Steps:
1. Check if molecule is configured in role
2. Run preflight (`bash scripts/setup_tools.sh`) and confirm Docker/Podman runtime availability
3. Run `bash scripts/test_role.sh <role-path> [scenario]`
4. If exit code is `2`, mark Molecule `BLOCKED`, report reason, and continue non-Molecule checks
5. If exit code is `1`, inspect converge/verify output and report role issues
6. Analyze idempotency, syntax, and verification outcomes
7. Suggest improvements and exact rerun command
```

## Example 6: FQCN Migration Check

```
User: "Check if my playbooks use FQCN"

Steps:
1. Run FQCN scanner: `bash scripts/check_fqcn.sh <path>`
2. Review identified short module names
3. For each finding, consult `references/module_alternatives.md`
4. Provide migration recommendations with specific FQCN replacements
5. Example migrations:
   - `apt` → `ansible.builtin.apt`
   - `copy` → `ansible.builtin.copy`
   - `docker_container` → `community.docker.docker_container`
```

## Example 7: Complete Security Audit

```
User: "Run full security audit on this role"

Steps:
1. Run preflight: `bash scripts/setup_tools.sh`
2. Run Checkov scan: `bash scripts/validate_role_security.sh <role>`
3. Run secrets scan: `bash scripts/scan_secrets.sh <role>`
4. Review both outputs for:
   - Certificate validation issues (CKV_ANSIBLE_*)
   - Hardcoded secrets (passwords, API keys, tokens)
   - Privilege escalation concerns
   - Network security issues
5. Map each finding to `references/security_checklist.md`
6. Provide prioritized remediation steps
```
