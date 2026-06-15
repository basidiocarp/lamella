# Plugin-Specific Features and Integration

Reference for plugin-specific command features and component integration.

## CLAUDE_PLUGIN_ROOT Variable

Plugin commands have access to `${CLAUDE_PLUGIN_ROOT}`, an environment variable that resolves to the plugin's absolute path.

**Purpose:**
- reference plugin files portably
- execute plugin scripts
- load plugin configuration
- access plugin templates

**Basic usage:**

```markdown
---
description: Analyze using plugin script
allowed-tools: Bash(node:*)
---

Run analysis: !`node ${CLAUDE_PLUGIN_ROOT}/scripts/analyze.js $1`

Review results and report findings.
```

**Common patterns:**

```markdown
# Execute plugin script
!`bash ${CLAUDE_PLUGIN_ROOT}/scripts/script.sh`

# Load plugin configuration
@${CLAUDE_PLUGIN_ROOT}/config/settings.json

# Use plugin template
@${CLAUDE_PLUGIN_ROOT}/templates/report.md

# Access plugin resources
@${CLAUDE_PLUGIN_ROOT}/docs/reference.md
```

**Why use it:**
- works across installations
- portable between systems
- avoids hardcoded paths
- essential for multi-file plugins

## Plugin Command Organization

Plugin commands are discovered automatically from `commands/`:

```text
plugin-name/
├── commands/
│   ├── foo.md
│   ├── bar.md
│   └── utils/
│       └── helper.md
└── plugin.json
```

**Naming guidance:**
- use descriptive action names
- avoid generic names like `test` or `run`
- consider a plugin-specific prefix where collisions are likely
- use hyphens for multi-word names

## Plugin Command Patterns

### Configuration-based pattern

```markdown
---
description: Deploy using plugin configuration
argument-hint: [environment]
allowed-tools: Read, Bash(*)
---

Load configuration: @${CLAUDE_PLUGIN_ROOT}/config/$1-deploy.json

Deploy to $1 using configuration settings.
Monitor deployment and report status.
```

### Template-based pattern

```markdown
---
description: Generate docs from template
argument-hint: [component]
---

Template: @${CLAUDE_PLUGIN_ROOT}/templates/docs.md

Generate documentation for $1 following template structure.
```

### Multi-script pattern

```markdown
---
description: Complete build workflow
allowed-tools: Bash(*)
---

Build: !`bash ${CLAUDE_PLUGIN_ROOT}/scripts/build.sh`
Test: !`bash ${CLAUDE_PLUGIN_ROOT}/scripts/test.sh`
Package: !`bash ${CLAUDE_PLUGIN_ROOT}/scripts/package.sh`

Review outputs and report workflow status.
```

## Integration with Plugin Components

### Agent integration

Launch plugin agents for complex tasks:

```markdown
---
description: Deep code review
argument-hint: [file-path]
---

Review @$1 using the plugin's `reviewer` agent.

Agent uses plugin resources:
- ${CLAUDE_PLUGIN_ROOT}/config/rules.json
- ${CLAUDE_PLUGIN_ROOT}/checklists/review.md
```

**Key points:**
- the agent must exist in `agents/`
- the command should make the trigger obvious
- document any plugin resources the agent depends on

### Skill integration

Leverage plugin skills for specialized knowledge:

```markdown
---
description: Document API with standards
argument-hint: [api-file]
---

Document API in @$1 following plugin standards.

Use the api-docs-standards skill to ensure:
- complete endpoint documentation
- consistent formatting
- useful examples
- error coverage
```

### Hook coordination

Design commands that work with plugin hooks:
- commands can prepare state for hooks to process
- hooks execute automatically on tool events
- commands should explain any expected hook side effects

### Multi-component workflows

Combine agents, skills, and scripts:

```markdown
---
description: Comprehensive review workflow
argument-hint: [file]
allowed-tools: Bash(node:*), Read
---

Run checks: !`node ${CLAUDE_PLUGIN_ROOT}/scripts/analyze.js $1`
Use reviewer agent for deeper inspection.
Apply review skill guidance for output quality.
Template: @${CLAUDE_PLUGIN_ROOT}/templates/review.md

Compile findings into the report template.
```

## Validation Patterns

Commands should validate inputs and resources before processing.

### Argument validation

```markdown
---
description: Deploy with validation
argument-hint: [environment]
---

Validate environment: !`echo "$1" | grep -E "^(dev|staging|prod)$" || echo "INVALID"`

If $1 is valid environment:
  Deploy to $1
Otherwise:
  Explain valid environments: dev, staging, prod
  Show usage: /deploy [environment]
```

### File existence checks

```markdown
---
description: Process configuration
argument-hint: [config-file]
---

Check file exists: !`test -f $1 && echo "EXISTS" || echo "MISSING"`

If file exists:
  Process configuration: @$1
Otherwise:
  Explain where to place config file
  Show expected format
  Provide example configuration
```
