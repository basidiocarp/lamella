---
name: email-sequence
description: "Designs lifecycle email sequences with triggers, timing, message progression, and ready-to-send drafts."
origin: lamella
---
# Email Sequence

Use this skill to design a triggered email flow instead of a one-off email. The goal is to define who enters the sequence, what each email needs to do, when it should be sent, and how the sequence moves someone toward activation, conversion, or re-engagement.

## When to Use

- Building welcome, onboarding, or nurture sequences
- Creating launch or re-engagement email flows
- Designing lifecycle messaging around trial, purchase, or inactivity triggers
- Tightening an existing sequence that has weak pacing or muddy CTA logic

## Boundaries

- Use `writing/content-writer` for one-off newsletters or individual marketing emails that are not part of a sequence.
- Use `agile-pm/deliver-launch-checklist` when the work is broader launch coordination and the email flow is only one channel.
- Use `agile-pm/deliver-working-backwards-press-release` when the real task is defining the customer narrative before execution starts.

## Workflow

1. **Define the trigger and audience**
   State what starts the sequence, who enters it, and what they already know or have done.

2. **Choose the sequence type**
   Decide whether the flow is:
   - welcome
   - onboarding
   - nurture
   - launch
   - re-engagement
   - post-purchase

3. **Map the progression**
   Give each email one job. Decide the sequence length, the delay between emails, and the point where someone should exit or branch.

4. **Draft each email**
   For each email, provide:
   - purpose
   - timing
   - subject line
   - preview text
   - body copy
   - CTA

5. **Pressure-test the sequence**
   Use `references/email-sequence-playbook.md` to check pacing, subject clarity, CTA quality, and whether the flow leads with value before ask.

6. **Finish with metrics and risks**
   Define the main success metric, the supporting signals, and any sequence conflicts or assumptions that need monitoring.

## Output Expectations

Produce:
- the trigger, audience, and goal
- the sequence overview
- the full draft for each email
- the CTA and timing logic
- the main metrics and risks

## Quality Checklist

- [ ] Every email has one clear job
- [ ] Timing supports momentum without becoming spammy
- [ ] Subject lines are clear before they are clever
- [ ] CTAs are specific and consistent with the stage of the relationship
- [ ] The sequence has an explicit exit or branching condition
