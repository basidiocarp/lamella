---
description: Manage instincts (status, export, import)
argument-hint: <status|export|import> [options]
---

# Instinct Management

Manage learned instincts for the current project and global scope.

## Usage

```
/instinct status                              # Show all instincts
/instinct export [--domain X] [--output file] # Export to YAML
/instinct import <file-or-url> [--dry-run]    # Import from file/URL
```

## Implementation

All subcommands use the instinct CLI:

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/skills/core/continuous-learning/scripts/instinct-cli.py" <subcommand> [args]
```

---

## status

Show learned instincts grouped by domain with confidence bars.

1. Detect current project context (git remote/path hash)
2. Read project instincts from `~/.claude/homunculus/projects/<project-id>/instincts/`
3. Read global instincts from `~/.claude/homunculus/instincts/`
4. Merge with precedence rules (project overrides global when IDs collide)
5. Display grouped by domain with confidence bars and observation stats

---

## export

Export instincts to a shareable YAML format.

**Flags:**
- `--domain <name>`: Export only specified domain
- `--min-confidence <n>`: Minimum confidence threshold
- `--output <file>`: Output file path (prints to stdout when omitted)
- `--scope <project|global|all>`: Export scope (default: `all`)

**Process:**
1. Detect current project context
2. Load instincts by selected scope
3. Apply filters (`--domain`, `--min-confidence`)
4. Write YAML-style export to file or stdout

---

## import

Import instincts from a local file or URL with conflict resolution.

**Flags:**
- `--dry-run`: Preview without importing
- `--force`: Skip confirmation prompt
- `--min-confidence <n>`: Only import instincts above threshold
- `--scope <project|global>`: Target scope (default: `project`)

**Process:**
1. Fetch the instinct file (local path or URL)
2. Parse and validate the format
3. Check for duplicates — higher-confidence imports update, equal/lower are skipped
4. Merge or add new instincts
5. Save to `~/.claude/homunculus/projects/<project-id>/instincts/inherited/` (project) or `~/.claude/homunculus/instincts/inherited/` (global)

Imported instincts are marked with `source: inherited` and `imported_from` metadata.
