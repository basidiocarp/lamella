# Claude Code Plugin Validator Reference

> Living reference for observed plugin validator behavior and constraints. Update when new constraints are discovered or existing behavior changes with a new Claude Code release.

**Last validated against:** Claude Code v0.10.x (2026-04-15)

---

## Overview

The Claude Code plugin validator enforces structural and semantic constraints on plugin manifests and content files. Many constraints are undocumented in the official Claude Code release notes. This reference documents observed validator behavior, gotchas, and patterns that Lamella contributors and downstream plugin authors should expect.

---

## File Path Requirements

### The Critical Constraint: Explicit File Paths Only

The Claude Code plugin validator **only accepts explicit file paths** in manifest fields that reference source files. Directory paths are **silently rejected** with no error message in most cases.

**Bad:**
```json
{
  "resources": ["skills/"]
}
```

**Why it fails:** The validator recognizes this as a directory path and silently skips it or produces confusing downstream errors. No validation error is raised at manifest validation time; instead, files that should have been included are missing at runtime.

**Good:**
```json
{
  "resources": [
    "skills/debugging.md",
    "skills/architecture.md",
    "skills/performance.md"
  ]
}
```

### Where This Applies

File path constraints appear in these manifest fields:

- `resources` — skill, command, rule, and hook definitions
- `files` — static assets and support files
- `templates` — plugin template files
- Any field referencing source or data files

### Workaround

If a manifest field needs to reference multiple files from a directory:

1. List each file explicitly by name
2. Use a build-time script or tool to generate the full list before validation
3. Treat the manifest as output from a generator, not as a hand-authored source

### Known Issue

Directory paths in `resources` do not produce an error; they silently fail to include the intended files. The plugin will build and install, but resources that were supposed to be packed will be missing. This often manifests as 404s or "not found" errors when the plugin tries to load content at runtime.

---

## Hooks Field Behavior

### The Hooks Flip-Flop

The `hooks` field in Claude Code plugin manifests has changed behavior across releases:

| Claude Code Release | Behavior | Recommendation |
|---|---|---|
| v0.8.x and earlier | `hooks` field optional; no errors if omitted | Omit for compatibility |
| v0.9.x | `hooks` field causes duplicate hook registration errors when present; hooks from manifest are ignored | Omit `hooks` field entirely |
| v0.10.x | `hooks` field can be present but should reference hook files explicitly | Include if explicitly referenced hook files exist |
| v0.11+ | (Not yet observed; tentative) | Unknown; test before deploying |

### Current Safe Pattern (v0.10.x)

For maximum compatibility with current Claude Code versions:

1. **Define hooks in resource files**, not in the manifest `hooks` field
2. **Do not use a manifest `hooks` field** unless your build tooling explicitly manages hook file references
3. **Document hooks in the skill or command file itself** using hook comments or frontmatter

**Safe Example:**
```yaml
---
name: my-skill
type: skill
---

<!-- Hook registration in the skill body, not in manifest -->

## Hooks Used

This skill may register the following hooks:

- `PreToolUse` — validates tool calls before execution
- `PostToolUse` — logs tool call results

---

[Rest of skill content]
```

**Unsafe Example (v0.9.x and v0.10.x):**
```json
{
  "hooks": [
    "hooks/pre-tool-validation.json",
    "hooks/post-tool-logging.json"
  ]
}
```

### When Hooks Fail

If hook registration fails with duplicate or missing errors:

1. Check the manifest — does it have a `hooks` field?
2. Remove the `hooks` field from the manifest
3. Rebuild and re-validate
4. If hooks still do not load, verify that hook files are in the resource list with explicit paths (not directory paths)

### Future Directions

Hook registration is in active development in Claude Code. Do not rely on the current behavior beyond one or two releases. Test hooks thoroughly before shipping a plugin update.

---

## Frontmatter Formats

### Known-Working Formats

The plugin validator recognizes these frontmatter formats without error:

**YAML (Recommended)**
```markdown
---
name: my-skill
type: skill
---

## Content

Rest of the file.
```

**YAML with Quoted Strings**
```markdown
---
name: "my-skill"
type: "skill"
---

Content follows.
```

### Silently Ignored Formats

These frontmatter formats parse without error but are **silently ignored** by the validator:

**JSON Frontmatter**
```markdown
---json
{
  "name": "my-skill",
  "type": "skill"
}
---
```

**Bare TOML**
```markdown
---
name = "my-skill"
type = "skill"
---
```

**Inline YAML Without Delimiters**
```markdown
name: my-skill
type: skill

# Content
```

### Recommendation

Always use YAML with triple-dash delimiters:

```markdown
---
<yaml content>
---
```

If a file does not have frontmatter, the validator treats the entire file as content with no metadata.

### Why This Matters

If you author frontmatter in a non-standard format, the validator will not raise an error, but the metadata will not be extracted. This often shows up as "unknown type" or "missing description" errors downstream when the plugin tries to register the resource.

---

## Other Silent Failures

### Empty Resource Files

A resource file that is present but empty will pass validation but produce confusing runtime errors when the plugin tries to load or interpret it.

**Validation passes silently:**
```markdown
---
name: empty-skill
type: skill
---
```

(rest of file is blank)

**Runtime error:** "Skill content is empty" or similar.

### Unresolved Cross-References

If a skill or command references another skill or resource by name or path that does not exist, validation may pass if the reference is in documentation. The error only surfaces at runtime when the plugin tries to resolve the reference.

**Example:**
```markdown
---
name: my-skill
type: skill
---

## Related Skills

See [nonexistent-skill](nonexistent-skill.md) for similar patterns.

This reference is in prose, not in a manifest, so validation passes.
```

**Runtime error:** "Referenced resource not found."

