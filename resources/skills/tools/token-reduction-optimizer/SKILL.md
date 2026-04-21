---
name: token-reduction-optimizer
description: "Reduces token-heavy command output with Mycelium."
requires:
  - mycelium
origin: lamella
---

# Token Reduction Optimizer

## Contents

- [How It Works](#how-it-works)
- [Supported Commands](#supported-commands)
- [Activation Examples](#activation-examples)
- [Installation Check](#installation-check)
- [Usage Pattern](#usage-pattern)
- [Session Tracking](#session-tracking)
- [Edge Cases](#edge-cases)
- [Configuration](#configuration)
- [Token Optimization](#token-optimization)
- [Metrics](#metrics)
- [Limitations](#limitations)
- [Recommendation](#recommendation)
- [References](#references)

Use Mycelium when the user wants the result of a noisy shell command and the
command is one Mycelium already supports.

## How It Works

1. **Detect high-verbosity commands** in user requests
2. **Suggest the Mycelium wrapper** if it preserves the information the user needs
3. **Execute with Mycelium** when the wrapped command is a real Mycelium surface
4. **Track savings** over session

## Supported Commands

### Files and Search
- `ls` → `mycelium ls`
- `tree` → `mycelium tree`
- `cat <large-file>` → `mycelium read <file>`
- `find` → `mycelium find`
- `grep` or `rg`-style content search → `mycelium grep`

### Git
- `git status` → `mycelium git status`
- `git log` → `mycelium git log`
- `git diff` → `mycelium git diff`
- `git show` → `mycelium git show`

### GitHub CLI
- `gh pr view` → `mycelium gh pr view`
- `gh pr checks` → `mycelium gh pr checks`

### JS and Package Managers
- `pnpm list` → `mycelium pnpm list`
- `pnpm outdated` → `mycelium pnpm outdated`
- `npm list` → `mycelium npm list`

### Tests and Build Tooling
- `cargo test` → `mycelium cargo test`
- `cargo build` → `mycelium cargo build`
- `cargo check` → `mycelium cargo check`
- `cargo clippy` → `mycelium cargo clippy`
- generic test commands → `mycelium test ...`
- `pytest` → `mycelium pytest`
- `go test` → `mycelium go test`

### Containers and Infra
- `docker ...` → `mycelium docker ...`
- `kubectl ...` → `mycelium kubectl ...`

## Activation Examples

**User**: "Show me the git history"
**Skill**: Detects `git log` → Suggests `mycelium git log` → Uses the compact history output when the user wants the result, not every raw line

**User**: "Find all markdown files"
**Skill**: Detects `find` → Suggests `mycelium find "*.md" .` → Uses the compact search output when the user wants the matches, not the raw traversal noise

## Installation Check

Before first use, verify Mycelium is installed:
```sh
mycelium --version
mycelium gain
```

If not installed:
```sh
# Install with Cargo
cargo install --locked --git https://github.com/basidiocarp/mycelium
```

On macOS or Linux, the install script is also available:

```sh
curl -fsSL https://raw.githubusercontent.com/basidiocarp/mycelium/refs/heads/master/install.sh | sh
```

## Usage Pattern

```markdown
# When the User Asks for a Verbose Command

1. Acknowledge request
2. Suggest the Mycelium wrapper when it helps:
   "I'll use `mycelium git log` so we get the important history without the full raw output"
3. Execute the Mycelium command
4. Report the tradeoff when it matters:
   "This keeps the key signal and usually saves a large amount of context"
```

## Session Tracking

Optional: Track cumulative savings across the session:

```bash
# At Session End
mycelium gain  # Shows cumulative token savings and command history
```

## Edge Cases

- **Small outputs**: Skip Mycelium when the raw output is already easy to read
- **Already using Claude or Codex file tools**: `Read`, `rg`, or structure-aware tools may already be the better choice
- **Interactive commands**: Skip wrappers when raw interactivity is the point
- **Unsupported commands**: do not guess; only switch when Mycelium already supports the surface

## Configuration

Enable via CLAUDE.md:
```markdown
## Token Optimization

Use Mycelium for high-verbosity commands it already supports:
- git operations (log, status, diff)
- package managers (pnpm, npm)
- build tools (cargo, go)
- test frameworks (generic test wrapper, pytest)
- file finding and reading
```

## Metrics

Typical savings from Mycelium docs and examples:
- files, search, and package-manager commands often cut 30-80% of noisy output
- git, GitHub CLI, build, and test commands often cut 40-90% depending on the command
- very large test runs can save much more when Mycelium keeps only actionable failures

Treat these numbers as examples, not guarantees. The best check is whether the compact output still answers the user's question.

## Limitations

- Not suitable for interactive commands
- Output reduction can hide details the user explicitly asked to inspect

## Recommendation

**Use Mycelium for**: supported git workflows, file operations, test frameworks, build tools, package managers, and other high-verbosity commands
**Skip Mycelium for**: quick exploration, interactive commands, unsupported commands, or cases where raw output is the point

## References

- Mycelium README: `mycelium/README.md`
- Command reference: `mycelium/docs/commands.md`
- Feature overview: `mycelium/docs/features.md`
- Install guide: `mycelium/docs/getting-started/installation.md`
