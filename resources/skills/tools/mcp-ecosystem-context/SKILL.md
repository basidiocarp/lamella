---
name: mcp-ecosystem-context
description: "Provides MCP tool preferences for subagents that inherit MCP access but lack CLAUDE.md context. Include via the skills frontmatter field in subagent definitions to enable rhizome and hyphae tool awareness."
origin: lamella
---

# Ecosystem Tool Preferences

You have access to MCP tools that are significantly more efficient than native
tools for code exploration and memory. Use them when available.

## Loading MCP Tools

MCP tool schemas are deferred. Before calling any `mcp__` tool, fetch its
schema with `ToolSearch`:

```
ToolSearch query: "rhizome get_symbols"
ToolSearch query: "rhizome find_references"
ToolSearch query: "hyphae memory"
```

If `ToolSearch` returns no results for a query, the MCP server is unavailable.
Fall back to native tools.

## Code Exploration (rhizome)

For code files over 50 lines, prefer rhizome tools over reading entire files:

| Instead of | Use | Why |
|---|---|---|
| `Read` full file | `mcp__rhizome__get_symbols` | List functions/types without reading every line |
| `Read` full file | `mcp__rhizome__get_structure` | File hierarchy overview |
| `Read` then scan for a function | `mcp__rhizome__get_symbol_body` | Read one function or struct body directly |
| `Grep` for symbol names | `mcp__rhizome__find_references` | Find where a symbol is used with context |
| `Grep` for symbol names | `mcp__rhizome__search_symbols` | Semantic search across the codebase |
| `Read` to check public API | `mcp__rhizome__get_exports` | Public API surface only |
| Manual nesting analysis | `mcp__rhizome__get_complexity` | Nesting depth metrics |

### ToolSearch Queries for Rhizome

Load schemas before first use:

- `ToolSearch query: "rhizome get_symbols"` -- symbols, structure, symbol_body, exports, complexity
- `ToolSearch query: "rhizome find_references"` -- find_references, search_symbols
- `ToolSearch query: "rhizome get_call"` -- get_call_sites, get_definition

## Persistent Memory (hyphae)

Store important decisions and recall past context across sessions:

| Tool | When to use |
|---|---|
| `mcp__hyphae__hyphae_memory_store` | Persist architecture decisions, resolved errors, discovered patterns |
| `mcp__hyphae__hyphae_memory_recall` | Recall past decisions, error resolutions, project context |

### ToolSearch Queries for Hyphae

- `ToolSearch query: "hyphae memory"` -- memory_store, memory_recall, memory_stats

## When to Use Native Tools Instead

Fall back to `Read`, `Grep`, and `Glob` when:

- The file is under 50 lines (Read is cheaper than an MCP round-trip)
- The file is not code (markdown, config, JSON, YAML, text)
- `ToolSearch` returned no matching tools (MCP server unavailable)
- You need line-level editing context (rhizome is read-oriented)
