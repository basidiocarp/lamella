# lamella

A portable resource system for AI coding environments, with first-class Claude
plugin builds and Codex exports.

Claude builds follow the official Claude Code plugin format
(`.claude-plugin/plugin.json`). Codex builds export installable skill folders
and custom agent TOML files.

## Quick Start

```bash
# Claude: build marketplace + install plugins
./lamella build-marketplace
./lamella install core python typescript
./lamella list

# Codex: generate manifests + build Codex exports
./lamella build-codex

# Codex: build and install exported skills and agents
./lamella install-codex --all
```

The `install` flow resolves manifest dependencies before it builds or installs
anything. Installing `typescript` also installs `core`, because that is the
dependency declared in `manifests/claude/typescript.json`.

## As a Claude Code Marketplace

After building, `dist/claude/` is a proper Claude Code marketplace:

```bash
# Build the marketplace
./lamella build-marketplace

# Add it in Claude Code
/plugin marketplace add ./dist/claude

# Or load a single plugin for testing
claude --plugin-dir dist/claude/plugins/core
```

### Direct GitHub marketplace source

`lamella` also ships a repo-root marketplace catalog in `.claude-plugin/marketplace.json` on `main`. That means Claude Code can add the repository itself as the marketplace source:

```text
/plugin marketplace add basidiocarp/lamella
```

That repo-root catalog points each plugin to the published `gh-pages` branch via `git-subdir`, so the marketplace source stays lightweight on `main` while plugin installs still fetch the built plugin artifacts.

### Windows-friendly build

`lamella` is bash-driven, so the clean Windows path is WSL2:

```bash
# WSL2 Ubuntu
sudo apt update
sudo apt install -y jq make zip unzip curl git

# Node 24 via fnm
curl -fsSL https://fnm.vercel.app/install | bash
source ~/.bashrc
fnm install 24
fnm use 24

# Rust
curl https://sh.rustup.rs -sSf | sh -s -- -y
source "$HOME/.cargo/env"

# Build marketplace
./lamella build-marketplace

# Copy to a Windows path for Claude Code on Windows
mkdir -p /mnt/c/Users/<you>/lamella-release
rm -rf /mnt/c/Users/<you>/lamella-release/claude
cp -r dist/claude /mnt/c/Users/<you>/lamella-release/claude
```

Then in Claude Code on Windows:

```text
/plugin marketplace add C:/Users/<you>/lamella-release/claude
```

### Hosted marketplace URL

The `Publish Marketplace` GitHub Actions workflow publishes a hosted marketplace to the `gh-pages` branch and GitHub Pages. It builds `marketplace.json` with URL-safe `git-subdir` plugin sources so Claude Code can consume the marketplace by URL.

Enable GitHub Pages for the repository and set it to serve from the `gh-pages` branch root.

After GitHub Pages is enabled for the repository, add the marketplace in Claude Code with:

```text
/plugin marketplace add https://<owner>.github.io/<repo>/.claude-plugin/marketplace.json
```

The hosted catalog points plugin installs back to the same repository's `gh-pages` branch, so users can install and update plugins from a stable marketplace URL without needing a local checkout.

### Marketplace versioning

`lamella` uses a two-layer versioning flow:

- `VERSION` holds the next base release version for Claude marketplace builds on `main`
- tagged releases (`vX.Y.Z`) stamp `X.Y.Z` into the built marketplace and plugin manifests

The hosted `gh-pages` marketplace is intentionally mutable. Pushes to `main` publish snapshot builds as `<VERSION>-dev.<run-number>`, while tagged releases publish immutable `.tar.gz` and `.zip` artifacts stamped with the tag version.

### Repository settings example

If you want another repository to automatically offer lamella as a known marketplace, add this to that repo's Claude settings:

```json
{
  "extraKnownMarketplaces": {
    "lamella": {
      "source": {
        "source": "github",
        "repo": "basidiocarp/lamella",
        "ref": "gh-pages"
      }
    }
  }
}
```

## As a Codex Export

After building, `dist/codex/skills/` contains portable skill folders and
`dist/codex/profiles/*/agents/` contains generated custom agent TOML files.
`./lamella install-codex` installs both into `~/.codex/`.

```bash
./lamella build-codex
./lamella install-codex --list
./lamella install-codex --all
```

## Common wrapper commands

`./lamella` is the preferred entrypoint for local work.

- `./lamella list` lists built Claude plugins.
- `./lamella install <plugin...>` installs Claude plugins in dependency order.
- `./lamella install-codex <name...>` installs exported Codex skills and selected agents.
- `./lamella update` refreshes both Claude and Codex build outputs.

## Plugins

Lamella currently ships `52` Claude plugins covering `292` skills. Some plugin
names are umbrella bundles with `0` direct skills because they group layered
sub-plugins behind a stable install surface.

### Product and language plugins

