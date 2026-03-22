# Session Management Scripts

Scripts for managing Claude Code sessions.

## Scripts

| Script | Description |
|--------|-------------|
| `cc-sessions.py` | Python utility for session management |
| `session-search.sh` | Search across session history |
| `session-stats.sh` | Generate session statistics |
| `fresh-context-loop.sh` | Start fresh context with preserved state |

## Usage

```bash
# Search sessions
./scripts/session/session-search.sh "search term"

# Get session stats
./scripts/session/session-stats.sh

# Python session manager
python scripts/session/cc-sessions.py --help
```

## Session Data

Session data is stored in `~/.claude/sessions/` or `$CLAUDE_HOME/sessions/`.
