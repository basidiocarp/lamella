---
name: cli-developer
description: "Builds CLI tools with commands, prompts, parsing, and completions."
origin: lamella
---
# CLI Developer

Build command-line tools that are fast, clear, and portable across macOS, Linux, and Windows.

## Scope

Covers CLIs in Node.js, Python, and Go. Focus on clear command structure, predictable output, shell completions, and cross-platform behavior.

## When to Use This Skill

- Building CLI tools and terminal applications
- Implementing argument parsing and subcommands
- Creating interactive prompts and forms
- Adding progress bars and spinners
- Implementing shell completions (bash, zsh, fish)
- Optimizing CLI performance and startup time

## Core Workflow

1. **Analyze UX** - Identify user workflows, command hierarchy, common tasks
2. **Design commands** - Plan subcommands, flags, arguments, configuration
3. **Implement** - Build with appropriate CLI framework for the language
4. **Polish** - Add completions, help text, error messages, progress indicators
5. **Test** - Cross-platform testing, performance benchmarks

## Reference Guide

Load detailed guidance based on context:

| Topic | Reference | Load When |
|-------|-----------|-----------|
| Design Patterns | `references/design-patterns.md` | Subcommands, flags, config, architecture |
| Node.js CLIs | `references/node-cli.md` | commander, yargs, inquirer, chalk |
| Python CLIs | `references/python-cli.md` | click, typer, argparse, rich |
| Go CLIs | `references/go-cli.md` | cobra, viper, bubbletea |
| UX Patterns | `references/ux-patterns.md` | Progress bars, colors, help text |

## Constraints

### MUST DO
- Keep startup time under 50ms
- Provide clear, actionable error messages
- Support --help and --version flags
- Use consistent flag naming conventions
- Handle SIGINT (Ctrl+C) gracefully
- Validate user input early
- Support both interactive and non-interactive modes
- Test on Windows, macOS, and Linux

### MUST NOT DO
- Block on synchronous I/O unnecessarily
- Print to stdout if output will be piped
- Use colors when output is not a TTY
- Break existing command signatures (breaking changes)
- Require interactive input in CI/CD environments
- Hardcode paths or platform-specific logic
- Ship without shell completions

## Output Templates

When implementing CLI features, provide:
1. Command structure (main entry point, subcommands)
2. Configuration handling (files, env vars, flags)
3. Core implementation with error handling
4. Shell completion scripts if applicable
5. Brief explanation of UX decisions

## Knowledge Reference

CLI frameworks (commander, yargs, oclif, click, typer, argparse, cobra, viper), terminal UI (chalk, inquirer, rich, bubbletea), testing (snapshot testing, E2E), distribution (npm, pip, homebrew, releases), performance optimization
