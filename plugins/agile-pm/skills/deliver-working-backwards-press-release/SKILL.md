---
name: deliver-working-backwards-press-release
description: "Creates an Amazon-style Working Backwards press release to define customer value before building."
origin: lamella
---
# Deliver Working Backwards Press Release

Use this skill to write a customer-facing press release before building. The goal is to force clarity on the problem, audience, benefit, and strategic narrative early enough that the team can still change direction.

## When to Use

- Defining a new product or major feature before execution starts
- Aligning leaders on the customer value of a strategic bet
- Testing whether an idea is compelling enough to deserve investment
- Turning a vague vision into a concrete customer-facing narrative

## Boundaries

- Use `agile-pm/define-problem-statement` to sharpen the user and business problem first.
- Use `agile-pm/deliver-prd` after the idea is strong enough to specify.
- Do not use this as final launch-day PR copy. This is a planning artifact.

## Workflow

1. **State the audience and problem**
   Confirm who the release is for and what pain or unmet need it addresses.

2. **Write the headline and opening**
   Lead with the customer benefit, not feature labels or internal jargon.

3. **Describe the problem and outcome**
   Explain the customer problem first, then show how the product changes the outcome.

4. **Add the leader quote and supporting detail**
   Keep the quote customer-focused and specific. Add only the details needed to make the promise believable.

5. **Stress-test the release**
   Ask whether the story is clear, specific, measurable, and compelling enough that a real customer would care.

Use `references/template.md` when the user needs a fill-in structure.

## Output Expectations

Produce:
- the headline
- the opening paragraph
- the problem and solution paragraphs
- the leadership quote
- the supporting detail and CTA

## Quality Checklist

- [ ] The release is written from the customer's perspective
- [ ] Benefits are clearer than features
- [ ] Claims are specific enough to test or prove
- [ ] Language is free of internal jargon
- [ ] The story is compelling enough to use as a planning filter
