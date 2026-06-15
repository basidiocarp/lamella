# Workflows and Feedback Loops

Use workflows when the task has multiple dependent steps or repeated validation.

## Workflow Pattern

A good workflow:
- breaks work into ordered steps
- gives each step a clear outcome
- makes verification explicit

Checklist-style workflows work well for:
- research synthesis
- document generation
- file transformation pipelines
- form filling and validation flows

## Feedback Loop Pattern

The standard loop is:

```text
run validator -> inspect issues -> fix -> validate again
```

This applies whether the validator is:
- a script
- a style guide
- a schema
- a judge or reviewer

## Conditional Workflow Pattern

Use branching when the process genuinely differs by task type.

Example:
- creating new content
- editing existing content
- fixing validation failures

Keep the branches explicit. Do not make the model infer hidden routing from a
single prose paragraph.

## Authoring Rule

If the workflow is long enough that skipping a step would break the result,
write it down as a reusable sequence instead of leaving it implicit.
