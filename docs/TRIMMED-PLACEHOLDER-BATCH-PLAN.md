# Trimmed Placeholder Batch Plan

This plan turns the remaining placeholder cleanup into a deterministic queue so
the work can continue back to back without re-triaging the entire repo each
time.

## Current Snapshot

As of the latest validated pass:

- Remaining files with literal `... (N lines trimmed)` placeholders: `587`
- Remaining placeholder occurrences: `3320`

Largest remaining plugin backlogs:

- `devops`: `86` files / `733` occurrences
- `tools`: `66` files / `443` occurrences
- `typescript`: `29` files / `270` occurrences
- `python`: `42` files / `236` occurrences
- `security`: `96` files / `224` occurrences
- `ai-agents`: `52` files / `210` occurrences
- `meta`: `35` files / `203` occurrences
- `frontend`: `26` files / `197` occurrences

## Execution Rules

Use these rules in order:

1. Work `short dense` files first.
   These are small references where the placeholder hides most of the usable
   example. Batch size: `5`.
2. Then work `medium normalize` files.
   These are medium references that should become compact, complete examples
   instead of handbook dumps. Batch size: `5`.
3. Then work `large handbook` batches by plugin.
   These should be normalized plugin by plugin to avoid style drift. Batch
   size: `3-5` depending on file length.
4. Leave explicit `defer` cases alone until the end.
   These are low-leverage, niche, or structurally odd references.

For every batch:

- remove literal placeholders from the selected files
- keep examples concise and runnable
- update [`TRIMMED-PLACEHOLDER-CLEANUP-LOG.md`](./TRIMMED-PLACEHOLDER-CLEANUP-LOG.md)
- run `cd lamella && make validate`
- refresh the remaining file / occurrence count before selecting the next batch

## Queue Order

### Wave 1: Short Dense Queue

Run these areas first, in this order:

1. `typescript/modern-javascript-patterns`
   Start with:
   - `references/node-essentials.md`
   - `references/browser-apis.md`
2. `tools/graphql-patterns`
   Start with:
   - `references/resolvers.md`
   - `references/subscriptions.md`
3. `cpp/embedded-systems`
   Start with:
   - `references/memory-optimization.md`
   - `references/power-optimization.md`
4. `rust/rust-advanced`
   Start with:
   - `references/async.md`
   - `references/ownership.md`
5. `typescript/backend-patterns`
   Start with:
   - `references/security-patterns.md`
6. `devops/chaos-engineering`
   Start with:
   - `references/chaos-tools.md`
7. `database/sql-pro`
   Start with:
   - `references/database-design.md`
8. `core/verified-implementer`
   Start with:
   - `references/examples.md`
9. `workflow/kaizen`
   Start with:
   - `references/gemba-examples.md`
   - `references/vsm-examples.md`
10. `workflow/mental-models`
    Start with:
    - `references/pm-templates.md`
11. `python/django-security`
    Start with:
    - `references/authorization.md`
12. `security/stride-analysis-patterns`
    Start with:
    - `references/attack-tree-diagram-exporters.md`
    - `references/dfd-analysis.md`

Batching rule for Wave 1:

- Prefer files under `220` lines.
- Keep batches topically coherent when possible.
- If a batch has fewer than `5` files in one area, fill the rest from the next
  area in queue order.

### Wave 2: Medium Normalize Queue

After Wave 1, move to medium references that need concise normalization instead
of literal expansion.

Run these plugin slices in order:

1. `microservices/microservices-design`
   - `references/communication.md`
   - `references/resilience-patterns.md`
   - `references/data.md`
   - `references/observability.md`
   - `references/patterns.md`
2. `python/pandas-pro`
   - `references/aggregation-groupby.md`
   - `references/data-cleaning.md`
   - `references/merging-joining.md`
   - `references/dataframe-operations.md`
   - `references/performance-optimization.md`
3. `frontend/responsive-design`
   - `references/breakpoint-strategies.md`
   - `references/container-queries.md`
   - `references/fluid-layouts.md`
4. `tools/bash-script-generator`
   - `references/script-patterns.md`
   - `references/bash-scripting-guide.md`
5. `rag/rag-implementation`
   - `references/retrieval-optimization.md`
   - `references/rag-evaluation.md`
6. `tools/mermaid-diagrams`
   - `references/c4-diagrams.md`
7. `meta/command-development`
   - `references/advanced-workflows.md`
8. `typescript/payload`
   - `references/FIELDS.md`
   - `references/ENDPOINTS.md`

Batching rule for Wave 2:

- Keep batches within one plugin where possible.
- Limit any single batch to about `5` medium files.
- Prefer replacing multiple partial examples with `2-4` complete patterns.

### Wave 3: Large Handbook Queue

These are the biggest remaining placeholder sources. Work them by plugin so the
voice and example shape stay consistent.

Recommended order:

1. `devops`
2. `tools`
3. `security`
4. `ai-agents`
5. `meta`
6. `frontend`
7. `atmos`
8. `core`

Sub-order inside each plugin:

- references with the highest placeholder count first
- references tied directly to command examples or operational workflows next
- long catalog or cookbook files last

Batching rule for Wave 3:

- Batch size `3` for very long files (`500+` lines)
- Batch size `4-5` for shorter handbook files
- Stay within a single plugin until its top cluster is normalized

### Wave 4: Defer and Odd Cases

Leave these until the end:

- niche security testing frameworks such as
  `security/threat-mitigation-mapping/references/control-testing.md`
- deeply nested or structurally odd references that may need relocation rather
  than just cleanup
- files where the placeholder is inside generated-output examples and the gain
  is mostly cosmetic

## Immediate Next Batches

If continuing from the current state, use this order next:

### Batch A

- `typescript/modern-javascript-patterns/references/node-essentials.md`
- `typescript/modern-javascript-patterns/references/browser-apis.md`
- `tools/graphql-patterns/references/resolvers.md`
- `tools/graphql-patterns/references/subscriptions.md`
- `cpp/embedded-systems/references/memory-optimization.md`

### Batch B

- `cpp/embedded-systems/references/power-optimization.md`
- `rust/rust-advanced/references/async.md`
- `rust/rust-advanced/references/ownership.md`
- `typescript/backend-patterns/references/security-patterns.md`
- `devops/chaos-engineering/references/chaos-tools.md`

### Batch C

- `database/sql-pro/references/database-design.md`
- `core/verified-implementer/references/examples.md`
- `workflow/kaizen/references/gemba-examples.md`
- `workflow/kaizen/references/vsm-examples.md`
- `workflow/mental-models/references/pm-templates.md`

## Stop Conditions

Pause and re-plan only if one of these happens:

- a plugin’s remaining files clearly belong in `normalize_concise` instead of
  `expand_now`
- `make validate` fails due to structural drift rather than content cleanup
- a remaining file turns out to be a generated fixture or intentionally compact
  example where expansion would reduce quality

Otherwise, keep working through the queue in order.
