# CLI UX Patterns

Use this reference when you need clearer output, safer prompts, and better
command-line ergonomics.

## Progress Indicators

Use the smallest indicator that still gives the user useful context.

### Determinate Work

```text
[████████████░░░░░░░░] 60% | 3/5 files | ETA 33s
```

Best for downloads, file batches, or any task with a known total.

### Indeterminate Work

```text
⠋ Loading project metadata...
```

Best for API calls, external services, and steps with unknown duration.

### Multi-Step Work

```text
✓ Dependencies installed
⠋ Building application...
⏳ Running tests...
```

Best for pipelines where phase changes matter more than byte-level progress.

## Color Usage

- red: failures and destructive actions
- yellow: warnings and deprecations
- green: success and completion
- blue or cyan: neutral guidance and technical details
- gray: metadata or low-priority context

Do not rely on color alone. Pair it with symbols or plain-language labels.

## Disable Color When Needed

```javascript
const noColor =
  !process.stdout.isTTY ||
  process.env.NO_COLOR ||
  process.env.CI === "true";
```

Honor `NO_COLOR` and degrade cleanly when output is piped.

## Help Text Pattern

```text
USAGE
  mycli deploy <environment> [options]

ARGUMENTS
  environment    Target environment

OPTIONS
  --dry-run      Preview changes
  --force        Skip confirmation

EXAMPLES
  mycli deploy staging --dry-run
  mycli deploy production --force
```

Keep help text scannable and example-driven.

## Error Message Pattern

Structure errors as:

1. context
2. problem
3. next action

```text
✗ Error: Config file not found at ./config.yml

Try:
  • Create one with `mycli init`
  • Pass a custom path with `--config`
```

Hide stack traces unless the user asks for debug output.

## Prompt Rules

- show keyboard hints when selection is non-obvious
- provide sensible defaults
- validate as early as possible
- allow non-interactive execution in CI
- let users cancel cleanly with `Ctrl+C`
