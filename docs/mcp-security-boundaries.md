# MCP Security Boundaries

This document defines the security boundary rules for rhizome and hyphae as MCP servers.
It names what is in-bounds and out-of-bounds for three threat categories on each server's
MCP surface. Use it as a reference for security review of MCP surface changes and as a
vocabulary anchor for handoff specs that involve tool exposure.

Compliance anchor: OWASP Agentic Top 10 ASI02 (Excessive Agency via Tool Misuse).

## Threat Categories

Three categories apply to every MCP server in the ecosystem:

### 1. Tool Discovery

An agent probing for hidden function names, parameters, or descriptions that are not
intended for user-facing exposure.

**In-bounds:** Return only registered, user-facing tools with functional documentation.
Tool names, parameter names, and descriptions may be read by any calling agent.

**Out-of-bounds:**
- Exposing internal routing function names in tool descriptions or error messages
- Revealing implementation details (database table names, internal module paths) in tool
  descriptions or parameter schema `description` fields
- Enumerating system-level tool names or capabilities that are not part of the public surface
- Including operator configuration, API keys, or model selection details in tool metadata

### 2. Parameter Injection

Tool call parameters that embed adversarial content intended to alter tool behavior,
escape sandboxes, or execute unintended operations.

**In-bounds:** Validate and sanitize all tool parameters before use. Reject parameters
that do not conform to the declared schema. Return structured error responses for invalid
input.

**Out-of-bounds:**
- Passing raw tool arguments to shell commands without sanitization
- Passing raw tool arguments to SQL queries without parameterization
- Using tool parameter values as file paths without path traversal validation
- Accepting structured objects that embed code or scripts in fields not intended for
  code content

### 3. System Prompt Leakage

MCP metadata (tool descriptions, resource names, server info fields) that embeds or
leaks system prompt content, internal instructions, or capability enumerations.

**In-bounds:** Tool descriptions contain only functional documentation visible to end
users. Server `info` fields contain version and name only.

**Out-of-bounds:**
- Tool descriptions that embed internal instructions for agent behavior ("always call
  this tool before X")
- `description` fields that reveal what other tools exist or how they relate to each other
  beyond what is user-facing
- Server `info.instructions` or similar fields that carry system-prompt-level content
- Error messages that reflect back system-level configuration values

---

## Rhizome MCP Surface

Rhizome exposes code intelligence tools via MCP. The full tool list is registered in
`rhizome/crates/rhizome-mcp/src/server.rs`.

Representative tools: `search_symbols`, `find_references`, `get_definition`,
`get_structure`, `export_to_hyphae`, `rename_symbol`, `move_symbol`, `replace_symbol_body`.

### Tool Discovery — rhizome

All tools in the MCP server are user-facing code intelligence operations. No internal
routing functions or system-level tools should appear in the registered tool list.

Boundary violations to watch for during code review:
- A new internal helper added to the tool list that is not user-facing
- Tool `description` fields that name internal crate structure or database schema
- `export_to_hyphae` exposing internal hyphae endpoint details in its description

### Parameter Injection — rhizome

Rhizome tools accept file paths, symbol names, and code content as parameters.

Boundary violations to watch for:
- `create_file` or `replace_lines` accepting a `path` parameter that is not validated
  against the declared project root (path traversal risk)
- `rename_symbol` or `move_symbol` accepting parameters that trigger shell invocations
  without sanitization
- Any tool that passes a user-supplied `content` or `body` parameter to an eval or
  subprocess without stripping adversarial content

### System Prompt Leakage — rhizome

Rhizome's tool descriptions are functional ("find all references to a symbol"). They
should not carry behavioral instructions.

Boundary violations to watch for:
- A tool `description` that says "call this before editing" or similar behavioral guidance
- Tool parameter `description` fields that name other tools or imply call ordering
- Server `info` fields that include model selection, operator config, or basidiocarp
  internal architecture details

---

## Hyphae MCP Surface

Hyphae exposes memory, memoir, session, and artifact tools via MCP. The full tool list
is documented in `CLAUDE.md` under "Hyphae (persistent memory, memoirs, and session
management)".

Representative tools: `hyphae_memory_recall`, `hyphae_memory_store`,
`hyphae_memoir_create`, `hyphae_session_start`, `hyphae_session_end`,
`hyphae_artifact_store`, `hyphae_artifact_query`.

### Tool Discovery — hyphae

All hyphae tools are user-facing memory and session operations. Internal storage
operations (SQL queries, SQLite schema operations, file I/O) must not appear as tools.

Boundary violations to watch for:
- Internal hyphae admin commands (vacuum, schema migration, full dump) exposed as tools
- Tool descriptions that reveal the SQLite table schema or file storage paths
- Error messages from `hyphae_memory_recall` that include raw SQL error text with
  table or column names

### Parameter Injection — hyphae

Hyphae tools accept memory content, topic strings, and query parameters.

Boundary violations to watch for:
- A `topic` parameter passed directly to a SQL LIKE query without sanitization
- A `content` parameter stored without sanitization that is later returned and rendered
  in a context where markdown or code is executed
- `hyphae_ingest_file` accepting a `path` parameter that is not validated against
  allowed directories

### System Prompt Leakage — hyphae

Hyphae tool descriptions should document what each tool does, not how hyphae makes
decisions internally or what it stores about the operator.

Boundary violations to watch for:
- A tool `description` that reveals what memories hyphae currently holds or what
  topics exist in the database
- `hyphae_session_context` returning operator configuration or Claude Code settings
  in its response envelope
- Tool descriptions that include the hyphae project name, storage root path, or
  internal configuration values

---

## Compliance Reference

**OWASP Agentic Top 10 ASI02 — Excessive Agency via Tool Misuse**

ASI02 covers scenarios where an AI agent is given or assumes more tool access than
required for its task, enabling it to take unintended actions. The three MCP threat
categories above are specific manifestations of ASI02 for MCP-server infrastructure:

- Tool Discovery: an agent discovering tools it was not intended to use
- Parameter Injection: an agent manipulating a tool's behavior beyond its intended scope
- System Prompt Leakage: a tool inadvertently extending an agent's knowledge of
  system internals, enabling targeted misuse

See also: `src/redteam/constants/frameworks.ts` in promptfoo (`owasp:agentic:asi02`
maps to `['excessive-agency', 'mcp', 'tool-discovery']`).

---

## Using This Document

- **Security review of MCP tool additions:** check each new tool against the three
  categories for both rhizome and hyphae before merging.
- **Handoff specs:** when a handoff touches rhizome or hyphae MCP surface, reference
  this document's threat categories by name (e.g., "this change must not violate the
  Parameter Injection boundary for rhizome").
- **Operator review:** when reviewing hyphae or rhizome configuration changes, use
  the System Prompt Leakage section as a checklist for tool description content.
