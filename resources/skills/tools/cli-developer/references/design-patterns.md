# CLI Design Patterns

Use this reference when shaping a command-line tool’s surface area and behavior.

## Command Structure

Favor a clear hierarchy:

```text
mycli
  init
  config get
  config set
  deploy
  plugins list
```

Subcommands should represent real task groups, not arbitrary nesting.

## Flag Conventions

- short and long forms for common flags
- positional args for truly required values
- repeatable flags for multi-value filtering

Example:

```text
mycli deploy production --dry-run --config ./config.yml
```

## Configuration Precedence

Most CLIs should resolve configuration in this order:

1. CLI flags
2. environment variables
3. project config
4. user config
5. defaults

## Errors and Exit Codes

Error messages should be actionable and specific about the failing file,
argument, or external dependency. Reserve generic “something failed” output for
truly unknown errors.

## Interactive vs Non-Interactive

Detect CI or non-TTY mode early. Prompts belong only in interactive mode; CI
paths should fail fast with clear requirements.

## Practical Rule

Good CLIs make the common path obvious and the dangerous path explicit. Do not
hide destructive behavior behind ambiguous defaults.
