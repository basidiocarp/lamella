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
| `sync-manifests-with-folders.py` | Keep manifests aligned with resource folders |
| `zip-skills.sh` | Package skill exports for distribution |

## Usage

```bash
# Sync manifests with current folders
./scripts/maintenance/sync-manifests-with-folders.py
```

## Caution

Some of these scripts rewrite source content. Review diffs before committing.
