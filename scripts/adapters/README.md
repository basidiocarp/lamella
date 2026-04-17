# Cross-Agent Install Adapters

This directory contains adapters that transform canonical skill files into format-specific output for different coding agents (Claude Code, Codex, Cursor, Gemini).

## Interface

Each adapter is a shell script that accepts:

```bash
bash adapter.sh <input_file> <output_directory>
```

- `input_file`: absolute path to the canonical skill markdown file
- `output_directory`: target directory where output should be written

## Input Format

Canonical skill files are Markdown with YAML frontmatter:

```markdown
---
name: skill-name
description: "Short description"
---

# Skill Title

Content here...
```

## Output Requirements

- Adapters must write output to the designated `output_directory` only
- No files should be written outside the adapter's assigned platform directory
- Adapters receive the full input file path and must handle frontmatter parsing internally
- Filename transformation (if any) is adapter-specific

## Registry

The `registry.sh` script maintains:

1. **ADAPTER_MAP**: Maps target names (claude-code, codex, cursor, gemini) to adapter scripts
2. **PLATFORM_SOURCE_PATH_OWNERS**: Ensures each target owns exactly one output directory
3. **check_ownership_guard()**: Verifies no two targets share an output directory
4. **run_all_adapters()**: Processes all skills through all adapters

## Ownership Guard

Each platform output directory is owned by exactly one target. The ownership guard prevents accidental overwrites and clarifies accountability.

## Usage

Run all adapters on all skills:

```bash
source scripts/adapters/registry.sh
run_all_adapters resources/skills false
```

Dry run (show what would happen):

```bash
source scripts/adapters/registry.sh
run_all_adapters resources/skills true
```

From Makefile:

```make
build-adapters:
	@bash -c 'source scripts/adapters/registry.sh && run_all_adapters resources/skills false'
```
