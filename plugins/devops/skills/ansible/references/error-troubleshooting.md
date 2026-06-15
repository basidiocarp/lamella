# Error Troubleshooting

Common Ansible errors with detailed solutions and prevention strategies.

## Common Errors and Solutions

### Module Not Found

**Error:** `ERROR! couldn't resolve module/action 'module_name'`

**Solutions:**
1. Install required collection with ansible-galaxy
2. Check `collections/requirements.yml` for missing dependencies
3. Verify collection namespace and name
4. Run: `ansible-galaxy collection install <namespace>.<collection>`

**Prevention:**
- Maintain updated `requirements.yml`
- Use FQCN for all modules
- Run `ansible-galaxy collection install -r requirements.yml` before validation

### Undefined Variable

**Error:** `'variable_name' is undefined`

**Solutions:**
1. Define variable in vars, defaults, or group_vars
2. Check variable precedence
3. Use `default()` filter for optional variables
4. Verify variable file is included

**Prevention:**
- Always provide defaults in `defaults/main.yml`
- Use `{{ var | default('fallback') }}` pattern
- Document required variables in README

### Template Syntax Error

**Error:** `AnsibleError: template error while templating string`

**Solutions:**
1. Check Jinja2 template syntax
2. Verify variable types match filters
3. Ensure proper quote escaping
4. Test template rendering separately

**Prevention:**
- Validate templates with `ansible-playbook --syntax-check`
- Use `{{ var | string }}` for type safety
- Quote variables in shell contexts: `"{{ var }}"`

### Connection Failed

**Error:** `UNREACHABLE! => {"changed": false, "msg": "Failed to connect..."}`

**Solutions:**
1. Verify inventory host accessibility
2. Check SSH configuration and keys
3. Verify `ansible_host` and `ansible_port`
4. Test with `ansible -m ping`

**Prevention:**
- Use SSH key authentication
- Verify host resolution
- Test connectivity before playbook runs

### Permission Denied

**Error:** `Permission denied` or `This command has to be run under the root user`

**Solutions:**
1. Add `become: yes` for privilege escalation
2. Verify sudo/su configuration
3. Check file permissions
4. Verify user has necessary privileges

**Prevention:**
- Document required privileges
- Use `become` only when necessary
- Test with minimum required privileges

### Deprecated Module

**Error:** `DEPRECATION WARNING: The 'module_name' module has been deprecated`

**Solutions:**
1. Check ansible-lint output for replacement
2. Consult module documentation for alternatives
3. Update to recommended module
4. Test functionality with new module

**Prevention:**
- Run ansible-lint regularly
- Check `references/module_alternatives.md`
- Keep ansible and collections updated

### YAML Syntax Error

**Error:** `yaml.scanner.ScannerError: while scanning...`

**Solutions:**
1. Check indentation (use 2 spaces consistently)
2. Verify quote usage
3. Check for special characters
4. Validate with yamllint

**Prevention:**
- Configure editor for YAML
- Run yamllint before ansible-lint
- Use `.yamllint` configuration

### Handler Not Notified

**Error:** Handler doesn't run despite changes

**Solutions:**
1. Verify handler name matches notify
2. Check handler is in correct file (handlers/main.yml)
3. Ensure task actually reports changed
4. Check `--force-handlers` if needed

**Prevention:**
- Use consistent handler naming
- Test handler execution in dry-run
- Document handler dependencies

### Variable Precedence Issues

**Error:** Variable has unexpected value

**Solutions:**
1. Review Ansible variable precedence (22 levels!)
2. Check all variable sources
3. Use `ansible-playbook -e` for highest precedence
4. Debug with `debug: var=variable_name`

**Prevention:**
- Document variable locations
- Use clear naming conventions
- Avoid variable name collisions

### Inventory Parse Error

**Error:** `Unable to parse inventory source`

**Solutions:**
1. Validate YAML/INI syntax
2. Check file encoding (UTF-8)
3. Verify group/host structure
4. Test with `ansible-inventory --list`

**Prevention:**
- Use YAML format for complex inventories
- Run `bash scripts/validate_inventory.sh`
- Document inventory structure

## Debugging Tips

### Enable Verbose Output

```bash
# Increasing verbosity levels
ansible-playbook playbook.yml -v    # some debug output
ansible-playbook playbook.yml -vv   # more debug output
ansible-playbook playbook.yml -vvv  # connection debugging
ansible-playbook playbook.yml -vvvv # includes connection plugin
```

### Debug Variables

```yaml
- name: Debug variable value
  debug:
    var: my_variable

- name: Debug with message
  debug:
    msg: "Value is {{ my_variable }}"
```

### Check Mode Debugging

```bash
# Preview changes without applying
ansible-playbook playbook.yml --check --diff

# Step through tasks one by one
ansible-playbook playbook.yml --step
```

### Module Documentation

```bash
# Get module documentation
ansible-doc module_name

# List all modules
ansible-doc -l

# Search modules
ansible-doc -l | grep keyword
```
