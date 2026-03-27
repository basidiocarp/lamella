# Compaction Hook

Improves context preservation during compaction.

This folder contains a **standalone Bash example**. The Lamella plugin's shared catalog uses the Node-based [`pre-compact.js`](/Users/williamnewton/projects/claude-mycelium/lamella/scripts/hooks/pre-compact.js) hook for its default behavior.

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

### Standalone example

```bash
cp pre-compact.sh ~/.claude/hooks/pre-compact.sh
chmod +x ~/.claude/hooks/pre-compact.sh
cp compaction-strategy.md ~/.claude/compaction-strategy.md
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
            "command": "$HOME/.claude/hooks/pre-compact.sh"
          }
        ]
      }
    ]
  }
}
```

## Platform Notes

The standalone script is Bash-based. Use it on macOS, Linux, or Windows via Git Bash or WSL.

If you want the Lamella default on Windows, prefer the shared plugin hook:

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
