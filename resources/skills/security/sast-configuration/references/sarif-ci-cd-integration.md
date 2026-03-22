# SARIF CI/CD Integration

## GitHub Actions

```yaml
- name: Upload SARIF
  uses: github/codeql-action/upload-sarif@v3
  with:
    sarif_file: results.sarif

- name: Check for high severity
  run: |
    HIGH_COUNT=$(jq '[.runs[].results[] | select(.level == "error")] | length' results.sarif)
    if [ "$HIGH_COUNT" -gt 0 ]; then
      echo "Found $HIGH_COUNT high severity issues"
      exit 1
    fi
```

## Fail on New Issues

```python
from sarif import loader

def check_for_regressions(baseline: str, current: str) -> int:
    baseline_data = loader.load_sarif_file(baseline)
    current_data = loader.load_sarif_file(current)

    baseline_fps = {get_fingerprint(r) for r in baseline_data.get_results()}
    new_issues = [r for r in current_data.get_results()
                  if get_fingerprint(r) not in baseline_fps]

    return len(new_issues)
```

## sarif-tools CLI Commands

```bash
# Summary of findings
sarif summary results.sarif

# List all results with details
sarif ls results.sarif

# Get results by severity
sarif ls --level error results.sarif

# Diff two SARIF files (find new/fixed issues)
sarif diff baseline.sarif current.sarif

# Convert to other formats
sarif csv results.sarif > results.csv
sarif html results.sarif > report.html
```

## Schema Validation

```bash
# Using ajv-cli
npm install -g ajv-cli
ajv validate -s sarif-schema-2.1.0.json -d results.sarif

# Using Python jsonschema
pip install jsonschema
```
