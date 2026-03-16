# CI/CD Integration

Integration patterns for GitHub Actions validation in CI/CD pipelines.

## Pre-commit Hook

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Run quick audit on changed agent/skill/command files
changed_files=$(git diff --cached --name-only | grep -E "^\.github/workflows/")
// ... (10 lines trimmed)
        fi
    done
fi
```

## GitHub Actions Workflow

```yaml
name: Validate Workflows
on:
  pull_request:
    paths:
      - '.github/workflows/**'
// ... (12 lines trimmed)
      - name: Validate workflows
        run: |
          actionlint -verbose .github/workflows/
```

## GitLab CI Integration

```yaml
validate-workflows:
  stage: lint
  image: rhysd/actionlint:latest
  script:
    - actionlint .github/workflows/
  only:
    changes:
      - .github/workflows/**
```

## Advanced: Validation with act

```yaml
name: Test Workflows Locally
on:
  pull_request:
    paths:
      - '.github/workflows/**'
// ... (15 lines trimmed)
      - name: Dry-run workflows
        run: |
          act -n push --container-architecture linux/amd64
```

## Done Criteria for CI/CD

Validation work is complete when all are true:
- Trigger matched and correct validation mode selected
- Each mapped error includes source reference and minimal quote
- Each unmapped error is labeled `UNMAPPED` with exact output captured
- Public action versions are verified, or marked `UNVERIFIED-OFFLINE`
- Post-fix rerun executed and result reported
