# Agent Types Reference

Detailed reference for all available agent types in Claude Code swarms.

---

## Built-in Agent Types

These are always available without plugins.

### Bash

```javascript
Task({
  subagent_type: "Bash",
  description: "Run git commands",
  prompt: "Check git status and show recent commits"
})
```

- **Tools:** Bash only
- **Model:** Inherits from parent
- **Best for:** Git operations, command execution, system tasks

### Explore

```javascript
Task({
  subagent_type: "Explore",
  description: "Find API endpoints",
  prompt: "Find all API endpoints in this codebase. Be very thorough.",
  model: "haiku"  // Fast and cheap
})
```

- **Tools:** All read-only tools (no Edit, Write, NotebookEdit, Task)
- **Model:** Haiku (optimized for speed)
- **Best for:** Codebase exploration, file searches, code understanding
- **Thoroughness levels:** "quick", "medium", "very thorough"

### Plan

```javascript
Task({
  subagent_type: "Plan",
  description: "Design auth system",
  prompt: "Create an implementation plan for adding OAuth2 authentication"
})
```

- **Tools:** All read-only tools
- **Model:** Inherits from parent
- **Best for:** Architecture planning, implementation strategies

### general-purpose

```javascript
Task({
  subagent_type: "general-purpose",
  description: "Research and implement",
  prompt: "Research React Query best practices and implement caching for the user API"
})
```

- **Tools:** All tools (*)
- **Model:** Inherits from parent
- **Best for:** Multi-step tasks, research + action combinations

### claude-code-guide

```javascript
Task({
  subagent_type: "claude-code-guide",
  description: "Help with Claude Code",
  prompt: "How do I configure MCP servers?"
})
```

- **Tools:** Read-only + WebFetch + WebSearch
- **Best for:** Questions about Claude Code, Agent SDK, Anthropic API

### statusline-setup

```javascript
Task({
  subagent_type: "statusline-setup",
  description: "Configure status line",
  prompt: "Set up a status line showing git branch and node version"
})
```

- **Tools:** Read, Edit only
- **Model:** Sonnet
- **Best for:** Configuring Claude Code status line

---

## Plugin Agent Types

From the `compound-engineering` plugin (examples).

### Review Agents

```javascript
// Security review
Task({
  subagent_type: "compound-engineering:review:security-sentinel",
  description: "Security audit",
  prompt: "Audit this PR for security vulnerabilities"
// ... (26 lines trimmed)
  description: "Simplicity check",
  prompt: "Check if this implementation can be simplified"
})
```

**All review agents from compound-engineering:**

| Agent | Purpose |
|-------|---------|
| `agent-native-reviewer` | Ensures features work for agents too |
| `architecture-strategist` | Architectural compliance |
| `code-simplicity-reviewer` | YAGNI and minimalism |
| `data-integrity-guardian` | Database and data safety |
| `data-migration-expert` | Migration validation |
| `deployment-verification-agent` | Pre-deploy checklists |
| `dhh-rails-reviewer` | DHH/37signals Rails style |
| `julik-frontend-races-reviewer` | JavaScript race conditions |
| `kieran-python-reviewer` | Python best practices |
| `kieran-rails-reviewer` | Rails best practices |
| `kieran-typescript-reviewer` | TypeScript best practices |
| `pattern-recognition-specialist` | Design patterns and anti-patterns |
| `performance-oracle` | Performance analysis |
| `security-sentinel` | Security vulnerabilities |

### Research Agents

```javascript
// Best practices research
Task({
  subagent_type: "compound-engineering:research:best-practices-researcher",
  description: "Research auth best practices",
  prompt: "Research current best practices for JWT authentication in Rails 2024-2026"
// ... (12 lines trimmed)
  description: "Analyze auth history",
  prompt: "Analyze the git history of the authentication module to understand its evolution"
})
```

**All research agents:**

| Agent | Purpose |
|-------|---------|
| `best-practices-researcher` | External best practices |
| `framework-docs-researcher` | Framework documentation |
| `git-history-analyzer` | Code archaeology |
| `learnings-researcher` | Search docs/solutions/ |
| `repo-research-analyst` | Repository patterns |

### Design Agents

```javascript
Task({
  subagent_type: "compound-engineering:design:figma-design-sync",
  description: "Sync with Figma",
  prompt: "Compare implementation with Figma design at [URL]"
})
```

### Workflow Agents

```javascript
Task({
  subagent_type: "compound-engineering:workflow:bug-reproduction-validator",
  description: "Validate bug",
  prompt: "Reproduce and validate this reported bug: [description]"
})
```

---

## Choosing the Right Agent Type

| Task Type | Recommended Agent |
|-----------|-------------------|
| Code search/exploration | `Explore` |
| Architecture planning | `Plan` |
| Implementation work | `general-purpose` |
| Security review | `security-sentinel` |
| Performance audit | `performance-oracle` |
| Research best practices | `best-practices-researcher` |
| Git/shell operations | `Bash` |
