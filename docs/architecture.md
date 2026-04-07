# Lamella Architecture

Lamella is a manifest-driven packaging system for AI coding resources. It keeps
skills, subagents, commands, hooks, templates, and support assets in one source
tree, then builds them into Claude Code plugins and Codex exports. This
document covers the packaging boundary, build flow, and the two output paths
that matter most.

---

## Design Principles

- **Source once, package many** — resource authors work in `resources/`; host
  packaging logic lives elsewhere.
- **Manifests decide scope** — builders do not guess what belongs to a plugin;
  manifests make inclusion and dependency order explicit.
- **Validation before distribution** — cross-reference checks and output
  validation run before install and release flows.
- **Host parity where it matters** — Claude and Codex exports can differ in
  shape, but they should come from the same intent and inventory.
- **Generated output stays disposable** — `dist/` is a build product, not the
  authoring surface.

---

## System Boundary

### Lamella owns

- Source resources under `resources/`
- Plugin and export manifests under `manifests/`
- Build and install scripts for Claude and Codex outputs
- Validation of resources, manifests, and generated artifacts
- Marketplace metadata for local and hosted plugin distribution

### Stipe owns

- Host installation policy and ecosystem setup
- Repair flows for installed tools and runtimes

### Hyphae, Rhizome, and Mycelium own

- Runtime memory, code intelligence, and shell filtering
- The data and behavior Lamella may reference in docs, but does not package as
  executable logic

Lamella should stay focused on packaging and distribution. It should not become
the source of truth for runtime coordination, memory, or host diagnostics.

---

## Workspace Structure

```text
lamella/
├── resources/    # Source skills, subagents, commands, hooks, rules, templates
├── manifests/    # Claude and Codex packaging manifests
├── builders/     # Host-specific build scripts
├── scripts/      # Validation, install, release, and audit helpers
├── schemas/      # Structured content schemas used by some plugins
├── docs/         # Authoring, migration, and reference docs
└── dist/         # Generated Claude and Codex artifacts
```

- **`resources/`**: The authoring surface. This is where reusable content
  lives, grouped by kind and category.
- **`manifests/`**: Declares plugin membership, dependencies, and export scope.
- **`builders/`**: Host transforms. These scripts turn source resources into
  installable Claude and Codex artifacts.
- **`scripts/ci/`**: Validation layer for cross-references, manifest integrity,
  and built-output checks.
- **`dist/`**: Disposable output. Rebuild it rather than editing it.

---

## Request Flow

When a build or install command arrives:

1. **Choose the entry point** (`./lamella` or `make`)
   The shell wrapper is the preferred local interface; `make` groups common CI
   and build targets.
   Example: `./lamella build-marketplace` and `make validate`.

2. **Resolve manifests** (`manifests/claude/*.json`, generated Codex manifests)
   The selected plugin or export target determines which resources are in scope
   and what dependencies must be included first.
   Example: umbrella plugins pull in layered dependencies rather than copying
   files ad hoc.

3. **Stage resources** (`resources/`)
   Builders collect source assets and flatten category-heavy paths into
   host-appropriate output names.
   Example: a source skill under `resources/skills/...` becomes a plugin-local
   Claude skill path or a portable Codex skill directory.

4. **Apply host transforms** (`builders/`, `scripts/plugins/`)
   Claude builds emit plugin directories and marketplace metadata. Codex builds
   emit skills, profiles, and generated agent artifacts.
   Example: shared subagents become Markdown agents for Claude and TOML agent
   definitions for Codex.

5. **Validate outputs** (`scripts/ci/*.js`)
   Build integrity, cross-file references, command frontmatter, manifests, and
   catalog structure are checked before release flows.
   Example: `validate-marketplace-catalog.js` and `validate-xrefs.js`.

6. **Install or publish** (`./lamella install`, `install-codex`, hosted catalog)
   Artifacts are installed locally or emitted for marketplace distribution.

---

## Claude Packaging

File: `builders/build-claude-plugin.sh`

### How It Works

1. Read a Claude manifest from `manifests/claude/`.
2. Collect the referenced resources and dependency set.
3. Flatten source paths into plugin-local output names.
4. Emit `dist/claude/plugins/<plugin>/`.
5. Update the marketplace catalog under `dist/claude/`.

### Output Matrix

| Source | Claude Output | Notes |
|--------|---------------|-------|
| `resources/skills/.../SKILL.md` | `dist/claude/plugins/<plugin>/skills/...` | Primary reusable skill content |
| `resources/subagents/.../SUBAGENT.md` | `dist/claude/plugins/<plugin>/agents/*.md` | Shared agent surface |
| `resources/commands/*.md` | `dist/claude/plugins/<plugin>/commands/*.md` | Slash-command content |
| `resources/hooks/...` | `dist/claude/plugins/<plugin>/hooks/...` | Hook docs and helper assets |

### Adding a New Claude-Packaged Resource

1. Create the source asset under `resources/`.
2. Reference it from the right Claude manifest.
3. Run `make validate`.
4. Rebuild with `./lamella build-marketplace`.

---

## Codex Export

File: `builders/build-codex-skills.sh`

### How It Works

1. Sync Codex-oriented manifest data from the Claude inventory where needed.
2. Transform selected resources into portable skill directories and profile
   metadata.
3. Generate agent artifacts for Codex-specific install surfaces.
4. Emit everything under `dist/codex/`.

### Export Matrix

| Source | Codex Output | Notes |
|--------|--------------|-------|
| Skills | `dist/codex/skills/<name>/SKILL.md` | Portable skill directory |
| Shared subagents | `dist/codex/profiles/<profile>/agents/<name>.toml` | Generated agent artifact |
| Support content | optional copied assets | Included only when the target needs it |

### Adding a New Codex Export

1. Confirm the source resource is portable outside the Claude plugin model.
2. Sync or update the relevant manifest mapping.
3. Run `./lamella build-codex`.
4. Verify the result with `./lamella install-codex --all` if the export changes
   install behavior.

---

## Testing

```bash
make validate
./lamella build-marketplace
./lamella build-codex
```

| Category | Count | What's Tested |
|----------|-------|---------------|
| Source validators | 10+ | Commands, hooks, rules, skills, subagents, manifests, presets, and cross-references |
| Build smoke tests | 2+ | Claude marketplace generation and Codex export generation |
| Audit and maintenance scripts | several | Plugin scans, catalog checks, and release-oriented helper flows |

Lamella relies more on validation scripts than on a single monolithic test
binary. The practical standard is simple: if a packaging change touches
resources, manifests, or builders, run the validators and rebuild both output
paths.

---

## Key Dependencies

- **Bash build scripts** — the main packaging layer for Claude and Codex
  transforms.
- **Node-based validators** — manifest checks, cross-reference checks, and
  generated-output validation all run through `scripts/ci/`.
- **Manifest JSON** — plugin scope and dependency order live here, so manifest
  drift is an architectural bug, not a cosmetic one.
- **Claude and Codex host formats** — the builders are constrained by what each
  host can install and discover.
