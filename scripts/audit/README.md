# Audit Scripts

Scripts for auditing and generating reports on lamella resources.

## Scripts

| Script | Description |
|--------|-------------|
| `audit-scan.sh` | Scan for issues across all resources |
| `generate-agents-audit.sh` | Generate audit report for agents |
| `generate-commands-audit.sh` | Generate audit report for commands |
| `generate-skills-audit.sh` | Generate audit report for skills |

## Usage

```bash
# Generate full audit
./scripts/audit/audit-scan.sh

# Generate specific audits
./scripts/audit/generate-skills-audit.sh
./scripts/audit/generate-agents-audit.sh
./scripts/audit/generate-commands-audit.sh
```

## Output

Audit reports are typically saved to `docs/`:
- `AGENTS-AUDIT.md`
- `COMMANDS-AUDIT.md`
- `SKILLS-AUDIT.md`
