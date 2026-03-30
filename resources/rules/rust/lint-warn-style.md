# lint-warn-style

> Keep style lints visible at warning level

Style lints should guide consistency without overwhelming correctness work.

## Prefer

- warning-level style lints enforced consistently
- fixing recurring style issues through formatter or reusable patterns where possible
- adjusting the lint set when it produces persistent low-value noise

## Avoid

- making style lints so noisy that developers stop reading them
- bikeshedding style in review when tooling can enforce it
- denying style lints the repo cannot realistically maintain

## See Also

- [lint-rustfmt-check](./lint-rustfmt-check.md) - Let rustfmt settle formatting
- [lint-workspace-lints](./lint-workspace-lints.md) - Apply style policy centrally
