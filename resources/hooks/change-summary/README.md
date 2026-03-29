# Change Summary Hook

Runs when Claude finishes a task and prints a repo-focused summary of the current diff.

This folder contains a **standalone Bash example**. The main Lamella catalog uses the shared hooks in [`scripts/hooks/`](/Users/williamnewton/projects/claude-mycelium/lamella/scripts/hooks) plus Cortina for the primary lifecycle runtime instead of this one-file shell bundle.

## What It Does

This standalone `Stop` example adds three behaviors:

1. **TypeScript type checking** for modified `.ts` and `.tsx` files
2. **Go linting** for modified `.go` files when `golangci-lint` is installed
3. **Change summary** showing file-level diff context

## Behavior

### TypeScript Checking

If TypeScript files changed, the hook finds the nearest `tsconfig.json`, runs `tsc --noEmit`, and blocks session end until those errors are fixed.

### Go Linting

If Go files changed and `golangci-lint` is installed, the hook reports lint findings without blocking.

### Change Summary

The hook always prints:
- a diff stat
- changed files
- a short preview of each file's diff

## Prerequisites

```bash
# For TypeScript checking
npm install -g typescript

# For Go linting
go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
```

## Installation

### Standalone example

```bash
cp change-summary.sh ~/.claude/hooks/change-summary.sh
chmod +x ~/.claude/hooks/change-summary.sh
```

Add to `~/.claude/settings.json`:

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "$HOME/.claude/hooks/change-summary.sh"
          }
        ]
      }
    ]
  }
}
```

## Platform Notes

This standalone hook is Bash-based. Use it on macOS, Linux, or Windows via Git Bash or WSL.

If you want the Lamella default on Windows, prefer the shared catalog:
- [`post-edit-typecheck.js`](/Users/williamnewton/projects/claude-mycelium/lamella/scripts/hooks/post-edit-typecheck.js)
- [`check-console-log.js`](/Users/williamnewton/projects/claude-mycelium/lamella/scripts/hooks/check-console-log.js)
- `cortina adapter claude-code post-tool-use`, which owns the shared capture runtime for errors, validations, corrections, and export or ingest signals
- [`session-end.js`](/Users/williamnewton/projects/claude-mycelium/lamella/scripts/hooks/session-end.js), which remains wrapper glue and delegates to `cortina adapter claude-code session-end` when `cortina` is installed

## Customization

Edit the script if you want to:
- make TypeScript failures non-blocking
- add more language-specific checks
- shorten or expand the diff preview

## Troubleshooting

### TypeScript errors but I still want to stop

Make the TypeScript branch non-blocking or use the shared catalog instead.

### `tsconfig.json` not found

The script checks the repo root, then `src/`, `app/`, and `packages/`. Add more locations if your project uses a different layout.

### `golangci-lint` not found

Install it, or remove the Go lint section if you do not need it.

## Related Hooks

- [auto-format](../auto-format/)
- [compaction](../compaction/)
