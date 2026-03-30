# lint-rustfmt-check

> Enforce rustfmt in CI

Formatting should be automatic and consistently enforced.

## Prefer

- `cargo fmt --check` in CI
- local formatter usage before review
- keeping style debates out of PR review when rustfmt can settle them

## Avoid

- hand-formatted style drift
- formatter exceptions that are hard to preserve
- mixing formatting policy with semantic lint policy

## See Also

- [lint-workspace-lints](./lint-workspace-lints.md) - Centralize quality policy
- [lint-warn-style](./lint-warn-style.md) - Keep style issues visible without drowning out correctness
