---
name: compound-scenario-planning
description: "Models compound scenarios that cascade across revenue, people, product, operations, and cash."
origin: lamella
---
# Compound Scenario Planning

Use this skill to model scenarios where more than one thing goes wrong at the same time. The emphasis is on cascades, early warning signals, and hedges that can be put in place before the scenario unfolds.

## When to Use

- Stress-testing a strategy or quarterly plan
- Preparing for fundraising, churn, hiring, or market shocks
- Running a pre-mortem on a major initiative
- Modeling what happens if two or three adverse events compound

## Quick Start

Run the modeler with the bundled sample scenario:

```bash
python scripts/scenario_modeler.py
```

Interactive mode:

```bash
python scripts/scenario_modeler.py --interactive
```

On Windows PowerShell:

```powershell
py -3 .\scripts\scenario_modeler.py --interactive
```

## Workflow

1. **Limit the scenario to 2-3 variables**
   Pick the uncertainties that would materially change the company outcome. More than 3 usually turns planning into noise.

2. **Quantify the first-order hit**
   Estimate probability, timing, revenue or runway impact, and the functions affected.

3. **Map the cascade**
   Show how the first hit affects other domains such as hiring, delivery, retention, or fundraising.

4. **Model severity levels**
   Separate the base case, stress case, and severe case. Do not collapse them into a single blended answer.

5. **Define triggers and hedges**
   Specify what leading indicators to watch and what action should already be decided if those indicators fire.

Use `references/scenario-planning.md` for the planning method, pre-mortem structure, and trigger design. Use `scripts/scenario_modeler.py` when the user wants a reusable scenario report or an interactive CLI flow.

## Output Expectations

Produce:
- the scenario variables
- the base, stress, and severe outcomes
- the cascade map
- the early warning triggers
- the hedges to act on now

## Quality Checklist

- [ ] The scenario uses only the few variables that actually matter
- [ ] Impacts are quantified or bounded with ranges
- [ ] Cascades extend beyond the first-order effect
- [ ] Trigger points are leading indicators, not lagging confirmation
- [ ] Hedges include owner, timing, and practical cost
