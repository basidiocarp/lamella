# Getting Started

Welcome to MegaClaude2! This guide will help you get up and running with **230 skills** across **20 plugins**.

---

## Installation

```bash
# Build all plugins
for manifest in plugin-manifests/*.json; do
  [[ "$(basename "$manifest")" != "schema.json" ]] && \
    bash scripts/plugins/build-plugin.sh "$manifest"
done

# Install specific plugins
./scripts/plugins/install-plugin.sh core python typescript

# Install all
./scripts/plugins/install-plugin.sh --all
```

---

## Quick Overview

### What You'll Learn

1. **[What Are Skills?](what-are-skills.md)** — Understanding how skills extend Claude's capabilities
2. **Installation** — Building and installing plugins
3. **[Your First Skill](your-first-skill.md)** — A hands-on tutorial

### Prerequisites

- Claude Code CLI installed
- Bash shell (Linux/macOS) or WSL (Windows)
- Basic familiarity with terminal commands

---

## Next Steps

After installation, try the [Your First Skill](your-first-skill.md) tutorial to see skills in action.
