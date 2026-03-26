# Skill-Issue

A modular plugin system for Claude Code with **286 curated skills** across **25 specialized plugins**.

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
| 🖥️ **DevOps** | 24 | DevOps and infrastructure: Docker, Kubernetes, Terraform, AWS, CI/CD, and deployment patterns. [View →](../manifests/claude/devops.json) |
| 🛠️ **Developer Ops** | 5 | Operational engineering workflows: incident command, release management, runbooks, tech debt tracking, and spec-driven execution. [View →](../manifests/claude/developer-ops.json) |
| 🔒 **Security** | 26 | Security analysis: vulnerability scanning, threat modeling, fuzzing, auditing, compliance readiness, and secure coding practices. [View →](../manifests/claude/security.json) |
| ⚙️ **Core** | 32 | Essential development fundamentals: coding standards, testing, git workflow, debugging, and code review. [View →](../manifests/claude/core.json) |
| 🔧 **Tools** | 28 | CLI tools, shell and PowerShell scripting, analytics implementation, MCP integration, API design, and productivity utilities. [View →](../manifests/claude/tools.json) |
| ☁️ **Atmos** | 20 | Cloud Posse Atmos stack orchestration, Terraform/Helmfile/Ansible integration. [View →](../manifests/claude/atmos.json) |
| 🤖 **Meta** | 17 | Framework internals: skill management, task tracking, plugin configuration, and system utilities. [View →](../manifests/claude/meta.json) |
| 🗂️ **Workflow** | 14 | Development workflows: planning, git operations, decision records, continuous improvement, mental models, and project management patterns. [View →](../manifests/claude/workflow.json) |
| ✍️ **Writing** | 6 | Technical and editorial writing: documentation, changelogs, voice, style, posters, and presentation-ready content. [View →](../manifests/claude/writing.json) |
| 🧠 **AI Agents** | 9 | AI agent development: multi-agent patterns, evaluation, RAG architecture, and Claude-specific tooling. [View →](../manifests/claude/ai-agents.json) |
| 🐍 **Python** | 10 | Python development: Django, FastAPI, async patterns, testing, and modern Python practices. [View →](../manifests/claude/python.json) |
| 🤝 **Collaboration** | 7 | Team collaboration and facilitation: teaching, debate, project continuity, structured challenge, expert synthesis, and cross-functional coordination. [View →](../manifests/claude/collaboration.json) |
| 🟦 **TypeScript** | 9 | TypeScript and JavaScript development: React, Next.js, Node.js patterns, and frontend architecture. [View →](../manifests/claude/typescript.json) |
| 🦀 **Rust** | 11 | Rust development: ownership, concurrency, unsafe review, crate research, and idiomatic Rust practices. [View →](../manifests/claude/rust.json) |
| 🧩 **Microservices** | 4 | Microservices architecture: CQRS, event sourcing, sagas, and service design patterns. [View →](../manifests/claude/microservices.json) |
| 📋 **Agile PM** | 10 | Product planning and delivery: problem framing, opportunity trees, PRDs, user stories, prioritization, refinement, retrospectives, and delivery artifacts. [View →](../manifests/claude/agile-pm.json) |
| 🔎 **Customer Insights** | 9 | Discovery and research artifacts: JTBD, interview planning, market analysis, journey mapping, competitive analysis, and shared language. [View →](../manifests/claude/customer-insights.json) |
| 🧭 **Executive** | 11 | Leadership and operating-system skills: board updates, operating rhythms, change rollout, executive coaching, health diagnostics, and scenario planning. [View →](../manifests/claude/executive.json) |
| 📣 **Go To Market** | 6 | Product marketing and launch content: pricing strategy, working-backwards press releases, launch checklists, content strategy, and email programs. [View →](../manifests/claude/go-to-market.json) |
| 🏢 **Enterprise IT** | 5 | Internal workspace administration: Atlassian, Confluence, Jira, Google Workspace, and Microsoft 365 operations. [View →](../manifests/claude/enterprise-it.json) |
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