### Tool Name Mismatches

If a skill or command references a tool name (e.g., `Read`, `Bash`, `Write`) that does not match the actual tool registry in the target environment, validation passes but the tool call fails at runtime.

---

## Known-Good Examples

### Minimal Plugin Manifest (Known Good)

The smallest valid plugin manifest that passes validator checks:

```json
{
  "name": "minimal-plugin",
  "version": "1.0.0",
  "resources": []
}
```

**Why it works:**
- Required fields present (`name`, `version`)
- `resources` is an empty array (valid, though not useful)
- No optional fields that might trigger flip-flop behavior (no `hooks`)

### Minimal Plugin with One Resource (Known Good)

```json
{
  "name": "core-skills",
  "version": "1.0.0",
  "description": "Essential development skills",
  "resources": [
    "skills/debugging.md"
  ]
}
```

**Why it works:**
- File path is explicit (not a directory)
- Frontmatter in the skill file uses YAML with triple-dash delimiters
- No `hooks` field in the manifest
- All referenced files exist

### Skill File with Proper Frontmatter (Known Good)

```markdown
---
name: debugging-workflow
type: skill
description: |
  Structured debugging workflow for systematic issue resolution.
keywords:
  - debugging
  - troubleshooting
  - root-cause-analysis
---

## Debugging Workflow

### When to Use

Use this workflow when...

### How It Works

1. Reproduce the problem
2. Read the full error
3. [Rest of workflow]
```

**Why it works:**
- YAML frontmatter with triple-dash delimiters
- Required fields (`name`, `type`)
- Optional fields (description, keywords) use standard YAML syntax
- Content section follows properly

---

## Known-Bad Examples

### Directory Path in Resources (Known Bad)

```json
{
  "name": "bad-plugin",
  "version": "1.0.0",
  "resources": [
    "skills/",
    "commands/"
  ]
}
```

**Why it fails:**
- Validation will pass (directory paths do not raise errors)
- At runtime, no files are included from those directories
- Plugin installs but is missing its content

**Fix:**
```json
{
  "name": "good-plugin",
  "version": "1.0.0",
  "resources": [
    "skills/debugging.md",
    "skills/architecture.md",
    "commands/run-tests.md",
    "commands/lint.md"
  ]
}
```

### Hooks Field in Manifest (v0.9.x/v0.10.x) (Known Bad)

```json
{
  "name": "bad-hooks-plugin",
  "version": "1.0.0",
  "hooks": [
    "hooks/pre-tool-validation.json"
  ]
}
```

**Why it fails:**
- Validation passes
- Plugin installation produces duplicate hook errors or hooks are silently ignored
- Hook behavior is unpredictable across Claude Code versions

**Fix:**
Remove the `hooks` field entirely. Define hook metadata in resource files if needed.

### Non-YAML Frontmatter (Known Bad)

```markdown
---json
{
  "name": "bad-frontmatter",
  "type": "skill"
}
---

Skill content here.
```

**Why it fails:**
- Validation passes (no error is raised)
- Metadata is silently dropped
- Skill registers with missing or default name and type

**Fix:**
```markdown
---
name: good-frontmatter
type: skill
---

Skill content here.
```

### Empty Resource File (Known Bad)

```markdown
---
name: empty-skill
type: skill
---
```

(file ends here; no content)

**Why it fails:**
- Validation passes
- Plugin installs but skill is empty
- Runtime error when plugin tries to use the skill

**Fix:**
Ensure every resource file has meaningful content below the frontmatter.

### Unresolved Cross-Reference (Known Bad)

```markdown
---
name: my-skill
type: skill
---

## See Also

For the complete checklist, see [verification-checklist](../resources/verification.md).
```

(where `../resources/verification.md` does not exist)

**Why it fails:**
- Validation passes (reference is in prose, not manifest)
- Plugin installs but reference is broken
- Runtime error or missing link at plugin load time

**Fix:**
Verify all cross-references point to existing files relative to the plugin root. Test plugin installation locally before shipping.

---

## Known Open Questions

1. **Hook behavior in v0.11.x and later**: Claude Code is actively developing hook registration. Current constraints may change with new releases. Test thoroughly before upgrading.

2. **Frontmatter in content files vs resource metadata**: It is unclear whether frontmatter in resource files is always processed or only when the resource is a skill or command. Test with your resource types before assuming metadata extraction.

3. **Resource file size limits**: No documented limit on file size. Very large files (>10MB) may have timeout or parsing issues, but no constraint has been observed.

4. **Nested directory paths**: Can a plugin resource reference a file in a deeply nested directory (e.g., `skills/advanced/debugging/workflow.md`)? Current tests suggest yes, but cross-version behavior is unknown.

5. **Unicode and special characters in file paths**: File paths with special characters, Unicode, or spaces have not been tested extensively. Assume POSIX-safe ASCII filenames are safest.

---

## Testing Your Plugin

Before shipping a plugin, manually verify:

1. **Explicit file paths**: run `grep -r "^  *\"[^\"]*/$" manifests/` to check for directory paths
2. **No hooks field**: ensure no `hooks` key exists in the manifest JSON
3. **Valid YAML frontmatter**: check that all resource files use `---` delimiters
4. **Referenced files exist**: verify all paths in `resources` point to actual files
5. **Run `make validate`**: catch structural issues before installation
6. **Test locally**: install the plugin in a test Claude instance and verify all content loads

---

## See Also

- [Plugin Manifest Schema](../reference/claude/manifest-schema.md) — official Claude Code plugin manifest structure
- [Skill Authoring Convention](skill-authoring-convention.md) — Lamella's structured skill format
- [Authoring Best Practices](authoring/best-practices.md) — general content authoring guidance
