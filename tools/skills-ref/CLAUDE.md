# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`skills-ref` is a small Python reference library and CLI for Agent Skills. It validates skill directories, reads skill metadata, and renders the XML prompt block that advertises available skills to an agent. It owns parsing and validation for this helper tool; it does not own Lamella's main build pipeline.

---

## What skills-ref Does NOT Do

- Does not package or publish plugins: Lamella still owns packaging.
- Does not execute skills: it only validates and renders metadata.
- Does not try to be production infrastructure: the README calls it demonstration-oriented.
- Does not replace the authoring spec: it reads and validates against it.

---

## Failure Modes

- **Invalid skill directory**: validation returns problems instead of partial success.
- **Malformed metadata**: parsing fails with a concrete error.
- **Prompt rendering input missing**: `to-prompt` fails because the referenced skill data is incomplete.
- **Environment not synced**: CLI commands fail until the Python environment is installed.

---

## Build & Test Commands

```bash
uv sync

uv run ruff format .
uv run ruff check --fix .

uv run pytest
```

---

## Architecture

```text
lamella/tools/skills-ref/
├── src/skills_ref/   parsing, validation, and prompt rendering
├── tests/            parser, validator, and prompt tests
├── pyproject.toml    package and tool config
└── README.md         CLI and Python API usage
```

---

## Key Design Decisions

- **Small Python utility**: fast to iterate on and easy to run from docs or CI.
- **Validation plus prompt rendering**: keeps the helper focused on one narrow boundary.

---

## Testing Strategy

- Run pytest for parser, validator, and prompt generation coverage.
- Format and lint with Ruff before changing parsing or validation rules.
- Use the example CLI flows from the README when checking behavior by hand.