| Plugin | Skills | Description |
|--------|--------|-------------|
| **agile-pm** | 10 | Product planning and delivery: problem framing, opportunity trees, PRDs, user stories, prioritization, refinement, retrospectives, and delivery artifacts |
| **ai-agents** | 9 | AI agent development: multi-agent patterns, LLM evaluation, RAG architecture, and Claude-specific tooling |
| **atmos** | 20 | Cloud Posse Atmos: stack orchestration, Terraform/Helmfile/Ansible integration, configuration management, and CI/CD patterns |
| **collaboration** | 7 | Team collaboration and facilitation: teaching, debate, project continuity, structured challenge, expert synthesis, and cross-functional coordination |
| **cpp** | 3 | C++ development: modern C++ patterns, coding standards, and testing practices |
| **customer-insights** | 9 | Discovery and research artifacts: JTBD, interview planning, market analysis, journey mapping, competitive analysis, and shared language |
| **database** | 3 | Database development: schema design, SQL optimization, PostgreSQL, migrations, and data modeling |
| **developer-ops** | 5 | Operational engineering workflows: incident command, release management, runbooks, tech debt tracking, and spec-driven execution |
| **enterprise-it** | 5 | Internal workspace administration: Atlassian, Confluence, Jira, Google Workspace, and Microsoft 365 operations |
| **executive** | 11 | Leadership and operating-system skills: board updates, operating rhythms, change rollout, executive coaching, health diagnostics, and scenario planning |
| **go** | 2 | Go development: concurrency patterns, testing, and idiomatic Go practices |
| **go-to-market** | 6 | Product marketing and launch content: pricing strategy, working-backwards press releases, launch checklists, content strategy, and email programs |
| **microservices** | 4 | Microservices architecture, event sourcing, and distributed systems |
| **python** | 10 | Python development: Django, FastAPI, async patterns, testing, and modern Python practices |
| **rag** | 4 | Retrieval-Augmented Generation: vector search, embeddings, hybrid search, and RAG system architecture |
| **rust** | 17 | Rust development: 15 core rules plus routed skills for async, APIs, testing, performance, docs, and project layout |
| **typescript** | 9 | TypeScript/JavaScript development: React, Next.js, Node.js patterns, and frontend architecture |
| **writing** | 6 | Technical and editorial writing: documentation, changelogs, voice, style, posters, and presentation-ready content |

### Layered umbrella plugins

| Plugin | Skills | Description |
|--------|--------|-------------|
| **core** | 0 | Umbrella bundle for layered core development plugins and shared base resources |
| **devops** | 0 | Umbrella bundle for layered DevOps plugins and shared infrastructure commands |
| **frontend** | 0 | Umbrella bundle for layered frontend plugins and shared frontend commands |
| **meta** | 0 | Umbrella bundle for layered Lamella authoring, routing, and governance plugins |
| **security** | 0 | Umbrella bundle for layered security plugins and shared security commands |
| **tools** | 0 | Umbrella bundle for layered tool plugins and shared research/setup commands |
| **workflow** | 0 | Umbrella bundle for layered workflow plugins and shared workflow commands |

### Layered sub-plugins

| Plugin | Skills | Description |
|--------|--------|-------------|
| **core-architecture** | 10 | Architecture and design guidance for refactors, interfaces, patterns, and modernization |
| **core-base** | 6 | Foundational development workflow: planning, debugging, and test discipline |
| **core-operations** | 7 | Operational development support: onboarding, memory, git cleanup, planning, and continuity |
| **core-quality** | 9 | Code quality and verification: reviews, tests, fidelity checks, and implementation gates |
| **devops-cloud** | 5 | Cloud infrastructure patterns for AWS CDK, serverless, costs, and Bedrock AgentCore |
| **devops-kubernetes** | 4 | Kubernetes delivery: Helm, manifests, security policies, and GitOps workflows |
| **devops-observability** | 7 | Observability and resilience: tracing, metrics, SLOs, chaos, and postmortems |
| **devops-platform** | 8 | Platform automation: Docker, Terraform, Ansible, CI validation, and deployments |
| **frontend-3d** | 2 | 3D frontend experiences for Spline and advanced Three.js workflows |
| **frontend-base** | 5 | Core frontend guidance for accessibility, components, responsiveness, and performance |
| **frontend-visual** | 4 | Visual frontend work for motion, design systems, screenshots, and slides |
| **meta-authoring** | 8 | Lamella authoring tools for skills, hooks, commands, plugins, and workflow design |
| **meta-governance** | 5 | Meta governance for curation, audits, stocktakes, and task capture |
| **meta-routing** | 4 | Meta routing and orchestration for skill discovery, composition, and team coordination |
| **security-base** | 7 | Core security practices: auth, secrets, defaults, reviews, and safe APIs |
| **security-compliance** | 5 | Security compliance and threat modeling: PCI, SOC 2, STRIDE, and mitigations |
| **security-crypto** | 3 | Applied crypto security: constant-time analysis, vectors, and malware signatures |
| **security-fuzzing** | 4 | Security fuzzing: harness design, sanitizer setup, crash reproduction, and OSS-Fuzz |
| **security-scanning** | 6 | Security scanning: SAST, dependency checks, prompt-injection audits, and PII detection |
| **tools-browser** | 3 | Browser automation and realtime web tooling for interactive surfaces |
| **tools-cli** | 8 | CLI and shell tooling: generators, validators, terminals, and command ergonomics |
| **tools-diagrams** | 2 | Diagramming workflows for Mermaid and Excalidraw artifacts |
| **tools-documents** | 5 | Document processing for PDF, Word, PowerPoint, spreadsheets, and Markdown conversion |
| **tools-integration** | 10 | Integration tooling for MCP, APIs, analytics, devcontainers, sync, and knowledge stores |
| **workflow-execution** | 4 | Execution workflows for handoffs, conductor, plan execution, and branch finishing |
| **workflow-git** | 4 | Git-centric workflows for issue analysis, pull requests, worktrees, and review resolution |
| **workflow-planning** | 6 | Planning workflows for specs, decisions, edge cases, and continuous improvement |

