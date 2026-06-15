---
name: storyboard
description: "Creates a six-frame storyboard that shows one user narrative from problem to outcome."
origin: lamella
---
# Storyboard

Use this skill to turn a product idea into a short visual narrative. The goal is to make the human story concrete enough that a team can react to the problem, urgency, solution, and outcome before the work is designed or built in detail.

## When to Use

- Aligning a team on the customer story behind a new feature or product
- Pitching a concept to stakeholders, leadership, or investors
- Stress-testing whether a solution narrative is actually compelling
- Turning a vague product vision into a concrete user journey with emotional weight

## Boundaries

- Use `agile-pm/define-problem-statement` when the user and business problem is still unclear.
- Use `agile-pm/map-customer-journey` when the work is a broader lifecycle or service map rather than one focused story.
- Use `agile-pm/deliver-working-backwards-press-release` when the artifact should be a customer-facing narrative document instead of a storyboard sequence.
- Do not treat the storyboard as a UI mockup or implementation plan.

## Workflow

1. **Define the main character**
   Identify the specific person, role, and context. Avoid generic personas.

2. **State the problem**
   Describe the pain or friction in concrete terms. Make the cost visible.

3. **Create the escalation**
   Add the moment where the problem becomes urgent enough that change is necessary.

4. **Introduce the solution**
   Show how the product or feature enters the story without forcing the setup.

5. **Write the breakthrough**
   Describe the first meaningful moment when the user feels the change in outcome.

6. **Show life after**
   End with the improved state, using observable changes instead of vague satisfaction language.

Use `references/template.md` when the user needs a fill-in storyboard structure. Use `references/examples.md` when the team needs a compact example before drafting.

## Output Expectations

Produce:
- the six-frame narrative
- the main emotional and operational shift
- the optional visual style notes
- the one or two weakest frames that still need work

## Quality Checklist

- [ ] The main character is specific enough to recognize as a real person
- [ ] The problem has concrete cost or friction
- [ ] The escalation feels believable rather than theatrical
- [ ] The solution is framed through outcome, not feature hype
- [ ] The final state is concrete and measurable enough to matter
