# Rules

Lamella stores rules under `resources/rules/` and lets Claude plugin manifests
decide which rule sets are bundled into build output.

## Structure

Rules are organized into a common layer plus language-specific directories:

```text
resources/rules/
├── common/          # Language-agnostic principles and session standards
├── golang/          # Go-specific extensions to the common layer
├── python/          # Python-specific extensions to the common layer
├── rust/            # Rust-specific rule corpus
└── typescript/      # TypeScript/JavaScript-specific extensions
```

- `common/` contains broad project and session rules.
- `golang/`, `python/`, and `typescript/` extend the common files with
  language-specific guidance and link back to `../common/...` where needed.
- `rust/` is a larger standalone corpus bundled with the Rust plugin.

## Packaging

Rules are source assets, not a standalone install target inside this repo.
Lamella packages them through Claude plugin manifests:

- `manifests/claude/core.json` bundles the common rule set.
- `manifests/claude/rust.json` bundles the Rust rule corpus.
- Other language directories currently remain source-side support content until
  a plugin manifest explicitly includes them.

Build the current plugin outputs with:

```bash
./lamella build-marketplace
```

Then inspect the bundled rules under:

```text
dist/claude/plugins/core/rules/
dist/claude/plugins/rust/rules/
```

If you need to copy built rules into a local Claude setup manually, copy them
from the built plugin output rather than from `resources/rules/`.

## Rules vs Skills

- Rules should be short, normative, and easy to scan in the middle of work.
- Skills should hold the deeper workflow, reference material, setup steps, and
  extended examples.

Rules tell Claude what should broadly hold. Skills tell Claude how to execute a
specific task well.

Use a rule when the guidance can stay compact:

- a high-leverage default or constraint
- a sharp anti-pattern to avoid
- a short checklist that reduces common regressions
- a repo-specific standard that should hold across many tasks

Move content into a skill or adjacent reference when it needs:

- step-by-step workflow
- setup instructions or installation details
- long `Bad` / `Good` walkthroughs
- multiple API variations, edge-case catalogs, or framework tutorials

If a rule starts reading like a mini guide, compress the rule and move the
teaching material out of the rule corpus.

## Adding or Updating Rule Sets

When adding a new rule set:

1. Put source files under `resources/rules/<category>/`.
2. Keep common guidance in `common/` and language-specific overrides in their
   own directories.
3. For extension-style rule files, start with a short note linking to the
   matching common rule, for example:

   ```md
   > This file extends [common/coding-style.md](../common/coding-style.md)
   > with Python-specific content.
   ```

4. Reference existing skills where deeper implementation guidance already
   exists.
5. Add the rule paths to the relevant Claude plugin manifest if they should be
   shipped in built output.

## Priority

When a language-specific rule and a common rule disagree, the
language-specific rule takes precedence.

- `resources/rules/common/` defines the default baseline.
- `resources/rules/golang/`, `resources/rules/python/`,
  `resources/rules/typescript/`, and `resources/rules/rust/` narrow or extend
  that baseline for their language.
