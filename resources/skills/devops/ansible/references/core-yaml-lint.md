# YAML and Lint Validation

This reference covers YAML syntax validation and Ansible linting capabilities.

## YAML Syntax Validation

**Purpose:** Ensure YAML files are syntactically correct before Ansible parsing.

**Tools:**
- `yamllint` - YAML linter for syntax and formatting
- `ansible-playbook --syntax-check` - Ansible-specific syntax validation

**Workflow:**

```bash
# Check YAML syntax with yamllint
yamllint playbook.yml

# Or for entire directory
yamllint -c .yamllint .

# Check Ansible playbook syntax
ansible-playbook playbook.yml --syntax-check
```

**Common Issues Detected:**
- Indentation errors
- Invalid YAML syntax
- Duplicate keys
- Trailing whitespace
- Line length violations
- Missing colons or quotes

**Best Practices:**
- Always run yamllint before ansible-lint
- Use 2-space indentation consistently
- Configure yamllint rules in `.yamllint`
- Fix YAML syntax errors first, then Ansible-specific issues

## Ansible Lint

**Purpose:** Enforce Ansible best practices and catch common errors.

**Workflow:**

```bash
# Lint a single playbook
ansible-lint playbook.yml

# Lint all playbooks in directory
ansible-lint .
// ... (9 lines trimmed)

# Show rule details
ansible-lint -L
```

**Common Issues Detected:**
- Deprecated modules or syntax
- Missing task names
- Improper use of `command` vs `shell`
- Unquoted template expressions
- Hard-coded values that should be variables
- Missing `become` directives
- Inefficient task patterns
- Jinja2 template errors
- Incorrect variable usage
- Role dependencies issues

**Severity Levels:**
- **Error:** Must fix - will cause failures
- **Warning:** Should fix - potential issues
- **Info:** Consider fixing - best practice violations

**Auto-fix approach:**
- ansible-lint supports `--fix` for auto-fixable issues
- Always review changes before applying
- Some issues require manual intervention

## Playbook Syntax Check

**Purpose:** Validate playbook syntax without executing tasks.

**Workflow:**

```bash
# Basic syntax check
ansible-playbook playbook.yml --syntax-check

# Syntax check with inventory
ansible-playbook -i inventory playbook.yml --syntax-check

# Syntax check with extra vars
ansible-playbook playbook.yml --syntax-check -e @vars.yml

# Check all playbooks
for file in *.yml; do
  ansible-playbook "$file" --syntax-check
done
```

**Validation Checks:**
- YAML parsing
- Playbook structure
- Task definitions
- Variable references
- Module parameter syntax
- Jinja2 template syntax
- Include/import statements

**Error Handling:**
- Parse error messages for specific issues
- Check for typos in module names
- Verify variable definitions
- Ensure proper indentation
- Check file paths for includes/imports
