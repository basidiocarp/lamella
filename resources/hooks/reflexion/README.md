# Reflexion Hooks

Automatic reflection triggering for Claude Code. When the word `reflect` appears in a user prompt, the hook intercepts the stop event and tells Claude to run `/reflexion:reflect`.

## Architecture

```text
UserPromptSubmit -> session store -> Stop handler -> optional /reflexion:reflect trigger
```

Flow:
1. `UserPromptSubmit` records the latest prompt.
2. `Stop` checks whether the prompt contains the standalone word `reflect`.
3. The stop handler blocks once and asks Claude to run `/reflexion:reflect`.
4. Consecutive-stop protection prevents infinite loops.

## Key Files

| File | Purpose |
|------|---------|
| `hooks.json` | Hook configuration |
| `src/index.ts` | Entry point |
| `src/onStopHandler.ts` | Stop handler with trigger logic |
| `src/session.ts` | Session persistence for hook invocations |
| `src/lib.ts` | Shared types and helpers |

## Installation

```bash
cd lamella/resources/hooks/reflexion
bun install
```

## Usage

### Start Claude Code with the plugin

```bash
DEBUG=true claude --debug --plugin-dir ./resources/hooks/reflexion

claude --plugin-dir ./resources/hooks/reflexion
```

### Trigger Reflection

Include the standalone word `reflect` in the prompt:

```text
Fix the bug in auth.ts then reflect
Implement the feature, reflect on your work
```

Words like `reflection` or `reflective` do not trigger the hook.

### Debug Mode

With `DEBUG=true`, hook responses include session data for debugging.

## Development

### Running Locally

```bash
bun run src/index.ts Stop
bun run src/index.ts UserPromptSubmit
```

### Testing

```bash
npm test
```

## Troubleshooting

### Hook not triggering

Check that:
- Bun is installed
- `hooks.json` is valid
- `reflect` appears as a standalone word

### Session data not found

Session files are stored in `/tmp/claude-hooks-sessions/`. Ensure the hook can write there.
