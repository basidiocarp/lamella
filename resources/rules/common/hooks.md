# Hooks System

Use hooks for deterministic local automation, not for hidden policy surprises.

## Hook Types

- `PreToolUse`: validate or block before execution
- `PostToolUse`: format, scan, or capture after execution
- `Stop` / `SessionEnd`: summarize or persist lifecycle state

## Rules

- keep hooks explicit, predictable, and easy to disable
- do not hide risky behavior behind broad auto-accept settings
- prefer `allowedTools` or scoped settings over dangerous bypass flags
- use task tracking for multi-step work so hooks and users can see progress clearly
