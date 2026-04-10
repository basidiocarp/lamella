# Lamella

Portable resource system for AI coding environments. Builds Claude Code plugin
marketplaces and exports the same skill inventory into installable Codex
artifacts.

Named after fungal lamellae, the gills beneath the cap that organize and expose
the structures responsible for spore release.

Part of the [Basidiocarp ecosystem](https://github.com/basidiocarp).

---

## The Problem

Useful coding-agent content often gets trapped inside one host format. Skills,
hooks, commands, and subagents end up duplicated, drift apart across tools, or
become hard to package and validate consistently.

## The Solution

Lamella keeps content in one resource system and builds it into multiple host
surfaces. Claude builds follow the official Claude Code plugin format, Codex
builds export installable skills and agent files, and the manifest layer keeps
those outputs ordered and reproducible.

---

## The Ecosystem

| Tool | Purpose |
|------|---------|
| **[lamella](https://github.com/basidiocarp/lamella)** | Skills, hooks, plugins, and host packaging |
| **[cap](https://github.com/basidiocarp/cap)** | Web dashboard for the ecosystem |
| **[cortina](https://github.com/basidiocarp/cortina)** | Lifecycle signal capture and session attribution |
| **[hyphae](https://github.com/basidiocarp/hyphae)** | Persistent agent memory |
| **[mycelium](https://github.com/basidiocarp/mycelium)** | Token-optimized command output |
| **[rhizome](https://github.com/basidiocarp/rhizome)** | Code intelligence via tree-sitter and LSP |
| **[spore](https://github.com/basidiocarp/spore)** | Shared transport and editor primitives |
| **[stipe](https://github.com/basidiocarp/stipe)** | Ecosystem installer and manager |
| **[volva](https://github.com/basidiocarp/volva)** | Execution-host runtime layer |

> **Boundary:** `lamella` owns packaged content and host exports. It does not
> own session memory, shell filtering, code parsing, or lifecycle classification.

---

## Quick Start

```bash
# Claude marketplace build and install
./lamella build-marketplace
./lamella install core python typescript
./lamella install --preset stipe-package-repair
./lamella list

# Codex export and install
./lamella build-codex
./lamella install-codex --all
```

The `install` flow resolves manifest dependencies before it builds or installs
anything.

Named install surfaces live in `resources/presets/*.toml`. The
`stipe-package-repair` preset is the Lamella-owned repair surface that Stipe
can call directly with `./lamella install --preset stipe-package-repair`
without inventing its own package-selection rules.

---

## How It Works

```text
resources/ + manifests/      Lamella                    Host outputs
────────────────────────     ───────                    ────────────
skills, hooks, commands ─►   validators           ─►    dist/claude marketplace
shared subagents        ─►   builders             ─►    dist/codex exports
plugin manifests        ─►   dependency graph     ─►    installable artifacts
```

1. Author resources: keep source content in `resources/` with manifest metadata in `manifests/`.
2. Validate content: check paths, dependencies, references, and host compatibility.
3. Build host outputs: generate Claude plugins and Codex exports from the same source tree.
4. Install artifacts: install selected Claude plugins or Codex exports in dependency order.
5. Publish marketplaces: emit marketplace metadata for local or hosted consumption.

---

## Packaging Surface

| Surface | Output | Use case |
|---------|--------|----------|
| Claude Code | `dist/claude/` marketplace and plugins | Local or hosted Claude plugin installs |
| Codex | `dist/codex/` skills and agent files | Installable Codex exports under `~/.codex/` |

## Inventory

| Category | Count |
|----------|-------|
| Claude plugins | 52 |
| Skills across plugins | 292 |
| Layered umbrella plugins | 7 |

---

## What Lamella Owns

- Resource packaging for skills, hooks, commands, and subagents
- Manifest-driven dependency resolution
- Claude marketplace generation
- Codex export generation and installation
- Validation of content and generated output

## What Lamella Does Not Own

- Long-term memory and training data: handled by `hyphae`
- Code intelligence: handled by `rhizome`
- Lifecycle capture: handled by `cortina`
- Install and host repair policy: handled by `stipe`

---

## Key Features

- Single source, multiple hosts: builds Claude and Codex artifacts from one resource tree.
- Manifest dependencies: ensure installs happen in the right order.
- Hosted marketplace support: can publish a GitHub Pages-backed Claude marketplace.
- Layered plugin model: supports umbrella plugins and focused sub-plugins.
- Validation pipeline: checks resources, manifests, and generated output before release.

---

## Architecture

```text
lamella/
├── resources/   source skills, hooks, commands, subagents, rules
├── manifests/   Claude and Codex packaging manifests
├── builders/    build and install scripts
├── scripts/     validation and packaging helpers
├── docs/        authoring, reference, migration, and roadmap docs
└── dist/        generated outputs
```

```bash
./lamella build-marketplace
./lamella build-codex
./lamella install <plugin...>
./lamella install-codex <name...>
make validate
```

---

## Documentation

- [docs/README.md](docs/README.md): documentation entry point
- [docs/architecture.md](docs/architecture.md): repository and packaging architecture
- [docs/maintainers/README.md](docs/maintainers/README.md): maintainer-facing docs
- [docs/maintainers/feedback-capture.md](docs/maintainers/feedback-capture.md): feedback capture behavior
- [docs/maintainers/skill-inventory.md](docs/maintainers/skill-inventory.md): inventory overview
- [docs/authoring/best-practices.md](docs/authoring/best-practices.md): authoring guidance
- [docs/authoring/best-practices-codex.md](docs/authoring/best-practices-codex.md): Codex-specific authoring guidance
- [docs/authoring/skills-spec.md](docs/authoring/skills-spec.md): skill structure and expectations
- [docs/getting-started/README.md](docs/getting-started/README.md): getting started path
- [docs/reference/README.md](docs/reference/README.md): host reference entry point
- [docs/reference/claude/plugins.md](docs/reference/claude/plugins.md): Claude plugin reference
- [docs/reference/codex/plugins-overview.md](docs/reference/codex/plugins-overview.md): Codex packaging reference

## Development

```bash
make validate
./lamella build-marketplace
./lamella build-codex
```

## License

MIT
