---
name: map-customer-journey
description: "Maps a customer journey across stages, touchpoints, actions, emotions, KPIs, and team ownership."
origin: lamella
---
# Map Customer Journey

Use this skill to turn customer research into a cross-functional journey map. The output should show what customers do, what they feel, where the friction lives, how success is measured, and which teams own each stage.

## When to Use

- Diagnosing a broken onboarding, purchase, support, or retention experience
- Aligning multiple teams on the full customer lifecycle
- Translating research into a service or lifecycle view
- Identifying stage-specific pain points, ownership gaps, or KPI blind spots

## Boundaries

- Use `agile-pm/define-jtbd-canvas` to clarify the underlying job and motivation first.
- Use `agile-pm/discover-interview-synthesis` to turn raw research into evidence before building the map.
- Do not use this as a substitute for a product user flow or a service blueprint with detailed internal processes.

## Workflow

1. **Pick one persona or segment**
   Map one customer type at a time. Mixing segments produces a vague artifact.

2. **Define the lifecycle stages**
   Choose the real stages for this experience, such as awareness, evaluation, onboarding, first value, expansion, or renewal.

3. **Map each stage**
   For every stage, capture:
   - customer actions
   - touchpoints
   - emotions and thoughts
   - KPIs
   - business goals
   - team ownership

4. **Find the friction and ownership gaps**
   Highlight the stages where the experience breaks, where metrics are weak, or where no team clearly owns the problem.

5. **Turn the map into action**
   End with the top improvements, the KPI changes to watch, and the teams that need to collaborate next.

Use `references/template.md` when the user needs a fill-in structure for the journey map.

## Output Expectations

Produce:
- the chosen persona or segment
- the stage-by-stage map
- the key pain points and emotional lows
- the ownership and KPI gaps
- the top improvement opportunities

## Quality Checklist

- [ ] The map covers one clear segment or persona
- [ ] Stages reflect the real lifecycle, not a generic funnel
- [ ] Emotions are grounded in research rather than invented
- [ ] KPIs and team ownership are explicit at each stage
- [ ] The final output identifies actionable cross-functional improvements
