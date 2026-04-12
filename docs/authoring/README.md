# Authoring

This directory is the maintained authoring surface for Lamella content.

Start here:

1. [best-practices.md](best-practices.md)
2. [skills-spec.md](skills-spec.md)
3. [agent-style-guide.md](agent-style-guide.md) when editing agents or subagents

Use the other files in this directory for narrower topics such as shared
subagents, migration reviews, and writing specs for agents.

Lamella-owned authoring guardrails now include:

- `make validate` for the repo-local validation suite, including skill/package alignment
- `./lamella validate skills` for direct skill-frontmatter and authoring-spec checks
- `./lamella validate skill-packages` for manifest-to-skill package alignment checks
- `./lamella scaffold skill <category>/<name> --description "..."` for a valid starter skill
- `manifests/claude/*.json` `resources.*` arrays as the package-surface contract that Lamella validates before packaging
