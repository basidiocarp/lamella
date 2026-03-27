# Plugin Settings Examples

Use `.claude/*.local.md` files for small, project-local plugin state that
commands and hooks can read safely.

## Common Patterns

### Temporary Hook Activation

Use a local settings file to turn a hook on or off without editing the plugin
itself.

Typical fields:
- `enabled`
- mode or validation level
- small project-specific options

### Agent or Workflow State

Use a local file for:
- worker identity
- task number
- coordinator session
- loop counters or completion conditions

This works well when hooks and commands need to share a small amount of
human-readable state.

### Configuration-Driven Behavior

Store bounded settings such as:
- strict vs lenient mode
- allowed file extensions
- local size or timeout limits

Keep the settings narrow enough that the file stays understandable at a glance.

## Good Practices

- exit quickly if the settings file is absent
- use an explicit `enabled` flag when the behavior is optional
- update files atomically when hooks may write them
- keep frontmatter machine-readable and the body human-readable

## Bad Uses

- storing large outputs
- storing secrets casually
- turning the file into a general-purpose database
- hiding critical required plugin config in an undocumented local file

## Design Rule

A plugin settings file should be:
- local
- optional when appropriate
- easy to inspect
- easy for hooks and commands to parse

If the state is too large or too relational for markdown frontmatter, move it to
a better storage layer.
