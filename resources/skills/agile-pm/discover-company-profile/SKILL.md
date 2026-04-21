---
name: discover-company-profile
description: "Builds company profiles from public signals and strategy context."
origin: lamella
---
# Discover Company Profile

Use this skill to create a compact profile of one company from public sources. The goal is to surface how the company thinks, what its product strategy appears to be, where it is changing, and what that implies for partnerships, interviews, or market understanding.

## When to Use

- Preparing for an interview with a specific company
- Building a single-company briefing before a partnership or sales conversation
- Researching one company’s product strategy and operating signals
- Understanding a market participant before doing a wider competitive comparison

## Boundaries

- Use `agile-pm/discover-competitive-analysis` for multi-company comparison and positioning.
- Use `agile-pm/discover-stakeholder-summary` for internal project stakeholders and engagement planning.
- Do not treat public-company or startup research as validated internal truth. Mark inference clearly.

## Workflow

1. **Define the research objective**
   State the company, the reason for the profile, and the 3 to 5 questions the briefing needs to answer.

2. **Collect public-source signals**
   Prefer primary or close-to-primary sources:
   - executive interviews
   - earnings material
   - product blog posts
   - engineering posts
   - launch notes
   - conference talks
   - public hiring or org signals

3. **Separate facts from inference**
   Document what is directly supported by sources and what is your read on the pattern. Do not blend them together.

4. **Synthesize across the key lenses**
   Build the profile around:
   - company overview
   - executive perspective
   - product strategy
   - recent launches or bets
   - transformation themes
   - org or PM operating signals
   - likely near-term priorities and risks

5. **Finish with decision-useful takeaways**
   End with the few observations that matter for the user's decision, conversation, or strategy work.

Use `references/template.md` when the user needs a fill-in structure for the final profile.

## Output Expectations

Produce:
- the research objective
- a compact company overview
- the key executive and product signals
- the main transformation or operating themes
- the most likely priorities, risks, and open questions

## Quality Checklist

- [ ] The profile is about one company, not a disguised competitor matrix
- [ ] Public facts and inference are separated clearly
- [ ] Executive quotes or positions are recent enough to matter
- [ ] Product strategy is grounded in observable launches or statements
- [ ] The final takeaway section is useful for a real decision or conversation
