---
name: organizational-health-diagnostic
description: "Builds organizational health reviews across product, people, operations, and finance."
origin: lamella
---
# Organizational Health Diagnostic

Use this skill to turn fragmented business metrics into a compact health review. The output should highlight the few dimensions that need action now, explain likely cascade risks, and call out missing data that weakens confidence.

## When to Use

- Preparing a board or leadership health review
- Checking whether one weak function is starting to affect others
- Converting mixed operating metrics into a simple red-yellow-green picture
- Establishing a repeatable monthly or quarterly health scorecard

## Quick Start

Run the scorer with the sample data:

```bash
python scripts/health_scorer.py
```

On Windows PowerShell:

```powershell
py -3 .\scripts\health_scorer.py
```

For JSON output:

```bash
python scripts/health_scorer.py --json
```

## Workflow

1. **Choose the stage and review scope**
   Align the diagnostic to company stage and whether the review is company-wide or focused on a specific function.

2. **Collect signals across the core dimensions**
   Review:
   - financial
   - revenue
   - product
   - engineering
   - people
   - operations
   - security
   - market

3. **Score the dimensions without hiding gaps**
   Use available data, but mark missing inputs explicitly. A partial score is still useful when the missing metrics are visible.

4. **Identify the cascade risks**
   Do not stop at the red metric. Explain which downstream functions are likely to degrade next if the issue persists.

5. **Recommend the next review cadence**
   State whether the health check should be rerun weekly, monthly, or quarterly based on current risk.

Use `references/health-benchmarks.md` when the user needs stage-specific thresholds. Use `scripts/health_scorer.py` when the user can supply metrics or wants a reusable CLI-based scoring pass.

## Output Expectations

Produce:
- a dimension-by-dimension health summary
- the top 3 priorities
- the likely cascade risks
- the most important missing data
- the next review cadence and owner

## Quality Checklist

- [ ] Scores reflect company stage rather than generic SaaS benchmarks
- [ ] Red dimensions include concrete action owners
- [ ] Cascade risks are named explicitly
- [ ] Missing metrics are shown instead of ignored
- [ ] The final view is decision-ready, not a metric dump
