---
description: Sync dynamic skills for Cargo.toml dependencies or local source
argument-hint: [--force] [--from-source <path>] [--update <crate>] [--info <crate>] [crate_names...]
---

# Sync Crate Skills

Scan Cargo.toml and generate skills for dependencies that don't have local skills yet.
Supports both remote crates (docs.rs) and local Rust source code.

Arguments: $ARGUMENTS
- `--force`: Regenerate all skills even if they exist
- `--from-source <path>`: Generate skills from local Rust source code
- `crate_names`: Optional specific crates to sync (space-separated)

---

## Instructions

### 0. Check for --from-source Flag

If `--from-source` flag is present:

```
/create-llms-from-source {path}
    ↓
~/tmp/{timestamp}-{crate}-llms.txt
    ↓
/create-skills-via-llms {crate} {llms_path}
```

**Workflow for local source:**
1. Parse path from `--from-source <path>` argument
2. Call `/create-llms-from-source {path}` to generate llms.txt
3. Call `/create-skills-via-llms {crate_name} {llms_path} {version}` to create skills
4. Skip remaining steps (no need to check dependencies)

**Input type detection:**
| Input | Action |
|-------|--------|
| `--from-source /path/to/project` | Use `/create-llms-from-source` |
| `https://docs.rs/...` URL | Use `/create-llms-for-skills` |
| Crate name (e.g., `tokio`) | Use actionbook or `/create-llms-for-skills` |

---

### 1. Find Cargo.toml Files

```bash
# Check for Cargo.toml in current directory
if [ -f "Cargo.toml" ]; then
    # Check if it's a workspace
    grep -q "\[workspace\]" Cargo.toml
fi
```

**Workspace handling:**
- If `[workspace]` section exists, find `members = [...]`
- Parse each member path
- Collect Cargo.toml from each member directory

### 2. Parse Dependencies

For each Cargo.toml, extract:
- `[dependencies]` section
- `[dev-dependencies]` section

Parse crate names and versions:
```toml
tokio = { version = "1.40", features = ["full"] }
serde = "1.0"
```

### 3. Check Existing Skills

For each crate, check if skill exists:
```bash
ls ~/.claude/skills/{crate_name}/SKILL.md
```

If `--force` flag is set, skip this check.

### 4. Generate Missing Skills

For each missing crate skill:

#### 4a. Check actionbook for llms.txt

```
search_actions("{crate_name} llms.txt")
```

If found:
```
get_action_by_id(action_id)
# Save content to ~/tmp/{crate_name}-llms.txt
```

#### 4b. Generate llms.txt if not in actionbook

If not found in actionbook:
```
/create-llms-for-skills https://docs.rs/{crate_name}/latest/{crate_name}/
```

#### 4c. Create skills from llms.txt

```
/create-skills-via-llms {crate_name} {llms_path} {version}
```

### 5. Report Results

Output summary:
```
Synced skills for:
- tokio (1.40.0) - created
- serde (1.0.215) - created
- axum (0.7.9) - already exists, skipped

Skills location: ~/.claude/skills/
```

---

## Tool Priority

1. **--from-source flag** - If present, use `/create-llms-from-source` for local source
2. **actionbook MCP** - Check for pre-generated llms.txt first
3. **/create-llms-for-skills** - Generate from docs.rs if not in actionbook
   - Uses **agent-browser CLI** (preferred)
   - Falls back to **WebFetch** if agent-browser unavailable
4. **/create-llms-from-source** - Generate from local Rust source
   - Uses **rustdoc JSON** (preferred)
   - Falls back to **source code parsing** if rustdoc unavailable
5. **/create-skills-via-llms** - Create skills from llms.txt

**DO NOT use:**
- Chrome MCP for documentation fetching
- Direct Fetch without agent-browser attempt first

---

### 6. Update a Specific Crate (`--update`)

Force-regenerate a single crate skill to the latest version:
```bash
/sync-crate-skills --update tokio          # Update to latest
/sync-crate-skills --update tokio 1.40.0   # Update to specific version
```

**Process:**
1. Check current skill version in `~/.claude/skills/{crate_name}*/SKILL.md`
2. If version not provided, fetch latest from crates.io: `cargo search {crate_name} --limit 1`
3. Remove old skill: `rm -rf ~/.claude/skills/{crate_name}*`
4. Generate fresh llms.txt via `/create-llms-for-skills`
5. Create updated skill via `/create-skills-via-llms`

### 7. Crate Info Lookup (`--info`)

Get information about a crate including latest version, features, and changelog:
```bash
/sync-crate-skills --info tokio            # Latest info
/sync-crate-skills --info axum 0.7         # Specific version
```

**Process:**
1. Use `search_actions("{crate_name} llms.txt")` to check actionbook
2. Use `agent-browser` to open `https://lib.rs/crates/{crate_name}`
3. Extract crate information and changelog
4. Summarize for user

---

## Example Usage

```bash
# Sync all dependencies from current project
/sync-crate-skills

# Force regenerate all skills
/sync-crate-skills --force

# Sync specific crates only
/sync-crate-skills tokio serde

# Force regenerate specific crate
/sync-crate-skills --force tokio

# Generate skills from local Rust source code
/sync-crate-skills --from-source /path/to/my-rust-project

# Force regenerate skills from local source
/sync-crate-skills --force --from-source /path/to/project

# Update a specific crate to latest
/sync-crate-skills --update tokio

# Get crate info
/sync-crate-skills --info axum
```

---

## Output Location

All skills are created in: `~/.claude/skills/`

This is the local dynamic skills directory, not committed to repositories.
