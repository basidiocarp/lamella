# Conventional Commits

Use these rules when a release workflow depends on commit parsing.

## Format

```text
<type>[optional scope]: <description>
```

## Release-Relevant Types

- `feat` -> minor
- `fix` -> patch
- `perf` -> patch
- `security` -> patch
- `feat!` or `BREAKING CHANGE:` -> major

Types such as `docs`, `style`, `test`, `ci`, and `chore` usually do not drive a
version bump on their own.

## Good Examples

```text
feat(auth): add OAuth2 login
fix(api): handle missing tenant header
feat!: remove deprecated billing endpoint
```

## Rules

- Use a clear scope only when it helps the release reader.
- Keep the description short and concrete.
- Mark breaking changes explicitly; do not rely on release tooling to guess.
