# Lamella: Package Provenance and Runtime Pins

## Status

Addressed 2026-04-27 as part of A48 hardening campaign.

## Provenance and License Notes

### Vendored and Adapted Content

Lamella packages skill content from first-party and community contributions.
Every plugin manifest (`manifests/claude/*.json`) declares an explicit `license`
field. When skills are adapted from third-party sources, the original NOTICE or
attribution must be carried in the skill's `SKILL.md` or a sibling `NOTICE.md`.

The manifest validator (`scripts/ci/validate-skill-packages.js`) checks that
`license` fields are present. Validators do not yet cross-check bundled asset
licenses against plugin-level license claims — this is tracked as future work.

### MCP Config Examples

Files under `resources/mcp-configs/configs/` are **example templates** for
common MCP servers. They include a `_lamella_note` field documenting that they
are examples requiring version pinning before production use. Package specs use
bare package names without `@latest` or `npx -y` auto-accept flags.

| Config | Package | Pin guidance |
|--------|---------|--------------|
| `playwright.json` | `@playwright/mcp` | Pin to a specific semver before distributing |
| `context7.json` | `@upstash/context7-mcp` | Pin to a specific semver before distributing |

### Runtime Package Pins

| Location | Package | Pinned version |
|----------|---------|----------------|
| `resources/hooks/settings.json` statusLine | `ccstatusline` | `@1.0` (per ecosystem-versions.toml `annulus-statusline`) |

### Marketplace Catalog

`manifests/claude/index.json` is the marketplace catalog. Plugin entries use
local plugin names as handles. The catalog does not embed remote artifact
digests — this is tracked as future work.

## What Was Changed (A48)

- `resources/mcp-configs/configs/playwright.json`: removed `@latest`; added `_lamella_note`
- `resources/mcp-configs/configs/context7.json`: removed `@latest`, removed `-y`; added `_lamella_note`
- `resources/hooks/settings.json`: pinned `ccstatusline` from `@latest` to `@1.0`
