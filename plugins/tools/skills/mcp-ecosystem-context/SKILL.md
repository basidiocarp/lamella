---
name: mcp-ecosystem-context
description: "Provides MCP tool preferences for subagents that inherit MCP access but lack CLAUDE.md context. Include via the skills frontmatter field in subagent definitions to enable rhizome and hyphae tool awareness."
origin: lamella
---

# Ecosystem Tool Preferences

You have access to MCP tools that are significantly more efficient than native
tools for code exploration and memory. Use them when available.

## Using Rhizome Tools

Rhizome MCP tools are available directly — no preflight required. Call them by name:

- `mcp__rhizome__search_symbols` — find all definitions and usages of a symbol
- `mcp__rhizome__find_references` — cross-file references
- `mcp__rhizome__get_definition` — jump to a symbol's definition
- `mcp__rhizome__get_structure` — understand a file's class/function tree
- `mcp__rhizome__summarize_file` — get a high-level overview without reading every line
- `mcp__rhizome__get_call_sites` — see where a function is called
- `mcp__rhizome__analyze_impact` — predict the blast radius of a change
- `mcp__rhizome__get_diagnostics` — check for syntax/type errors

Prefer rhizome over `Read` when: finding callers or references, navigating definitions, understanding scope and dependencies, or checking impact before refactoring.

Use `Read` when: the file is under 50 lines, the file is not code (markdown, config, JSON), or you need line-level editing context (rhizome is read-oriented).

## Using Hyphae for Persistent Memory

Store important decisions and recall past context across sessions:

- `mcp__hyphae__hyphae_memory_store` — Persist architecture decisions, resolved errors, discovered patterns
- `mcp__hyphae__hyphae_memory_recall` — Recall past decisions, error resolutions, project context
- `mcp__hyphae__hyphae_memory_stats` — View memory count and topic distribution

Call these tools by name. No preflight required.
