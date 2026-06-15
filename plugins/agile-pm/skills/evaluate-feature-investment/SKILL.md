---
name: evaluate-feature-investment
description: "Evaluates feature investment using ROI, costs, and strategic value."
origin: lamella
---
# Evaluate Feature Investment

Use this skill to evaluate whether a feature is worth building now. The goal is to combine financial logic and strategic judgment so feature decisions are tied to revenue, retention, cost, and market value instead of intuition alone.

## When to Use

- Pressure-testing a roadmap request before committing
- Comparing multiple feature bets with different ROI profiles
- Defending a build, defer, or reject decision to leadership
- Assessing an expensive feature with real delivery or operating cost

## Boundaries

- Use `agile-pm/discover-market-sizing` for TAM, SAM, and SOM analysis.
- Use `workflow/create-plans` after the feature is worth doing and needs execution planning.
- Use `agile-pm/discover-competitive-analysis` when the question is primarily about competitor position rather than feature economics.

## Workflow

1. **Describe the feature and segment**
   State the feature, target customer, and the business context it affects.

2. **Identify the revenue connection**
   Decide whether the feature affects:
   - direct monetization
   - retention
   - conversion
   - expansion
   - strategic value without direct revenue

3. **Assess the cost structure**
   Capture one-time development cost plus any ongoing COGS or operating cost.

4. **Estimate ROI and margin effect**
   Translate the feature into a rough return model. Make the assumptions visible and avoid false precision.

5. **Layer in strategic value**
   Call out where competitive parity, compliance, platform enablement, or risk reduction changes the recommendation.

6. **Make the decision**
   End with a clear recommendation:
   - build now
   - validate first
   - defer
   - reject

Use `references/conversation-flow.md` when the user needs a worked example of the evaluation sequence.

## Output Expectations

Produce:
- the feature and segment summary
- the revenue connection
- the cost structure
- the ROI or payback view
- the strategic overrides
- the final recommendation

## Quality Checklist

- [ ] The analysis names the actual revenue path, not vague value claims
- [ ] Costs include both build and ongoing run impact
- [ ] Assumptions are explicit and easy to challenge
- [ ] Strategic value is considered separately from pure ROI
- [ ] The final recommendation is direct and defensible
