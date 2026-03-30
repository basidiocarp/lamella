# Codex manifests

This directory contains Codex export manifests.

The files use a `.yaml` extension, but the current build pipeline stores them as
JSON-compatible YAML so they can be parsed with `jq` and no extra YAML runtime.

Typical flow:

```bash
bash builders/sync-codex-manifests.sh
bash builders/build-codex-skills.sh
```

Each manifest describes the portable resources that should become Codex skills:

- `resources.skills`
- `resources.workflows`
- `resources.templates`
- `resources.scripts`

The builder exports profile-specific bundles to `dist/codex/profiles/<name>/`
and an aggregated installable skill set to `dist/codex/skills/`.

For the planned broad-plugin split into narrower layered manifests, see
`../../docs/plans/plugin-layering-migration.md`.
