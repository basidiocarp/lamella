---
name: sast-configuration
description: "Configures SAST tools, scans, and SARIF processing workflows."
origin: lamella
---

# SAST Configuration

Use this skill to set up or normalize a SAST pipeline across Semgrep, CodeQL, SonarQube, and SARIF-processing utilities. This file is the routing layer for tool choice, SARIF handling, and variant-analysis assets.

## When to Use

- Adding SAST scanning to CI or pre-merge workflows
- Choosing between Semgrep, CodeQL, and SonarQube for a codebase
- Processing SARIF output from multiple tools
- Building custom rules or variant-analysis workflows
- Reducing false positives while keeping useful coverage

## Core Workflow

1. Identify languages, compliance requirements, and CI constraints.
2. Choose the primary scanner for each language surface.
3. Run a baseline scan and classify the findings.
4. Tune ignores, severities, and path filters.
5. Standardize SARIF processing for aggregation, filtering, and reporting.
6. Add custom rules or variant-analysis assets only after the base pipeline is stable.

## Tool Fit

| Tool | Best For |
|------|----------|
| Semgrep | Fast custom rules and broad language coverage |
| CodeQL | Deep code-property analysis and research workflows |
| SonarQube | Combined code-quality and security gates |

## SARIF Processing

Use the SARIF helpers when you need to load `runs[].results[]`, normalize paths, deduplicate alerts, or prepare CI summaries. Keep scanner execution detail in the dedicated tool skills and use this skill to orchestrate the overall pipeline.

## Key Assets

- [assets/sarif_helpers.py](assets/sarif_helpers.py)
- [assets/sarif-jq-queries.md](assets/sarif-jq-queries.md)
- [assets/variant-variant-report-template.md](assets/variant-variant-report-template.md)
- `assets/variant-semgrep/`
- `assets/variant-codeql/`

## References

- [references/sarif-python-helpers.md](references/sarif-python-helpers.md)
- [references/sarif-jq-queries.md](references/sarif-jq-queries.md)
- [references/sarif-ci-cd-integration.md](references/sarif-ci-cd-integration.md)
- [references/variant-METHODOLOGY.md](references/variant-METHODOLOGY.md)

## Related Skills

- [../codeql/SKILL.md](../codeql/SKILL.md)
- [../semgrep/SKILL.md](../semgrep/SKILL.md)
- [../security-review/SKILL.md](../security-review/SKILL.md)
