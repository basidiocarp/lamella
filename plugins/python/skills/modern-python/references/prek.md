# prek: Fast Pre-commit Hooks

`prek` is a fast Rust-native drop-in replacement for `pre-commit`.

## Common Commands

```bash
prek install
prek run --all-files
prek auto-update
```

## Recommended Hook Shape

```yaml
repos:
  - repo: builtin
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
```

## Best Practices

- pin hook versions
- run `prek run --all-files` in CI
- prefer builtin hooks when available
