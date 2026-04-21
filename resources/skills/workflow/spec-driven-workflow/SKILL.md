---
name: spec-driven-workflow
description: "Creates implementation-ready specs and derives tests from acceptance criteria."
origin: lamella
---

# Spec-Driven Workflow

Use this skill when planning must end in a durable spec, not just a task list.
It is the formal, spec-first companion to `create-plans`.

## Workflow

1. Write the problem, scope, and stable decisions before implementation starts.
2. Express functional and non-functional requirements as numbered, testable statements.
3. Convert requirements into acceptance criteria and edge cases.
4. Validate the spec structure with `scripts/spec_validator.py`.
5. Extract test cases from the approved spec with `scripts/test_extractor.py`.

## Commands

Generate a starter spec:

```bash
python3 scripts/spec_generator.py --title "Feature Name"
```

Validate a spec:

```bash
python3 scripts/spec_validator.py --input feature-spec.md
```

Extract test cases:

```bash
python3 scripts/test_extractor.py --input feature-spec.md --framework pytest
```

PowerShell uses the same scripts with `python`.

## Rules

- No implementation should start until the spec is clear enough to review and test.
- Keep requirements atomic, numbered, and machine-testable.
- Separate in-scope behavior from out-of-scope decisions explicitly.
- Put durable decisions in the spec; keep unstable implementation guesses out.
- Treat acceptance criteria as the contract that drives tests and execution plans.

## References

- `references/spec-format-guide.md`
- `references/acceptance-criteria-patterns.md`
- `references/bounded-autonomy-rules.md`
