# Compaction Hook

Improves context preservation during compaction.

This folder contains both:
- a standalone cross-platform Node example in [pre-compact.js](pre-compact.js)
- a standalone Bash variant in [pre-compact.sh](pre-compact.sh)

The Lamella plugin's shared catalog uses the Node-based [`pre-compact.js`](../../../scripts/hooks/pre-compact.js) hook for its default behavior.

## The Problem

Default compaction often keeps the facts but loses the rationale behind decisions, edits, and open questions.

## The Standalone Example

The standalone script injects a compaction strategy before Claude compacts context. That strategy tells Claude what to preserve and what to compress more aggressively.

The bundled `compaction-strategy.md` emphasizes:
- decisions with rationale
- code changes with intent
- user constraints
- current task state
- unresolved questions

## Installation

### Standalone Node example

macOS / Linux:

```bash
cp pre-compact.js ~/.claude/hooks/pre-compact.js
cp compaction-strategy.md ~/.claude/compaction-strategy.md
chmod +x ~/.claude/hooks/pre-compact.js
```

PowerShell:

```powershell
Copy-Item .\pre-compact.js "$HOME\.claude\hooks\pre-compact.js"
Copy-Item .\compaction-strategy.md "$HOME\.claude\compaction-strategy.md"
```

Add the hook to `~/.claude/settings.json`:

```json
{
  "hooks": {
    "PreCompact": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "node \"$HOME/.claude/hooks/pre-compact.js\""
          }
        ]
      }
    ]
  }
}
```

### Standalone Bash variant

```bash
cp pre-compact.sh ~/.claude/hooks/pre-compact.sh
chmod +x ~/.claude/hooks/pre-compact.sh
cp compaction-strategy.md ~/.claude/compaction-strategy.md
```

## Platform Notes

Both variants are supported.

- Use `pre-compact.js` for the most portable Windows, macOS, and Linux path.
- Use `pre-compact.sh` if you prefer a Bash-based setup on macOS, Linux, or Windows via Git Bash or WSL.

If you want the Lamella default instead of this standalone example, prefer the shared plugin hook:

```json
{
  "type": "command",
  "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/pre-compact.js\""
}
```

## Customizing the Strategy

Edit `~/.claude/compaction-strategy.md` to tune what should be preserved.

Good custom additions include:
- API contracts
- migration reasoning
- rollout decisions
- open architectural questions

## Relationship to `/handoff`

This hook and `/handoff` are complementary:
- the hook improves in-session compaction quality automatically
- `/handoff` creates explicit documents for cross-session continuity

## Troubleshooting

### Hook does not seem to run

Check that:
- the script is executable
- the JSON config is valid
- the strategy file exists in `~/.claude/compaction-strategy.md`

### Compaction quality still feels weak

Make the strategy more explicit, or pair it with `/handoff` for context you cannot afford to lose.
