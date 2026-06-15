# Quality Checklists

## Specification Quality Checklist

Before finalizing spec.md, verify:

### Requirements Quality

- [ ] Each requirement has clear acceptance criteria
- [ ] Requirements are testable
- [ ] Requirements are independent (can verify separately)
- [ ] No ambiguous language ("should be fast" → "response < 200ms")

### Scope Clarity

- [ ] In-scope items are specific
- [ ] Out-of-scope items prevent scope creep
- [ ] Boundaries are clear to implementer

### Dependencies Identified

- [ ] All internal dependencies listed
- [ ] External dependencies have owners/contacts
- [ ] Dependency status is current

### Risks Addressed

- [ ] Major risks identified
- [ ] Impact assessment realistic
- [ ] Mitigations are actionable

## Plan Quality Checklist

Before starting implementation, verify plan.md:

### Task Quality

- [ ] Tasks are atomic (one logical action)
- [ ] Tasks are independently verifiable
- [ ] Task descriptions are clear
- [ ] Sub-tasks provide helpful detail

### Phase Organization

- [ ] Phases group related tasks
- [ ] Each phase delivers something testable
- [ ] Verification tasks after each phase
- [ ] Phases build on each other logically

### Completeness

- [ ] All spec requirements have corresponding tasks
- [ ] Documentation tasks included
- [ ] Testing tasks included
- [ ] Integration tasks included
