---
name: token-reduction-optimizer
description: "Reduces token-heavy command output with RTK."
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
- [Metrics (Verified)](#metrics-verified)
- [Limitations](#limitations)
- [Recommendation](#recommendation)
- [References](#references)

Use RTK when the user wants the result of a noisy command, not every line of the raw output.

## How It Works

1. **Detect high-verbosity commands** in user requests
2. **Suggest RTK wrapper** if applicable
3. **Execute with RTK** when it preserves the information the user needs
4. **Track savings** over session

## Supported Commands

### Git (>70% reduction)
- `git log` → `rtk git log` (92.3% reduction)
- `git status` → `rtk git status` (76.0% reduction)
- `find` → `rtk find` (76.3% reduction)

### Medium-Value (50-70% reduction)
- `git diff` → `rtk git diff` (55.9% reduction)
- `cat <large-file>` → `rtk read <file>` (62.5% reduction)

### JS/TS Stack (70-90% reduction)
- `pnpm list` → `rtk pnpm list` (82% reduction)
- `pnpm test` / `vitest run` → `rtk vitest run` (90% reduction)

### Rust Toolchain (80-90% reduction)
- `cargo test` → `rtk cargo test` (90% reduction)
- `cargo build` → `rtk cargo build` (80% reduction)
- `cargo clippy` → `rtk cargo clippy` (80% reduction)

### Python & Go (90% reduction)
- `pytest` → `rtk python pytest` (90% reduction)
- `go test` → `rtk go test` (90% reduction)

### GitHub CLI (79-87% reduction)
- `gh pr view` → `rtk gh pr view` (87% reduction)
- `gh pr checks` → `rtk gh pr checks` (79% reduction)

### File Operations
- `ls` → `rtk ls` (condensed output)
- `grep` → `rtk grep` (filtered output)

## Activation Examples

**User**: "Show me the git history"
**Skill**: Detects `git log` → Suggests `rtk git log` → Explains 92.3% token savings

**User**: "Find all markdown files"
**Skill**: Detects `find` → Suggests `rtk find "*.md" .` → Explains 76.3% savings

## Installation Check

Before first use, verify RTK is installed:
```sh
rtk --version
```

If not installed:
```sh
# Install With Homebrew
brew install rtk-ai/tap/rtk

# Install With Cargo
cargo install rtk
```

```powershell
rtk --version
if (-not $?) {
  cargo install rtk
}
```

## Usage Pattern

```markdown
# When the User Asks for a Verbose Command

1. Acknowledge request
2. Suggest RTK optimization:
   "I'll use `rtk git log` to reduce token usage by ~92%"
3. Execute RTK command
4. Report the tradeoff when it matters:
   "Saved ~13K tokens (baseline: 14K, RTK: 1K)"
```

## Session Tracking

Optional: Track cumulative savings across the session:

```bash
# At Session End
rtk gain  # Shows total token savings for session (SQLite-backed)
```

## Edge Cases

- **Small outputs**: Skip RTK when the raw output is already easy to read
- **Already using Claude tools**: Grep/Read tools are already optimized
- **Multiple commands**: Batch with RTK wrapper once, not per command

## Configuration

Enable via CLAUDE.md:
```markdown
## Token Optimization

Use RTK (Rust Token Killer) for high-verbosity commands:
- git operations (log, status, diff)
- package managers (pnpm, npm)
- build tools (cargo, go)
- test frameworks (vitest, pytest)
- file finding and reading
```

## Metrics

Sample reductions from the skill's reference data:
- `git log`: 13,994 chars → 1,076 chars (92.3% reduction)
- `git status`: 100 chars → 24 chars (76.0% reduction)
- `find`: 780 chars → 185 chars (76.3% reduction)
- `git diff`: 15,815 chars → 6,982 chars (55.9% reduction)
- `read file`: 163,587 chars → 61,339 chars (62.5% reduction)

Treat these numbers as examples, not guarantees. The best check is whether the compact output still answers the user's question.

## Limitations

- Not suitable for interactive commands
- Output reduction can hide details the user explicitly asked to inspect

## Recommendation

**Use RTK for**: git workflows, file operations, test frameworks, build tools, package managers
**Skip RTK for**: quick exploration, interactive commands, or cases where raw output is the point

## References

- RTK GitHub: https://github.com/rtk-ai/rtk
- RTK Website: https://www.rtk-ai.app/
- Evaluation: `docs/resource-evaluations/rtk-evaluation.md`
- CLAUDE.md template: `examples/claude-md/rtk-optimized.md`
