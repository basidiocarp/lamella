---
name: semgrep
description: "Runs Semgrep static analysis scans and helps create custom Semgrep rules."
origin: lamella
---

# Semgrep Security Scan

Use this skill to run Semgrep scans with explicit approval gates, ruleset selection, and merged SARIF output. This file is the routing layer; operational detail lives in the linked workflow and reference files.

## Essential Rules

1. Every `semgrep` command must include `--metrics=off`.
2. Step 3 is a hard approval gate. The original request is not approval.
3. Include third-party rulesets when the detected language has good coverage.
4. Check for Semgrep Pro before scanning.
5. Spawn scan tasks in parallel once the plan is approved.

## Core Workflow

1. Resolve `OUTPUT_DIR`.
2. Detect languages and Pro availability.
3. Select scan mode and exact rulesets.
4. Present the plan and wait for explicit approval.
5. Spawn parallel scan tasks.
6. Merge SARIF output and report findings.

## Output Layout

```text
$OUTPUT_DIR/
├── rulesets.txt
├── raw/
│   ├── <scan>.json
│   └── <scan>.sarif
└── results/
    └── results.sarif
```

## Scan Modes

| Mode | Coverage | Result Shape |
|------|----------|--------------|
| `run all` | All approved rulesets and severities | Full raw plus merged SARIF |
| `important only` | All approved rulesets, filtered twice | Security findings with medium or higher signal |

## Merge Command

```bash
uv run {baseDir}/scripts/merge_sarif.py "$OUTPUT_DIR/raw" "$OUTPUT_DIR/results/results.sarif"
```

## Task Agent

Use `subagent_type: static-analysis:semgrep-scanner` for Step 5 scanner tasks.

## References

- [workflows/scan-workflow.md](workflows/scan-workflow.md)
- [references/rulesets.md](references/rulesets.md)
- [references/scan-modes.md](references/scan-modes.md)
- [references/scanner-task-prompt.md](references/scanner-task-prompt.md)
- [references/rule-creator-workflow.md](references/rule-creator-workflow.md)
- [references/rule-creator-quick-reference.md](references/rule-creator-quick-reference.md)
- [references/rule-creator-language-syntax-guide.md](references/rule-creator-language-syntax-guide.md)
- [references/rule-creator-variant-workflow.md](references/rule-creator-variant-workflow.md)
- [references/rule-creator-applicability-analysis.md](references/rule-creator-applicability-analysis.md)
