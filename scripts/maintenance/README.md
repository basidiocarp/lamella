# Maintenance Scripts

Scripts for Lamella corpus maintenance and packaging hygiene.

Claude host-maintenance helpers have moved to `stipe/scripts/claude/`.
Personal `~/.claude` sync automation has been retired from Lamella.

## Scripts

| Script | Description |
|--------|-------------|
| `add-toc-to-skills.py` | Add tables of contents to long skills |
| `add-triggers.py` | Normalize or add trigger sections in skills |
| `check_upstream_action_surface.sh` | Check for upstream changes |
| `fix-skill-frontmatter.py` | Normalize skill frontmatter |
| `haiku-friendly-rewrites.py` | Rewrite content for smaller-model clarity |
| `sync-manifests-with-folders.py` | Keep manifests aligned with resource folders (reads `resources/skills/`, writes to `manifests/claude/`) |
| `zip-claude-plugins.sh` | Zip built Claude plugin folders from `dist/claude/plugins/` |
| `zip-skills.sh` | Package skill exports for distribution |

## Usage

```bash
# Sync manifests with current folders
./scripts/maintenance/sync-manifests-with-folders.py

# Zip built Claude plugins after a marketplace build
./scripts/maintenance/zip-claude-plugins.sh
```

## Validation

The authoritative CI validation for plugin manifests is in `scripts/ci/validate-manifests.js`. This validator:
- Checks all manifests in `manifests/claude/`
- Verifies every resource path exists on disk
- Reports missing files, invalid JSON, and broken dependencies

Run it with:

```bash
node scripts/ci/validate-manifests.js
```

The sync script updates manifest content, and the CI validator verifies it. Use both during development.

## Caution

Some of these scripts rewrite source content. Review diffs before committing.
