---
name: rust-learner
description: "Retrieves Rust release, crate, and documentation information."
origin: lamella
---
# Rust Learner


## Contents

- [Execution Mode Detection](#execution-mode-detection)
- [Agent Mode (Plugin Install)](#agent-mode-plugin-install)
  - [Workflow](#workflow)
  - [Agent Routing Table](#agent-routing-table)
  - [Agent Mode Examples](#agent-mode-examples)
- [Inline Mode (Skills-only Install)](#inline-mode-skills-only-install)
  - [Crate Info Query](#crate-info-query)
- [{Crate Name}](#crate-name)
  - [Rust Version Query](#rust-version-query)
- [Rust 1.{version}](#rust-1version)
  - [Language Features](#language-features)
  - [Library Changes](#library-changes)
  - [Stabilized APIs](#stabilized-apis)
  - [Std Library Docs (std::*, Send, Sync, Arc, etc.)](#std-library-docs-std-send-sync-arc-etc)
- [std::{path}::{Name}](#stdpathname)
  - [Third-Party Crate Docs (tokio, serde, etc.)](#third-party-crate-docs-tokio-serde-etc)
- [{crate}::{path}](#cratepath)
  - [Clippy Lints](#clippy-lints)
- [Clippy Lint: {lint_name}](#clippy-lint-lint_name)
- [Tool Chain Priority](#tool-chain-priority)
  - [Fallback Principle (CRITICAL)](#fallback-principle-critical)
- [Deprecated Patterns](#deprecated-patterns)
- [Error Handling](#error-handling)
- [Proactive Triggering](#proactive-triggering)

Fetch Rust and crate information including:
- **Version queries**: Get latest Rust/crate versions
- **API documentation**: Fetch docs from docs.rs
- **Changelog**: Get Rust version features from releases.rs

**Primary skill for fetching Rust/crate information.**

## Workflow

Use live sources when the question is time-sensitive. Prefer official or primary sources:

| Query Type | Primary Sources |
|------------|-----------------|
| Rust release and edition changes | `blog.rust-lang.org`, `releases.rs` |
| Crate versions and metadata | `crates.io`, `lib.rs` |
| Standard library documentation | `doc.rust-lang.org` |
| Third-party crate documentation | `docs.rs` |
| Clippy lints | `rust-lang.github.io/rust-clippy` |

If browsing tools are unavailable, say that the answer may be stale and fall back to local knowledge.

---

## Direct Lookup Steps

### Crate Info Query

```
1. Check `lib.rs` or `crates.io` for the crate summary and latest version.
2. Check `docs.rs` for API docs and feature flags when needed.
3. Cross-check the repo or changelog if the user asks about release notes or breaking changes.
4. Summarize the result with links and exact versions.
```

**Output Format:**
```markdown
## {Crate Name}

**Version:** {latest}
**Description:** {description}

**Features:**
- `feature1`: description

**Links:**
- [docs.rs](https://docs.rs/{crate}) | [crates.io](https://crates.io/crates/{crate}) | [repo]({repo_url})
```

### Rust Version Query

```
1. Check the Rust release post or `releases.rs`.
2. Capture the release date, headline changes, and stabilized APIs.
3. Call out edition-specific or tooling changes when relevant.
```

**Output Format:**
```markdown
## Rust 1.{version}

**Release Date:** {date}

### Headline Changes
- [language feature or tooling change]
- [ecosystem or compiler improvement]

### Migration Notes
- [breaking or edition-related note]

### Stabilized APIs
- `api_name`: description
```

### Std Library Docs (std::*, Send, Sync, Arc, etc.)

```
1. Construct the `doc.rust-lang.org/std/` URL.
2. Confirm the type or trait path.
3. Extract the signature, summary, and one relevant example.
```

**Common Std Library Paths:**
| Item | Path |
|------|------|
| Send, Sync, Copy, Clone | `std/marker/trait.{Name}.html` |
| Arc, Mutex, RwLock | `std/sync/struct.{Name}.html` |
| Rc, Weak | `std/rc/struct.{Name}.html` |
| RefCell, Cell | `std/cell/struct.{Name}.html` |
| Box | `std/boxed/struct.Box.html` |
| Vec | `std/vec/struct.Vec.html` |
| String | `std/string/struct.String.html` |

**Output Format:**
```markdown
## std::{path}::{Name}

**Signature:**
```rust
{signature}
```

**Description:**
{description}

**Examples:**
```rust
{example_code}
```
```

### Third-Party Crate Docs (tokio, serde, etc.)

```
1. Open the `docs.rs` page for the crate item.
2. Capture the signature, purpose, feature-gating notes, and one usage example.
3. Include version context when the docs reflect a release older than the latest crate version.
```

**Output Format:**
```markdown
## {crate}::{path}

**Signature:**
```rust
{signature}
```

**Description:**
{description}

**Examples:**
```rust
{example_code}
```
```

### Clippy Lints

```
1. agent-browser CLI (or WebFetch fallback):
   - open "https://rust-lang.github.io/rust-clippy/stable/"
   - search for lint name in page
   - get text ".lint-doc" for matching lint
   - close
2. Parse and format output
```

**Output Format:**
```markdown
## Clippy Lint: {lint_name}

**Level:** {warn|deny|allow}
**Category:** {category}

**Description:**
{what_it_checks}

**Example (Bad):**
```rust
{bad_code}
```

**Example (Good):**
```rust
{good_code}
```
```

---

## Tool Chain Priority

Both modes use the same tool chain order:

1. **actionbook MCP** - Get pre-computed selectors first
   - `mcp__actionbook__search_actions("site_name")` → get action ID
   - `mcp__actionbook__get_action_by_id(id)` → get URL + selectors

2. **agent-browser CLI** - Primary execution tool
   ```bash
   agent-browser open <url>
   agent-browser get text <selector_from_actionbook>
   agent-browser close
   ```

3. **WebFetch** - Last resort only if agent-browser unavailable

### Fallback Principle (CRITICAL)

```
actionbook → agent-browser → WebFetch (only if agent-browser unavailable)
```

**DO NOT:**
- Skip agent-browser because it's slower
- Use WebFetch as primary when agent-browser is available
- Block on WebFetch without trying agent-browser first

---

## Deprecated Patterns

| Deprecated | Use Instead | Reason |
|------------|-------------|--------|
| WebSearch for crate info | Task + agent or inline mode | Structured data |
| Direct WebFetch | actionbook + agent-browser | Pre-computed selectors |
| Guessing version numbers | Always fetch from source | Prevents misinformation |

## Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| Agent file not found | Skills-only install | Use inline mode |
| actionbook unavailable | MCP not configured | Fall back to WebFetch |
| agent-browser not found | CLI not installed | Fall back to WebFetch |
| Agent timeout | Site slow/down | Retry or inform user |
| Empty results | Selector mismatch | Report and use WebFetch fallback |

## Proactive Triggering

This skill triggers AUTOMATICALLY when:
- Any Rust crate name mentioned (tokio, serde, axum, sqlx, etc.)
- Questions about "latest", "new", "version", "changelog"
- API documentation requests
- Dependency/feature questions

**DO NOT use WebSearch for Rust crate info. Use agents or inline mode instead.**
