# Command Frontmatter Reference

Frontmatter is optional metadata at the top of a slash command. Use it only
when it improves activation, tool safety, or user clarity.

## Common Fields

### `description`

Short help text for the command.

Good description rules:
- start with a verb
- stay specific
- keep it short enough for help output

### `allowed-tools`

Use this to narrow the tool surface the command can use.

Good uses:
- read-only commands
- commands that should only run a limited Bash subset
- documenting that a command needs a particular tool family

Prefer restrictive tool lists over `"*"`.

### `model`

Use only when the command truly benefits from a specific model choice.

General guidance:
- fast model for simple or repetitive commands
- default balanced model for most commands
- stronger model only for genuinely complex reasoning

### `argument-hint`

Use this to show the expected argument shape.

Example:

```yaml
argument-hint: [environment] [version]
```

## When to Omit Frontmatter

Skip frontmatter when:
- the command works fine with inherited defaults
- the metadata would just repeat the command body
- the command does not need custom tool or model behavior

## Authoring Rule

Frontmatter should make the command safer or easier to use. If it does neither,
leave it out.