**Total: 292 skills across 52 plugins**

## Directory Structure

```
lamella/
├── resources/
│   ├── skills/           # Source skills (organized by category)
│   ├── subagents/        # Shared Claude/Codex subagent source
│   ├── commands/         # Slash commands (source, by category)
│   ├── hooks/            # Event hooks
│   ├── protocols/        # Shared protocol and rubric docs
│   ├── rules/            # Project rules
│   ├── templates/        # Configuration and doc templates
│   ├── workflows/        # Development and quality workflows
│   └── mcp-configs/      # MCP server configs
├── manifests/
│   ├── claude/           # Claude plugin manifests
│   └── codex/            # Codex export manifests
├── builders/
│   ├── build-claude-plugin.sh
│   ├── build-claude-marketplace.sh
│   ├── install-codex-skills.sh
│   ├── sync-codex-manifests.sh
│   └── build-codex-skills.sh
├── scripts/
│   ├── plugins/          # Build + install pipeline
│   │   ├── build-plugin.sh       # Build single plugin
│   │   ├── build-marketplace.sh  # Build all + marketplace.json
│   │   └── install-plugin.sh     # Install to ~/.claude/plugins/
│   ├── ci/               # Validators (8 scripts)
│   └── hooks/            # Hook scripts
├── dist/                 # Built output (gitignored)
│   ├── claude/
│   │   ├── .claude-plugin/marketplace.json
│   │   └── plugins/<name>/
│   └── codex/
│       ├── skills/<skill-name>/
│       └── profiles/<name>/
└── docs/                 # Documentation
```

## Build Pipeline

The source organizes resources in category subdirectories (`resources/subagents/code-quality/code-reviewer/SUBAGENT.md`).
The generalized build step can either flatten them into Claude Code plugin
directories or export portable Codex skill folders and Codex agent TOML files.

```
Source:  resources/subagents/code-quality/code-reviewer/SUBAGENT.md
         resources/skills/core/brainstorming/SKILL.md

Built:   dist/claude/plugins/core/agents/code-reviewer.md
         dist/claude/plugins/core/skills/brainstorming/SKILL.md
         dist/claude/plugins/core/.claude-plugin/plugin.json

Codex:   dist/codex/skills/brainstorming/SKILL.md
         dist/codex/profiles/core/agents/code-reviewer.toml
         dist/codex/profiles/core/profile.json
```

### Claude build

Build one plugin from its manifest:

```bash
bash builders/build-claude-plugin.sh manifests/claude/core.json
```

Build all plugins and generate marketplace.json:

```bash
bash builders/build-claude-marketplace.sh
```

### Codex build

Generate Codex manifests from Claude manifests, then build the Codex exports:

```bash
bash builders/sync-codex-manifests.sh
bash builders/build-codex-skills.sh
```

### install-plugin.sh

Install built plugins to `~/.claude/plugins/lamella/`:

```bash
./lamella list
./lamella install core typescript python
./lamella install --all
./lamella install --dry-run --all
./lamella uninstall security
```

## Validation

```bash
make validate          # Source validators (8 scripts)
node scripts/ci/validate-build.js  # Post-build validator
```

## Releases

Tagging `v*` triggers the release workflow, which now publishes both `.tar.gz` and `.zip` artifacts for Claude and Codex builds:

```bash
git tag -a v1.2.3 -m "release notes"
git push origin v1.2.3
```

Windows users can download `lamella-claude-v1.2.3.zip`, extract it, and add the extracted `claude/` directory as a marketplace in Claude Code.

Keep `CHANGELOG.md` current with an `Unreleased` section. When you cut a release, move those notes into a dated `X.Y.Z` entry, tag `vX.Y.Z`, and then bump `VERSION` to the next target on `main`.

## Environment Variables

- `CLAUDE_HOME` — Installation directory (default: `~/.claude`)
- `LAMELLA_CONTENT_ROOT` — Content directory for skills, commands, agents, rules, hooks, workflows, templates, and presets (default: `resources/` within the lamella repo). Set to an absolute path or a path relative to the repo root to read content from an external directory. This enables a future content/infrastructure split without changing any build scripts.

## Requirements

- bash 4+
- jq (for JSON processing)
- Node.js (for validators)

## License

MIT
