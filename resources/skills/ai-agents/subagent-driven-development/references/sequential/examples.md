# Examples

Use these examples as patterns for sequential orchestration, not as literal
templates.

## Common Sequential Shapes

### Interface Change

Typical steps:
1. define the new contract
2. update the implementation
3. update consumers
4. update tests
5. verify the full chain

This pattern is good for return-type changes, DTO adoption, and API contract
shifts.

### Feature Addition Across Layers

Typical steps:
1. create the new service or capability
2. integrate it into the business flow
3. add configuration or templates
4. add tests
5. verify end-to-end behavior

This works when the feature has clear dependency layers.

### Mechanical Refactor with Escalation

Typical steps:
1. change the highest-risk interfaces first
2. apply mechanical downstream updates
3. update tests and docs
4. escalate only if repeated judge failures suggest the refactor is not actually
   mechanical

## Pattern Rule

Sequential orchestration is best when:
- dependencies are real
- earlier steps shape later ones
- judge gates can stop bad work before it cascades

If the steps are independent, use parallel work instead.
