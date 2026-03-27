# Mobile Permissions and Costs

Mobile tools fail in predictable ways: missing access, background limits, and
cost ceilings. Design for those conditions explicitly.

## Permission Rules

- Request access in context, not on first launch.
- If a permission is denied, return an actionable explanation and a fallback.
- Keep tools permission-aware so the agent can reason about what is available.

Example tool behavior:

```text
read_photos
→ success when photo access is granted
→ blocked with remediation when photo access is denied
```

## Good Permission Fallbacks

- Photos denied: ask for file picker import instead.
- Location denied: continue without location-aware ranking.
- Files denied: prompt for a document picker session.

## Model Tier Guidance

- Use fast or balanced models for tool-heavy loops and short transforms.
- Reserve higher-cost models for synthesis, ranking, or multimodal reasoning.
- Persist intermediate results so a failed or interrupted expensive step does
  not need to re-run from scratch.

## Operational Checklist

- Are permission failures surfaced as blocked states rather than silent errors?
- Can the user recover without reinstalling or reconfiguring the whole app?
- Is higher-cost inference limited to moments that add clear product value?
