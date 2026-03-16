# Skill-Issue

A modular plugin system for Claude Code with **230 curated skills** across **20 specialized plugins**.

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
| 🖥️ **DevOps** | 24 | Docker, Kubernetes, Terraform, AWS, CI/CD pipelines, and deployment automation. [View →](../plugin-manifests/devops.json) |
| 🔒 **Security** | 25 | Vulnerability scanning, threat modeling, fuzzing, and secure coding practices. [View →](../plugin-manifests/security.json) |
| ⚙️ **Core** | 24 | Coding standards, testing, git workflow, debugging, and code review. [View →](../plugin-manifests/core.json) |
| 🔧 **Tools** | 25 | CLI tools, shell scripting, MCP integration, API design, and prompt engineering. [View →](../plugin-manifests/tools.json) |
| ☁️ **Atmos** | 20 | Cloud Posse Atmos stack orchestration, Terraform/Helmfile/Ansible integration. [View →](../plugin-manifests/atmos.json) |
| 🤖 **Meta** | 19 | Framework internals, skill management, task tracking, and system utilities. [View →](../plugin-manifests/meta.json) |

[→ Full Plugin List](../README.md#plugins)

---

## Quick Start

```bash
# Build all plugins
for manifest in plugin-manifests/*.json; do
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
