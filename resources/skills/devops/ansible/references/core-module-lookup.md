# Custom Module and Collection Documentation Lookup

**Purpose:** Automatically discover and retrieve version-specific documentation for custom modules and collections using web search and Context7 MCP.

## When to Trigger

- Encountering unfamiliar module usage
- Working with custom/private collections
- Debugging module-specific errors
- Understanding new module parameters
- Checking version compatibility
- Deprecated module alternatives

## Detection Workflow

### 1. Extract Module Information

- Use `scripts/extract_ansible_info_wrapper.sh` to parse playbooks and roles
- Identify module usage and collections
- Extract version constraints from `requirements.yml`

### 2. Extract Collection Information

- Identify collection namespaces (e.g., `community.general`, `ansible.posix`)
- Determine collection versions from `requirements.yml` or `galaxy.yml`
- Detect custom/private vs. public collections

## Documentation Lookup Strategy

Use this deterministic lookup order:

1. For public collections/modules:
   - Resolve library: `mcp__context7__resolve-library-id`
   - Query docs: `mcp__context7__query-docs`
2. If Context7 has no suitable result:
   - Use web search via `web.search_query` with versioned queries
   - Prioritize official docs (docs.ansible.com, galaxy.ansible.com, vendor docs)
3. For custom/private modules:
   - Prefer in-repo docs (`README`, module docs, role docs) first
   - Then use targeted web search with collection/module/version terms
4. Always report source + version context used in final guidance

## Search Query Templates

```
# For custom modules
"[module-name] ansible module version [version] documentation"
"[module-name] ansible [module-type] example"
"ansible [collection-name].[module-name] parameters"

# For custom collections
"ansible collection [collection-name] version [version]"
"[collection-namespace].[collection-name] ansible documentation"
"ansible galaxy [collection-name] modules"

# For specific errors
"ansible [module-name] error: [error-message]"
"ansible [collection-name] module failed"
```

## Example Workflow

```
User working with: community.docker.docker_container version 3.0.0

1. Extract module info from playbook:
   tasks:
     - name: Start container
// ... (14 lines trimmed)
   - Check version compatibility

5. Provide version-specific guidance to user
```

## Version Compatibility Checks

- Compare required collection versions with available versions
- Identify deprecated modules or parameters
- Suggest upgrade paths if using outdated versions
- Warn about breaking changes between versions
- Check Ansible core version compatibility

## Common Collection Sources

- **Ansible Galaxy**: Official community collections
- **Red Hat Automation Hub**: Certified collections
- **GitHub**: Custom/private collections
- **Internal repositories**: Company-specific collections
