# SARIF jq Query Reference

## Basic Queries

```bash
# Pretty print the file
jq '.' results.sarif

# Count total findings
jq '[.runs[].results[]] | length' results.sarif

# List all rule IDs triggered
jq '[.runs[].results[].ruleId] | unique' results.sarif

# Extract errors only
jq '.runs[].results[] | select(.level == "error")' results.sarif
```

## Location Extraction

```bash
# Get findings with file locations
jq '.runs[].results[] | {
  rule: .ruleId,
  message: .message.text,
  file: .locations[0].physicalLocation.artifactLocation.uri,
  line: .locations[0].physicalLocation.region.startLine
}' results.sarif

# Extract findings for a specific file
jq --arg file "src/auth.py" '.runs[].results[] | select(.locations[].physicalLocation.artifactLocation.uri | contains($file))' results.sarif
```

## Aggregation

```bash
# Filter by severity and get count per rule
jq '[.runs[].results[] | select(.level == "error")] | group_by(.ruleId) | map({rule: .[0].ruleId, count: length})' results.sarif

# Count by severity level
jq '[.runs[].results[]] | group_by(.level) | map({level: .[0].level, count: length})' results.sarif

# Get tool names
jq '.runs[].tool.driver.name' results.sarif
```

## Filtering

```bash
# Filter by rule ID
jq '.runs[].results[] | select(.ruleId == "sql-injection")' results.sarif

# Filter by multiple severities
jq '.runs[].results[] | select(.level == "error" or .level == "warning")' results.sarif

# Exclude certain rules
jq '.runs[].results[] | select(.ruleId | contains("style") | not)' results.sarif
```

## Output Formatting

```bash
# CSV-style output
jq -r '.runs[].results[] | [.ruleId, .level, .locations[0].physicalLocation.artifactLocation.uri, .locations[0].physicalLocation.region.startLine] | @csv' results.sarif

# Tab-separated
jq -r '.runs[].results[] | [.ruleId, .level, .message.text] | @tsv' results.sarif
```
