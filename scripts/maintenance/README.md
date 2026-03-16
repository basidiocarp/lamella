# Maintenance Scripts

Scripts for system maintenance and configuration.

## Scripts

| Script | Description |
|--------|-------------|
| `clean-reinstall-claude.sh` | Clean reinstall of Claude Code |
| `sync-claude-config.sh` | Sync configuration across machines |
| `check-claude.sh` | Health check for Claude installation |
| `check_upstream_action_surface.sh` | Check for upstream changes |

## Usage

```bash
# Health check
./scripts/maintenance/check-claude.sh

# Sync config
./scripts/maintenance/sync-claude-config.sh
```

## Caution

These scripts modify system configuration. Always use `--dry-run` first when available.
