# Trimmed Placeholder Classification

Classifies the remaining Lamella reference files that still contain literal
`... (N lines trimmed)` placeholders.

## Recommendation

Do not blindly undo every placeholder. Many remaining files are large
handbook-style references where abbreviated examples are still a reasonable
tradeoff. The better policy has three cases:

1. Expand now: use when the file is short, dense with placeholders, and the
   omitted lines likely hide the core example or template.
2. Normalize concise: use when the file is medium-sized and still useful in
   principle but needs tighter, complete examples instead of many partial ones.
3. Leave abbreviated for now: use when the file is a large reference handbook
   with many sections and the placeholders compress repetitive example detail
   rather than the core guidance.

## Remaining Counts

- `622` reference files still contain placeholders
- `3499` total remaining placeholder occurrences

## Bucket Counts

- `expand_now`: `102`
- `normalize_concise`: `105`
- `leave_abbrev_for_now`: `224`
- `review_case_by_case`: `191`

## Expand Now

These are the best candidates for continued cleanup because they are small and
high-density.

- `resources/skills/core/code-maturity-assessor/assets/EXAMPLE_REPORT.md`
- `resources/skills/microservices/saga-orchestration/references/templates.md`
- `resources/skills/frontend/frontend-patterns/references/component-patterns.md`
- `resources/skills/frontend/frontend-patterns/references/forms-accessibility.md`
- `resources/skills/frontend/frontend-patterns/references/performance.md`
- `resources/skills/microservices/microservices-design/references/communication-patterns.md`
- `resources/skills/typescript/tailwind-design-system/references/animations-theming.md`
- `resources/skills/writing/release-notes/references/release-templates.md`
- `resources/skills/frontend/css-animation-creator/references/essential-animations.md`
- `resources/skills/go/golang-testing/references/http-testing.md`
- `resources/skills/python/django-tdd/references/test-examples.md`
- `resources/skills/meta/agent-development/references/examples.md`
- `resources/skills/python/django-patterns/references/drf-examples.md`
- `resources/skills/python/django-patterns/references/model-examples.md`
- `resources/skills/python/django-tdd/references/setup.md`

## Normalize Concise

These should be rewritten as compact, complete references rather than expanded
back into large code dumps.

- `resources/skills/tools/graphql-patterns/references/federation.md`
- `resources/skills/tools/cli-developer/references/node-cli.md`
- `resources/skills/go/golang-patterns/references/project-structure.md`
- `resources/skills/frontend/css-animation-creator/references/animation-libraries.md`
- `resources/skills/go/golang-patterns/references/generics.md`
- `resources/skills/typescript/modern-javascript-patterns/references/async-patterns.md`
- `resources/skills/cpp/embedded-systems/references/microcontroller-programming.md`
- `resources/skills/cpp/embedded-systems/references/rtos-patterns.md`
- `resources/skills/database/sql-pro/references/window-functions.md`
- `resources/skills/tools/graphql-patterns/references/resolvers.md`
- `resources/skills/tools/graphql-patterns/references/subscriptions.md`
- `resources/skills/rust/rust-advanced/references/async.md`
- `resources/skills/tools/php-pro/references/symfony-patterns.md`
- `resources/skills/frontend/design-systems/references/spacing-iconography.md`
- `resources/skills/tools/websocket-patterns/references/security.md`

## Leave Abbreviated for Now

These are mostly large handbook-style references. They may still need work
later, but expanding them now is lower leverage than the two buckets above.

- `resources/skills/devops/ansible/references/module-patterns.md`
- `resources/skills/typescript/payload/references/PLUGIN-DEVELOPMENT.md`
- `resources/skills/devops/makefile/references/best-practices-from-makefile-validator.md`
- `resources/skills/devops/ansible/references/best-practices.md`
- `resources/skills/microservices/microservices-design/references/observability.md`
- `resources/skills/devops/promql/references/promql_patterns.md`
- `resources/skills/microservices/microservices-design/references/data.md`
- `resources/skills/meta/command-development/references/advanced-workflows.md`
- `resources/skills/python/pandas-pro/references/aggregation-groupby.md`
- `resources/skills/python/pandas-pro/references/merging-joining.md`
- `resources/skills/frontend/accessibility/references/wcag-guidelines.md`
- `resources/skills/microservices/microservices-design/references/patterns.md`
- `resources/skills/tools/bash-script-generator/references/script-patterns.md`
- `resources/skills/devops/aws-serverless-eda/references/deployment-best-practices.md`
- `resources/skills/tools/api-design-principles/references/graphql-schema-design.md`

## Review Case by Case

These files do not fit cleanly into one rule. They may be operational,
workflow-heavy, or structurally odd enough that they need manual review before
choosing expand versus normalize.

- `resources/skills/devops/terraform-patterns/references/best-practices.md`
- `resources/skills/devops/terraform-patterns/references/providers.md`
- `resources/skills/ai-agents/agent-native-architecture/references/architecture-patterns.md`
- `resources/skills/workflow/create-plans/workflows/complete-milestone.md`
- `resources/skills/security/api-footgun-detector/references/lang-rust.md`
- `resources/skills/python/python-patterns/references/decorators.md`
- `resources/skills/frontend/accessibility/references/screen-reader-commands.md`
- `resources/skills/typescript/nextjs-app-router-patterns/references/caching.md`
- `resources/skills/devops/terraform-patterns/references/testing.md`
- `resources/skills/meta/plugin-settings/examples/example-settings.md`

## Practical Rule Set

Expand if the file is short and the placeholders are swallowing the primary
example or template. Normalize concise if the file is medium-sized and should
teach a pattern with fewer, complete examples. Leave abbreviated if the file
is effectively a large catalog or handbook and the surrounding structure still
carries the guidance. Review manually if the file sits between reference and
workflow, or if it is used as a template for other generated artifacts.
