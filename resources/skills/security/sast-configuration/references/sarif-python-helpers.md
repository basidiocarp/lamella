# SARIF Python Helpers

Use this reference when Python scripts need to read, merge, or post-process SARIF output.

## Common Tasks

- load SARIF files
- aggregate multiple runs
- deduplicate findings
- normalize file paths
- extract or prioritize findings
- write modified SARIF back out

## Rule

Keep SARIF helpers deterministic and schema-aware. Prefer preserving the original run structure over flattening everything into a lossy custom format too early.
