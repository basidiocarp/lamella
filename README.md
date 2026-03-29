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

| Plugin | Skills | Description |
|--------|--------|-------------|
| **devops** | 24 | Docker, Kubernetes, Terraform, AWS, CI/CD, and deployment patterns |
| **developer-ops** | 5 | Incident command, release management, runbooks, tech debt tracking, and spec-driven execution |
| **security** | 26 | Vulnerability scanning, threat modeling, fuzzing, auditing, and secure coding practices |
| **core** | 32 | Coding standards, testing, git workflow, debugging, and code review |
| **tools** | 28 | CLI tools, shell and PowerShell scripting, analytics, MCP integration, and productivity utilities |
| **atmos** | 20 | Cloud Posse Atmos stack orchestration |
| **meta** | 17 | Framework internals, skill management, and plugin utilities |
| **workflow** | 14 | Planning, git operations, decision records, and project workflows |
| **ai-agents** | 9 | Multi-agent patterns, LLM evaluation, and Claude-specific tooling |
| **python** | 10 | Django, FastAPI, async patterns, testing, and modern Python practices |
| **collaboration** | 7 | Team facilitation, debate, project continuity, and expert synthesis |
| **typescript** | 9 | React, Next.js, Node.js patterns, and frontend architecture |
| **rust** | 11 | Ownership, concurrency, unsafe review, and idiomatic Rust practices |
| **microservices** | 4 | Event sourcing, sagas, CQRS, and distributed systems |
| **agile-pm** | 10 | Product planning and delivery artifacts |
| **customer-insights** | 9 | JTBD, interview planning, market analysis, journey mapping, competitive analysis, and shared language |
| **executive** | 11 | Board updates, operating rhythms, executive coaching, and scenario planning |
| **go-to-market** | 6 | Pricing, launch content, press releases, content strategy, and email programs |
| **enterprise-it** | 5 | Atlassian, Confluence, Jira, Google Workspace, and Microsoft 365 operations |
| **frontend** | 11 | Accessibility, design systems, 3D interfaces, responsive layouts, and performance |
| **go** | 2 | Concurrency patterns, testing, and idiomatic Go |
| **cpp** | 3 | Modern C++, testing, and embedded systems patterns |
| **database** | 3 | Schema design, PostgreSQL, SQL optimization, and query tuning |
| **rag** | 4 | Embeddings, hybrid search, vector optimization, and RAG architecture |
| **writing** | 6 | Documentation, voice, style, changelogs, and poster workflows |

**Total: 286 skills across 25 plugins**

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

## Requirements

- bash 4+
- jq (for JSON processing)
- Node.js (for validators)

## License

MIT
