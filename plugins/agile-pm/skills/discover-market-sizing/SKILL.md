---
name: discover-market-sizing
description: "Estimates TAM, SAM, and SOM with explicit assumptions, segment logic, and sizing math."
origin: lamella
---
# Discover Market Sizing

Use this skill to build a defensible TAM, SAM, and SOM estimate. The output should make the assumptions visible, show the calculation path, and keep the result useful for decision-making rather than hype.

## When to Use

- Sizing a new market or product opportunity
- Preparing a strategy, board, or investment memo
- Pressure-testing growth claims with explicit assumptions
- Comparing multiple segments or geographies for focus

## Boundaries

- Use `agile-pm/discover-competitive-analysis` for competitor comparison.
- Use `agile-pm/discover-company-profile` for a one-company strategic briefing.
- Do not present speculative market sizing as factual certainty. Show the assumptions.

## Quick Start

Use the calculator when the inputs are known:

```bash
python scripts/market_sizing.py --population 50000 --arpu 1200 --sam-share 0.25 --som-share 0.1
```

On Windows PowerShell:

```powershell
py -3 .\scripts\market_sizing.py --population 50000 --arpu 1200 --sam-share 0.25 --som-share 0.1
```

If TAM is already known:

```bash
python scripts/market_sizing.py --tam 60000000 --sam-share 0.25 --som-share 0.1
```

## Workflow

1. **Define the market frame**
   State the customer, geography, pricing model, and time basis for the estimate.

2. **Choose the sizing method**
   Start with either:
   - bottom-up: addressable customers times ARPU
   - top-down: known market estimate with explicit source assumptions

3. **Calculate TAM, SAM, and SOM**
   Make the narrowing logic visible. Explain why the serviceable and obtainable shares are credible.

4. **Pressure-test the assumptions**
   Identify which inputs are factual, estimated, or speculative. Call out the assumptions with the biggest effect on the result.

5. **Turn the sizing into a decision**
   End with the implication for focus, sequencing, or attractiveness rather than stopping at the number.

Use `references/template.md` when the user needs a fill-in structure. Use `scripts/market_sizing.py` when the user has concrete inputs and wants a reusable calculation path.

## Output Expectations

Produce:
- the market frame
- the TAM, SAM, and SOM values
- the assumption list
- the biggest sensitivities
- the strategic takeaway

## Quality Checklist

- [ ] The customer, geography, and pricing basis are explicit
- [ ] TAM, SAM, and SOM are calculated through visible logic
- [ ] The most sensitive assumptions are called out
- [ ] The sizing is not presented as false precision
- [ ] The final takeaway explains what the numbers mean for a real decision
