---
name: github-actions-validator
description: "Validates, lints, audits, and fixes GitHub Actions workflows in `.github/workflows`."
origin: lamella
---

# GitHub Actions Validator


## Contents

- [Overview](#overview)
- [When to Use This Skill](#when-to-use-this-skill)
- [Quick Start](#quick-start)
- [Core Validation Workflow](#core-validation-workflow)
- [Reference Files Summary](#reference-files-summary)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)
- [Limitations](#limitations)


## Overview

Validate and test GitHub Actions workflows using actionlint and act. Provides syntax checking, static analysis, local execution testing, and version verification.

**Trigger Phrases**:
- "validate this GitHub Actions workflow"
- "check my `.github/workflows/*.yml` file"
- "debug actionlint errors"
- "test this workflow locally with act"

## When to Use This Skill

- Validating `.github/workflows/*.yml` for syntax errors
- Testing workflows locally with `act` before pushing
- Debugging workflow failures
- Validating custom or public actions
- Pre-commit validation

## Quick Start

```bash
# Set skill path
SKILL_DIR="${CLAUDE_SKILL_DIR}"

# Install tools
bash "$SKILL_DIR/scripts/install_tools.sh"

# Validate workflow syntax and embedded shell blocks
bash "$SKILL_DIR/scripts/validate_workflow.sh" .github/workflows/

# Run security-oriented checks
bash "$SKILL_DIR/scripts/audit_workflow.sh" .github/workflows/

# Test-only with act
bash "$SKILL_DIR/scripts/validate_workflow.sh" --test-only .github/workflows/
```

## Core Validation Workflow

1. **Run validation**: `validate_workflow.sh <file>`
2. **Map errors to references**: Use error mapping table
3. **Apply fixes**: Quote minimal snippets from references
4. **Verify**: Mandatory rerun after fixes

**Fallback behavior**:
- Missing `act`: Falls back to actionlint-only
- Missing Docker: Skips act, continues with actionlint

## Reference Files Summary

| File | Content |
|------|---------|
| [references/error-handling.md](references/error-handling.md) | Execution flow, error mapping tables |
| [references/worked-example.md](references/worked-example.md) | Complete multi-error workflow example |
| [references/cicd-integration.md](references/cicd-integration.md) | Pre-commit hooks, GitHub Actions integration |
| `references/common_errors.md` | Common errors catalog with fixes |
| `references/action_versions.md` | Current action versions, deprecations |
| `references/runners.md` | GitHub-hosted runner labels |
| `references/act_usage.md` | Act tool usage and limitations |
| `references/modern_features.md` | Reusable workflows, OIDC, SBOM |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Tools not found" | Run `install_tools.sh` |
| "Docker not running" | Start Docker or use `--lint-only` |
| "Permission denied" | Run `chmod +x scripts/*.sh` |
| act fails but GitHub works | Check `act_usage.md` Limitations |

**Debug mode**:
```bash
actionlint -verbose .github/workflows/ci.yml
act -v    # Verbose
act -n    # Dry-run
```

## Best Practices

1. **Validate locally first** - Catch errors before pushing
2. **Use actionlint in CI/CD** - Automate validation
3. **Pin action versions** - Use `@v6` not `@main`; SHA pinning for security
4. **Keep tools updated** - Regular updates for actionlint and act
5. **Enable shellcheck** - Catch shell script issues

## Limitations

- **act limitations**: Not all GitHub features work locally
- **Docker requirement**: act requires Docker
- **Network actions**: GitHub API actions may fail locally
- **Private actions**: Cannot validate without access
- **File location**: act only validates `.github/workflows/`

## Done Criteria

- ✅ Trigger matched and correct validation mode selected
- ✅ Each error mapped to reference with minimal quote
- ✅ Unmapped errors labeled `UNMAPPED` with exact output
- ✅ Public action versions verified or marked `UNVERIFIED-OFFLINE`
- ✅ Post-fix rerun executed and result reported
### Additional Resources

- [Actionlint Usage](references/actionlint_usage.md)
