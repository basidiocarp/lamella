# Common GitHub Actions Errors and Solutions

Use this file for fast triage before diving into narrower references.

## Syntax Errors

Common causes:

- bad YAML indentation
- missing colons
- tabs instead of spaces
- malformed trigger blocks

```yaml
# Bad
name:My Workflow
jobs:
build:
  runs-on: ubuntu-latest

# Good
name: My Workflow
jobs:
  build:
    runs-on: ubuntu-latest
```

## Expression Errors

```yaml
# Bad
if: ${{ 'true' }}

# Good
if: ${{ true }}
if: github.ref == 'refs/heads/main'
```

Treat untrusted interpolation in `run:` blocks as a security issue. Move untrusted values into environment variables before shell use.

## Action Errors

- action name typos
- missing required inputs
- undocumented inputs
- stale or deprecated action versions

```yaml
- uses: actions/checkout@v6
```

## Job and Runner Errors

- invalid runner labels
- broken `needs:` graphs
- wrong matrix value types
- path or glob mistakes in filters

## Versioning Note

Prefer current major tags in docs, then pin to SHAs in production security-sensitive workflows where policy requires it.
