---
name: analytics-tracking
description: "Plans, audits, and debugs analytics tracking with GA4, GTM, event taxonomies, and conversion instrumentation."
origin: lamella
---
# Analytics Tracking

Use this skill to define or repair the instrumentation layer behind product and marketing analytics. The goal is to make events consistent, useful, and debuggable instead of shipping a pile of tags that no one trusts later.

## Reference Files

| File | Purpose |
|------|---------|
| [references/event-taxonomy-guide.md](references/event-taxonomy-guide.md) | Naming rules, event families, and parameter standards |
| [references/gtm-patterns.md](references/gtm-patterns.md) | GTM implementation patterns for data layer, clicks, forms, and SPA flows |
| [references/debugging-playbook.md](references/debugging-playbook.md) | Layer-by-layer workflow for fixing missing, duplicate, or malformed events |
| [scripts/tracking_plan_generator.py](scripts/tracking_plan_generator.py) | Generates a starter tracking plan from a simple JSON brief |

## When to Use

- building a tracking plan for a new product or flow
- auditing existing GA4 or GTM coverage
- debugging missing conversions or duplicate events
- standardizing event names and parameters
- planning consent-aware analytics implementation

## Workflow

### 1. Bound the tracking problem

Confirm:

- whether the task is setup, audit, or debug
- the stack in play: GA4, GTM, app code, consent tooling, ad platforms
- the main conversion and micro-conversion events
- which pages or flows matter most

### 2. Define or repair the taxonomy

Use `references/event-taxonomy-guide.md` to make event names, parameters, and conversion markers consistent before touching dashboards.

### 3. Choose the implementation pattern

Use `references/gtm-patterns.md` to decide whether the right approach is:

- data layer events
- click tracking
- form submission tracking
- SPA route tracking
- consent-gated tracking

### 4. Generate or review the plan

If the user needs a starter plan, run:

```bash
python3 scripts/tracking_plan_generator.py
python3 scripts/tracking_plan_generator.py --json
```

When the user is on PowerShell:

```powershell
py scripts/tracking_plan_generator.py
py scripts/tracking_plan_generator.py --json
```

### 5. Debug from the bottom up

If the data is wrong, use `references/debugging-playbook.md` and verify:

- app code or data layer
- GTM trigger behavior
- network request payload
- GA4 ingestion
- final report layer

## Boundaries

- This skill is for analytics instrumentation, not dashboard interpretation.
- Use `agile-pm/deliver-launch-checklist` when analytics is only one workstream inside a broader launch.
- Do not treat ad-platform attribution differences as proof that the tracking is broken before checking windows, consent, and import settings.
