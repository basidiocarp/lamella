# Testing Capabilities

This reference covers dry-run testing (check mode) and Molecule testing for Ansible.

## Dry-Run Testing (Check Mode)

**Purpose:** Preview changes that would be made without actually applying them.

**Workflow:**

```bash
# Run in check mode (dry-run)
ansible-playbook -i inventory playbook.yml --check

# Check mode with diff
ansible-playbook -i inventory playbook.yml --check --diff
// ... (9 lines trimmed)

# Step through tasks
ansible-playbook -i inventory playbook.yml --check --step
```

## Check Mode Analysis

When reviewing check mode output, focus on:

### Task Changes

- `ok`: No changes needed
- `changed`: Would make changes
- `failed`: Would fail (check for check_mode support)
- `skipped`: Conditional skip

### Diff Output

- Shows exact changes to files
- Helps identify unintended modifications
- Useful for reviewing template changes

### Handlers

- Which handlers would be notified
- Service restarts that would occur
- Potential downtime

### Failed Tasks

- Some modules don't support check mode
- May need `check_mode: no` override
- Identify tasks that would fail

## Limitations

- Not all modules support check mode
- Some tasks depend on previous changes
- May not accurately reflect all changes
- Stateful operations may show unexpected results

## Safety Considerations

- Always run check mode before real execution
- Review diff output carefully
- Test in non-production first
- Validate changes make sense
- Check for unintended side effects

---

## Molecule Testing

**Purpose:** Test Ansible roles in isolated environments with multiple scenarios.

**Automatic attempt policy:** When validating any Ansible role with a `molecule/` directory, automatically attempt Molecule tests using `bash scripts/test_role.sh <role-path> [scenario]`.

### When to Use

- Automatically triggered when validating roles with molecule/ directory
- Testing roles before deployment
- Validating role compatibility across different OS versions
- Integration testing for complex roles
- CI/CD pipeline validation

### Workflow

```bash
# Initialize molecule for a role
cd roles/myrole
molecule init scenario --driver-name docker

# List scenarios
// ... (17 lines trimmed)
# Keep instances for debugging
molecule converge
molecule login       # SSH into test instance
```

### Test Sequence

1. `dependency` - Install role dependencies
2. `lint` - Run yamllint and ansible-lint
3. `cleanup` - Clean up before testing
4. `destroy` - Destroy existing instances
5. `syntax` - Run syntax check
6. `create` - Create test instances
7. `prepare` - Prepare instances (install requirements)
8. `converge` - Run the role
9. `idempotence` - Run again, verify no changes
10. `side_effect` - Optional side effect playbook
11. `verify` - Run verification tests (Testinfra, etc.)
12. `cleanup` - Final cleanup
13. `destroy` - Destroy test instances

### Molecule Configuration

Check `molecule/default/molecule.yml`:
```yaml
dependency:
  name: galaxy
driver:
  name: docker
platforms:
  - name: instance
    image: ubuntu:22.04
provisioner:
  name: ansible
verifier:
  name: ansible
```

### Verification Tests

Molecule supports multiple verifiers:
- **Ansible** (built-in): Use Ansible tasks to verify
- **Testinfra**: Python-based infrastructure tests
- **Goss**: YAML-based server validation

Example Ansible verifier (`molecule/default/verify.yml`):
```yaml
---
- name: Verify
  hosts: all
  tasks:
    - name: Check service is running
      service:
        name: nginx
        state: started
      check_mode: true
      register: result
      failed_when: result.changed
```

### Common Molecule Errors

- Driver not installed (docker, podman, vagrant)
- Missing Python dependencies
- Platform image not available
- Network connectivity issues
- Insufficient permissions for driver

### Molecule Skip/Fallback Policy (Required)

- If `molecule/` does not exist: mark Molecule as `SKIPPED` and continue.
- If `test_role.sh` exits `2`: mark Molecule as `BLOCKED` (missing/unavailable runtime dependency) and continue.
- If `test_role.sh` exits `1`: mark Molecule as `FAIL` (role/test issue) and continue.
- Never stop the full validation report because Molecule is blocked.

Use this reporting language for blocked Molecule runs:

```text
Molecule Status: BLOCKED
Reason: <missing dependency/runtime and failing command>
Fallback Applied: Completed syntax, lint, check-mode, and security validation without Molecule runtime tests.
Next Action: <install/start dependency>; rerun `bash scripts/test_role.sh <role-path> [scenario]`
```
