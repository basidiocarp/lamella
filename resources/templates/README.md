# Templates

Reusable templates organized by purpose.

Lamella keeps template source files under `resources/templates/`. The `core`
plugin currently bundles:

- `claude/CLAUDE-MD-TEMPLATE.md`
- `docs/SKILL-MD-TEMPLATE.md`
- `session/SESSION-HANDOFF-TEMPLATE.md`

The other templates remain source-side references until they are promoted into
plugin manifests.

## Categories

| Directory | Description |
|-----------|-------------|
| [claude/](claude/) | Claude Code configuration (CLAUDE.md, prompts) |
| [session/](session/) | Session management and handoffs |
| [docs/](docs/) | Documentation templates (decisions, findings, traces) |

## Quick Access

**Claude Configuration:**
- [CLAUDE-MD-TEMPLATE.md](claude/CLAUDE-MD-TEMPLATE.md) — Start here for new projects
- [CLAUDE-MD-GUIDE.md](claude/CLAUDE-MD-GUIDE.md) — Why each section matters

**Session Management:**
- [SESSION-HANDOFF-TEMPLATE.md](session/SESSION-HANDOFF-TEMPLATE.md) — Context preservation at 85% usage

**Documentation:**
- [DECISION.md](docs/DECISION.md) — Architecture decision records
- [FINDINGS.md](docs/FINDINGS.md) — Research/audit findings
- [SKILL-MD-TEMPLATE.md](docs/SKILL-MD-TEMPLATE.md) — New skill creation

## Usage

```bash
cp resources/templates/claude/CLAUDE-MD-TEMPLATE.md .claude/CLAUDE.md
```
