# lint-warn-suspicious

> Treat suspicious lints as high-signal warnings or errors

Suspicious lints often indicate real bugs or misleading code.

## Prefer

- at least warning-level coverage for suspicious lint groups
- escalating to deny when the repo can keep them green
- fixing suspicious patterns rather than normalizing them

## Avoid

- muting suspicious lints because they are inconvenient
- classifying potentially buggy patterns as mere style issues
- broad allow lists with no reasoning

## See Also

- [lint-deny-correctness](./lint-deny-correctness.md) - Block correctness issues in CI
- [lint-workspace-lints](./lint-workspace-lints.md) - Keep lint policy centralized
