---
name: deliver-prd
description: "Creates product requirements documents with scope, rationale, and success metrics."
origin: lamella
---
# Product Requirements Document (PRD)

A Product Requirements Document is the primary specification artifact that communicates what to build and why. It bridges the gap between problem understanding and engineering implementation by providing clear requirements, success criteria, and scope boundaries. A good PRD enables engineering to build the right thing while maintaining flexibility on implementation details.

## When to Use

- After problem and solution alignment, before engineering work begins
- When specifying features, epics, or product initiatives for handoff
- When multiple teams need to coordinate on a shared deliverable
- When stakeholders need to approve scope before investment
- As reference documentation during development and QA
- When the request is actually Atlassian administration rather than feature definition, use `atlassian-workspace-admin` instead

## Instructions

When asked to create a PRD, follow these steps:

1. **Interview Until the Problem Is Concrete**
   Ask enough questions to understand the user, the problem, the constraints, and the likely edges of the solution. Resolve major unknowns before writing.

2. **Explore the Current Surface Area**
   If the repo, product, or workflow already exists, inspect it before writing the document. Verify assumptions against the current state rather than writing a speculative PRD.

3. **Summarize the Problem**
   Start with a brief recap of the problem being solved. Link to the problem statement if available. Ensure readers understand *why* this work matters before diving into *what* to build.

4. **Define Goals and Success Metrics**
   Articulate what success looks like. Include specific, measurable metrics with baselines and targets. These metrics should connect directly to the problem being solved.

5. **Outline the Solution**
   Describe the proposed solution at a high level. Focus on user-facing functionality and key capabilities. Include enough detail for stakeholders to evaluate the approach without over-specifying implementation.

6. **Sketch the Deep Modules**
   Identify the modules, services, workflows, or interfaces that need to exist for this feature to work. Prefer deep modules with stable, simple contracts over shallow layers that leak details.

7. **Detail Functional Requirements**
   Break down what the system must do. Use user stories or requirement statements. Each requirement should be testable — someone should be able to verify if it's met.

8. **Define Scope Boundaries**
   Explicitly state what's in scope, out of scope, and deferred to future iterations. Clear scope prevents scope creep and sets realistic expectations.

9. **Capture Implementation Decisions**
   Record the stable decisions the team has already made: module boundaries, contracts, schema shape, integration choices, and other design choices that will materially affect delivery.

10. **Capture Testing Decisions**
    Note what behavior must be tested, where characterization tests may be needed, and what good coverage looks like. Keep this at the level of observable behavior rather than implementation trivia.

11. **Address Technical Considerations**
   Note any technical constraints, architectural decisions, or integration requirements. Don't design the full system, but surface considerations engineering needs to know.

12. **Identify Dependencies and Risks**
   List external dependencies, assumptions, and risks that could impact delivery. Include mitigation strategies where applicable.

13. **Propose Timeline and Milestones**
   Outline key phases and checkpoints. This helps stakeholders understand the delivery plan without committing to specific dates prematurely.

## Output Format

Use the template in `references/template.md` to structure the output.

## Quality Checklist

Before finalizing, verify:

- [ ] Problem and "why now" are clearly articulated
- [ ] Success metrics are specific and measurable
- [ ] Scope boundaries are explicit (in/out/future)
- [ ] Requirements are testable and unambiguous
- [ ] Implementation decisions capture the stable design choices
- [ ] Testing decisions focus on behavior, not internals
- [ ] Technical considerations are surfaced without over-specifying
- [ ] Dependencies and risks are documented with owners
- [ ] Document is readable in under 15 minutes

## Examples

See `references/example.md` for a completed example.
