# Skill-Issue

A modular plugin system for Claude Code with **286 curated skills** across **20 specialized plugins**.

---

## What Is Skill-Issue?

Skill-Issue extends Claude's capabilities through a comprehensive skill library organized into installable plugins. Each skill contains:

- **Instructions** — Detailed guidance for specific domains and workflows
- **Reference documentation** — Deep knowledge loaded on-demand
- **Templates** — Structured output formats for consistent results
- **Trigger phrases** — Context-aware activation for automatic skill loading

Skills are optimized for Claude Code (CLI) with Haiku-friendly formatting for efficient context usage.

---

## Plugin Categories

| Plugin | Skills | Description |
|--------|--------|-------------|
| 🖥️ **DevOps** | 27 | DevOps and infrastructure: Docker, Kubernetes, Terraform, AWS, CI/CD, and deployment patterns. [View →](../manifests/claude/devops.json) |
| 🔒 **Security** | 26 | Security analysis: vulnerability scanning, threat modeling, fuzzing, auditing, compliance readiness, and secure coding practices. [View →](../manifests/claude/security.json) |
| ⚙️ **Core** | 33 | Essential development fundamentals: coding standards, testing, git workflow, debugging, and code review. [View →](../manifests/claude/core.json) |
| 🔧 **Tools** | 30 | CLI tools, shell and PowerShell scripting, workspace administration, analytics implementation, MCP integration, API design, and productivity utilities. [View →](../manifests/claude/tools.json) |
| ☁️ **Atmos** | 20 | Cloud Posse Atmos stack orchestration, Terraform/Helmfile/Ansible integration. [View →](../manifests/claude/atmos.json) |
| 🤖 **Meta** | 17 | Framework internals: skill management, task tracking, plugin configuration, and system utilities. [View →](../manifests/claude/meta.json) |
| 🗂️ **Workflow** | 17 | Development workflows: planning, git operations, scenario planning, strategy-to-execution alignment, decision records, continuous improvement, and project management patterns. [View →](../manifests/claude/workflow.json) |
| ✍️ **Writing** | 9 | Technical and product writing: documentation, articles, content strategy, email sequences, changelogs, and editorial workflows. [View →](../manifests/claude/writing.json) |
| 🧠 **AI Agents** | 9 | AI agent development: multi-agent patterns, evaluation, RAG architecture, and Claude-specific tooling. [View →](../manifests/claude/ai-agents.json) |
| 🐍 **Python** | 10 | Python development: Django, FastAPI, async patterns, testing, and modern Python practices. [View →](../manifests/claude/python.json) |
| 🤝 **Collaboration** | 8 | Team collaboration and leadership: teaching, debate, project continuity, coaching, structured challenge, and cross-functional coordination. [View →](../manifests/claude/collaboration.json) |
| 🟦 **TypeScript** | 9 | TypeScript and JavaScript development: React, Next.js, Node.js patterns, and frontend architecture. [View →](../manifests/claude/typescript.json) |
| 🦀 **Rust** | 11 | Rust development: ownership, concurrency, unsafe review, crate research, and idiomatic Rust practices. [View →](../manifests/claude/rust.json) |
| 🧩 **Microservices** | 4 | Microservices architecture: CQRS, event sourcing, sagas, and service design patterns. [View →](../manifests/claude/microservices.json) |
| 📋 **Agile PM** | 33 | Agile and product operations: discovery, customer research and market analysis artifacts, storyboards, pricing strategy, feature investment analysis, working-backwards planning artifacts, delivery, stakeholder workflows, operating rhythms, executive updates, leadership transitions, executive onboarding, health diagnostics, culture design, Jira and Confluence operations, and workspace administration. [View →](../manifests/claude/agile-pm.json) |
| 🎨 **Frontend** | 11 | Frontend development: accessibility, design systems, 3D interfaces, responsive layouts, performance, and UI generation. [View →](../manifests/claude/frontend.json) |
| 🐹 **Go** | 2 | Go development: idiomatic patterns, concurrency, and testing workflows. [View →](../manifests/claude/go.json) |
| ⚙️ **C++** | 3 | C++ development: modern C++, testing, and embedded systems patterns. [View →](../manifests/claude/cpp.json) |
| 🗄️ **Database** | 3 | Database development: schema design, PostgreSQL patterns, SQL optimization, and query tuning. [View →](../manifests/claude/database.json) |
| 🔎 **RAG** | 4 | Retrieval-Augmented Generation: embeddings, hybrid search, vector optimization, and RAG system design. [View →](../manifests/claude/rag.json) |

[→ Full Plugin List](../README.md#plugins)

---

## Quick Start

```bash
# Build all plugins
for manifest in manifests/claude/*.json; do
  [[ "$(basename "$manifest")" != "schema.json" ]] && bash scripts/plugins/build-plugin.sh "$manifest"
done

# List available plugins
./scripts/plugins/install-plugin.sh --list

# Install specific plugins
./scripts/plugins/install-plugin.sh core python typescript

# Install all plugins
./scripts/plugins/install-plugin.sh --all
```

[→ Getting started](getting-started/index.md)

---

## Documentation

| Section | Description |
|---------|-------------|
| [Getting Started](getting-started/index.md) | Installation, first skill, categorization guide |
| [Authoring](authoring/best-practices.md) | Skill writing best practices and spec |
| [Reference](reference/plugins.md) | Claude Code official docs (plugins, hooks, skills, MCP, settings, etc.) |
| [Architecture](architecture.md) | How the build pipeline and plugin system work |
| [Roadmap](roadmap.md) | Project history and future plans |

---

## License

Personal use. Modify freely.
