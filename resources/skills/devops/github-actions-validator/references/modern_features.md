# Modern GitHub Actions Features Reference

This reference covers validation of modern GitHub Actions features including reusable workflows, attestations, OIDC authentication, and more.

## Reusable Workflows

### Validation Points
- `workflow_call` trigger configuration
- Required and optional inputs with correct types
- Secrets declaration and usage
- Outputs definition

### Example

```yaml
# Reusable workflow (.github/workflows/reusable-deploy.yml)
on:
  workflow_call:
    inputs:
      environment:
// ... (20 lines trimmed)
      - name: Deploy
        id: deploy
        run: echo "url=https://example.com" >> $GITHUB_OUTPUT
```

### Common Errors
- Incorrect input types (string, number, boolean)
- Missing required secrets
- Invalid output references

### Workflow Limits (November 2025)

GitHub Actions increased reusable workflow limits:
- Nested workflows: Up to 10 levels (previously 4)
- Total workflows per run: Up to 50 workflows (previously 20)

This enables complex workflow compositions and better code reuse.

---

## SBOM and Build Provenance Attestations

### Validation Points
- Correct permissions (`id-token: write`, `attestations: write`)
- Valid artifact paths
- Proper attestation action usage

### Example

```yaml
permissions:
  id-token: write
  contents: read
  attestations: write

// ... (21 lines trimmed)
      - uses: actions/attest-build-provenance@v3
        with:
          subject-path: '${{ github.workspace }}/dist/*.tar.gz'
```

### Common Errors
- Missing required permissions
- Invalid subject-path glob patterns
- Incorrect SBOM format

---

## OIDC Authentication

### Validation Points
- Correct permissions (`id-token: write`)
- Valid audience claims
- Proper OIDC provider configuration
- Token claim validation in receiving systems

### Available Token Claims (November 2025)

| Claim | Description |
|-------|-------------|
| `repository` | Repository name |
| `ref` | Git ref (branch/tag) |
| `sha` | Commit SHA |
| `workflow` | Workflow name |
| `run_id` | Workflow run ID |
| `run_attempt` | Attempt number |
| `check_run_id` | **NEW** - Specific check run ID for the job |
| `actor` | User who triggered the workflow |
| `environment` | Deployment environment (if applicable) |

### Example: AWS OIDC

```yaml
permissions:
  id-token: write
  contents: read

jobs:
// ... (9 lines trimmed)

      - name: Deploy to AWS
        run: aws s3 sync ./build s3://my-bucket/
```

### AWS IAM Policy with check_run_id

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {
// ... (11 lines trimmed)
    }
  }]
}
```

### What check_run_id Enables
- Fine-grained access control: Trace tokens to exact job and compute
- Improved auditability: Track which specific check run made API calls
- Least-privilege policies: Attribute-based access control without enumerating repositories
- Faster revocation: Reduce secret exposure risk

---

## Deployment Environments

### Validation Points
- Environment name configuration
- Protection rules compatibility
- Required reviewers setup
- Environment variables and secrets scope

### Example

```yaml
jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    environment:
      name: staging
// ... (11 lines trimmed)
    steps:
      - uses: actions/checkout@v6
      - run: ./deploy.sh production
```

### Common Errors
- Undefined environment names
- Missing URL for environment tracking
- Incorrect environment variable scope

---

## Job Summaries

### Validation Points
- Correct usage of `$GITHUB_STEP_SUMMARY`
- Valid Markdown formatting
- Proper escaping of dynamic content

### Example

```yaml
steps:
  - name: Run tests
    id: tests
    run: |
      # Run tests and capture results
// ... (11 lines trimmed)
      echo "|--------|-------|" >> $GITHUB_STEP_SUMMARY
      echo "| Passed | ${{ steps.tests.outputs.passed }} |" >> $GITHUB_STEP_SUMMARY
      echo "| Failed | ${{ steps.tests.outputs.failed }} |" >> $GITHUB_STEP_SUMMARY
```

Note: Job summaries are runtime features - actionlint validates script syntax but not summary content.

---

## Container Jobs

### Validation Points
- Valid container image references
- Correct volume mounts
- Environment variable configuration
- Service container networking

### Example

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    container:
      image: node:24
// ... (32 lines trimmed)
          DATABASE_URL: postgres://postgres:postgres@postgres:5432/testdb
          REDIS_URL: redis://redis:6379
        run: npm test
```

### Common Errors
- Invalid image tags
- Incorrect volume mount syntax
- Service container networking issues
- Missing health checks for services

---

## Matrix Strategies

### Validation Points
- Matrix values must be arrays
- Valid matrix variable references
- Proper include/exclude syntax

### Example

```yaml
jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      fail-fast: false
// ... (14 lines trimmed)
        with:
          node-version: ${{ matrix.node }}
      - run: npm test
```

---

## Concurrency Control

### Validation Points
- Valid concurrency group names
- Proper cancel-in-progress usage

### Example

```yaml
name: CI

on:
  push:
    branches: [main]
// ... (9 lines trimmed)
    steps:
      - uses: actions/checkout@v6
      - run: npm ci && npm run build
```

This prevents redundant runs while protecting main branch runs from cancellation.