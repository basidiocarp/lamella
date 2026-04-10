# Obsidian Vault

`obsidian-vault` captures Claude Code activity into an Obsidian vault and ships companion scripts for managing the notes it creates.

## What It Includes

- lifecycle hook entrypoints under [`scripts/`](scripts/)
- note-management helpers under [`project-scripts/`](project-scripts/)
- the bundled hook manifest in [`hooks.json`](hooks.json)

## Runtime Variants

Both runtime variants are supported:

- `Node` is the portable default for Windows, macOS, and Linux
- `Bash` remains the supported Unix-oriented variant and also works on Windows through Git Bash or WSL

That applies to both the hook entrypoints and the vault-management scripts.

## Hook Coverage

The bundled hook manifest now uses the Node variants for:

- commit capture
- component creation capture
- subagent task capture
- stop and session-end summaries

The matching `.sh` files remain in the bundle as the supported Bash variant.

## Project Scripts

The `project-scripts/` folder includes both `.js` and `.sh` variants for:

- `init`
- `add-note`
- `search-vault`
- `update-note`
- `import-files`
- `list-notes`
- `manage-tags`
- `link-notes`
- `archive-note`

Use the Node variants when you want the same behavior across Windows and Unix-like systems. Use the Bash variants when you prefer a shell-first workflow.
