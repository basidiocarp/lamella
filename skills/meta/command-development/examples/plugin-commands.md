# Plugin Command Examples

Practical examples of commands designed for Claude Code plugins, demonstrating plugin-specific patterns and features.

## Table of Contents

1. [Simple Plugin Command](#1-simple-plugin-command)
2. [Script-Based Analysis](#2-script-based-analysis)
3. [Template-Based Generation](#3-template-based-generation)
4. [Multi-Script Workflow](#4-multi-script-workflow)
5. [Configuration-Driven Deployment](#5-configuration-driven-deployment)
6. [Agent Integration](#6-agent-integration)
7. [Skill Integration](#7-skill-integration)
8. [Multi-Component Workflow](#8-multi-component-workflow)
9. [Validated Input Command](#9-validated-input-command)
10. [Environment-Aware Command](#10-environment-aware-command)

---

## 1. Simple Plugin Command

**Use case:** Basic command that uses plugin script

**File:** `commands/analyze.md`

```markdown
---
description: Analyze code quality using plugin tools
argument-hint: [file-path]
allowed-tools: Bash(node:*), Read
// ... (9 lines trimmed)
3. Suggested improvements
4. Code quality score interpretation
```

**Key features:**
- Uses `${CLAUDE_PLUGIN_ROOT}` for portable path
- Combines file reference with script execution
- Simple single-purpose command

---

## 2. Script-Based Analysis

**Use case:** Run comprehensive analysis using multiple plugin scripts

**File:** `commands/full-audit.md`

```markdown
---
description: Complete code audit using plugin suite
argument-hint: [directory]
allowed-tools: Bash(*)
model: sonnet
// ... (15 lines trimmed)
- Performance optimization opportunities
- Security vulnerabilities and fixes
- Overall health score and recommendations
```

**Key features:**
- Multiple script executions
- Organized output sections
- Comprehensive workflow
- Clear reporting structure

---

## 3. Template-Based Generation

**Use case:** Generate documentation following plugin template

**File:** `commands/gen-api-docs.md`

```markdown
---
description: Generate API documentation from template
argument-hint: [api-file]
---

// ... (12 lines trimmed)
- Rate limiting information

Format output as markdown suitable for README or docs site.
```

**Key features:**
- Uses plugin template
- Combines template with source file
- Standardized output format
- Clear documentation structure

---

## 4. Multi-Script Workflow

**Use case:** Orchestrate build, test, and deploy workflow

**File:** `commands/release.md`

```markdown
---
description: Execute complete release workflow
argument-hint: [version]
allowed-tools: Bash(*), Read
---
// ... (18 lines trimmed)
3. Test results summary
4. Next steps for deployment
5. Rollback plan if needed
```

**Key features:**
- Multi-step workflow
- Sequential script execution
- Clear step numbering
- Comprehensive reporting

---

## 5. Configuration-Driven Deployment

**Use case:** Deploy using environment-specific plugin configuration

**File:** `commands/deploy.md`

```markdown
---
description: Deploy application to environment
argument-hint: [environment]
allowed-tools: Read, Bash(*)
---
// ... (16 lines trimmed)
7. Update deployment log

Report deployment status and any issues encountered.
```

**Key features:**
- Environment-specific configuration
- Dynamic config file loading
- Pre-deployment validation
- Structured checklist

---

## 6. Agent Integration

**Use case:** Command that launches plugin agent for complex task

**File:** `commands/deep-review.md`

```markdown
---
description: Deep code review using plugin agent
argument-hint: [file-or-directory]
---

// ... (12 lines trimmed)
- Performance guidelines: ${CLAUDE_PLUGIN_ROOT}/docs/performance.md

Note: This uses the Task tool to launch the plugin's code-reviewer agent for thorough analysis.
```

**Key features:**
- Delegates to plugin agent
- Documents agent capabilities
- References plugin resources
- Clear scope definition

---

## 7. Skill Integration

**Use case:** Command that leverages plugin skill for specialized knowledge

**File:** `commands/document-api.md`

```markdown
---
description: Document API following plugin standards
argument-hint: [api-file]
---

// ... (15 lines trimmed)
- Quality validation criteria

Generate production-ready API documentation.
```

**Key features:**
- Invokes plugin skill by name
- Documents skill purpose
- Clear expectations
- Leverages skill knowledge

---

## 8. Multi-Component Workflow

**Use case:** Complex workflow using agents, skills, and scripts

**File:** `commands/complete-review.md`

```markdown
---
description: Comprehensive review using all plugin components
argument-hint: [file-path]
allowed-tools: Bash(node:*), Read
---
// ... (32 lines trimmed)
3. Nice-to-have enhancements (could fix)

Include specific file locations and suggested changes for each item.
```

**Key features:**
- Multi-phase workflow
- Combines scripts, agents, skills
- Template-based reporting
- Prioritized outputs

---

## 9. Validated Input Command

**Use case:** Command with input validation and error handling

**File:** `commands/build-env.md`

```markdown
---
description: Build for specific environment with validation
argument-hint: [environment]
allowed-tools: Bash(*)
---
// ... (19 lines trimmed)
- Provide expected values/locations
- Suggest corrective actions
- Document troubleshooting steps
```

**Key features:**
- Input validation
- Resource existence checks
- Error handling
- Helpful error messages
- Graceful failure handling

---

## 10. Environment-Aware Command

**Use case:** Command that adapts behavior based on environment

**File:** `commands/run-checks.md`

```markdown
---
description: Run environment-appropriate checks
argument-hint: [environment]
allowed-tools: Bash(*), Read
---
// ... (21 lines trimmed)
**Development:** Focus on blocking issues only

Report status and recommend proceed/block decision.
```

**Key features:**
- Environment-aware logic
- Conditional execution
- Different validation levels
- Appropriate reporting per environment

---

## Common Patterns Summary

### Pattern: Plugin Script Execution
```markdown
!`node ${CLAUDE_PLUGIN_ROOT}/scripts/script-name.js $1`
```
Use for: Running plugin-provided Node.js scripts

### Pattern: Plugin Configuration Loading
```markdown
@${CLAUDE_PLUGIN_ROOT}/config/config-name.json
```
Use for: Loading plugin configuration files

### Pattern: Plugin Template Usage
```markdown
@${CLAUDE_PLUGIN_ROOT}/templates/template-name.md
```
Use for: Using plugin templates for generation

### Pattern: Agent Invocation
```markdown
Launch the [agent-name] agent for [task description].
```
Use for: Delegating complex tasks to plugin agents

### Pattern: Skill Reference
```markdown
Use the [skill-name] skill to ensure [requirements].
```
Use for: Leveraging plugin skills for specialized knowledge

### Pattern: Input Validation
```markdown
Validate input: !`echo "$1" | grep -E "^pattern$" && echo "OK" || echo "ERROR"`
```
Use for: Validating command arguments

### Pattern: Resource Validation
```markdown
Check exists: !`test -f ${CLAUDE_PLUGIN_ROOT}/path/file && echo "YES" || echo "NO"`
```
Use for: Verifying required plugin files exist

---

## Development Tips

### Testing Plugin Commands

1. **Test with plugin installed:**
   ```bash
   cd /path/to/plugin
   claude /command-name args
   ```

2. **Verify ${CLAUDE_PLUGIN_ROOT} expansion:**
   ```bash
   # Add debug output to command
   !`echo "Plugin root: ${CLAUDE_PLUGIN_ROOT}"`
   ```

3. **Test across different working directories:**
   ```bash
   cd /tmp && claude /command-name
   cd /other/project && claude /command-name
   ```

4. **Validate resource availability:**
   ```bash
   # Check all plugin resources exist
   !`ls -la ${CLAUDE_PLUGIN_ROOT}/scripts/`
   !`ls -la ${CLAUDE_PLUGIN_ROOT}/config/`
   ```

### Common Mistakes to Avoid

1. **Using relative paths instead of ${CLAUDE_PLUGIN_ROOT}:**
   ```markdown
   # Wrong
   !`node ./scripts/analyze.js`

   # Correct
   !`node ${CLAUDE_PLUGIN_ROOT}/scripts/analyze.js`
   ```

2. **Forgetting to allow required tools:**
   ```markdown
   # Missing allowed-tools
   !`bash script.sh`  # Will fail without Bash permission

   # Correct
   ---
   allowed-tools: Bash(*)
   ---
   !`bash ${CLAUDE_PLUGIN_ROOT}/scripts/script.sh`
   ```

3. **Not validating inputs:**
   ```markdown
   # Risky - no validation
   Deploy to $1 environment

   # Better - with validation
   Validate: !`echo "$1" | grep -E "^(dev|staging|prod)$" || echo "INVALID"`
   Deploy to $1 environment (if valid)
   ```

4. **Hardcoding plugin paths:**
   ```markdown
   # Wrong - breaks on different installations
   @/home/user/.claude/plugins/my-plugin/config.json

   # Correct - works everywhere
   @${CLAUDE_PLUGIN_ROOT}/config.json
   ```

---

For detailed plugin-specific features, see `references/plugin-features-reference.md`.
For general command development, see main `SKILL.md`.
