# Custom Module and Collection Documentation Lookup

Use this workflow when you hit an unfamiliar Ansible module or collection.

## Detection Workflow

1. extract module and collection names from the playbook or role
2. identify collection versions from `requirements.yml` or `galaxy.yml`
3. decide whether the target is public, vendor-owned, or private

## Lookup Order

1. Context7 for public collection docs
2. official web docs if Context7 does not resolve
3. in-repo docs first for private modules
4. always report the source and version used

## Search Templates

```text
"[module-name] ansible module version [version] documentation"
"ansible [collection-name].[module-name] parameters"
"ansible [module-name] error [message]"
```

## Version Checks

- deprecated parameters
- collection/core compatibility
- breaking changes between versions
