# Variant Porting Workflow

Use this workflow when you already trust an existing Semgrep rule and want a clean port to another language.

## Core Rule

Complete the full cycle for one target language before starting the next:

1. Confirm the vulnerability pattern exists in the target language.
2. Create a test file with `ruleid:` and `ok:` annotations.
3. Adapt the rule to the target language AST and syntax.
4. Validate YAML, run `semgrep --test`, and iterate until the tests pass.

Do not batch multiple languages together. The portability decision, test design, and AST translation are different enough that parallel drafting usually creates drift.

## Reference Map

- [Variant applicability and test setup](variant-applicability-and-test-setup.md)
- [Variant rule authoring and validation](variant-rule-authoring-and-validation.md)
- [Variant troubleshooting](variant-troubleshooting.md)
- [Variant worked example](variant-worked-example.md)

## Minimum Artifact Set

For each target language, keep these files together:

```text
<original-rule-id>-<language>/
├── <original-rule-id>-<language>.yaml
└── <original-rule-id>-<language>.<ext>
```

Where:

- the rule ID is suffixed with `-<language>`
- the test file contains at least two `ruleid:` cases and two `ok:` cases
- the rule metadata records the original rule ID and source language

## Success Criteria

- Applicability was documented before any rule edits.
- Test cases cover more than one source, sink, or call shape.
- The adapted rule matches only the intended lines.
- Validation ran with `semgrep --validate` and `semgrep --test`.
- Notes capture any language-specific caveats for future ports.
