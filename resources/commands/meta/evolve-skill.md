---
description: "Capture a skill evolution delta after completing a skill-guided task. Diffs what the skill suggested vs what actually shipped. Triggers on 'evolve skill', 'skill delta', '/evolve-skill'."
argument-hint: "[skill-name] [commit-range]"
---

# Evolve Skill

Record the differences between a skill's guidance and what actually shipped.

## Invocation

```
/evolve-skill [skill-name] [commit-range]
```

## Arguments

- `skill-name` (optional): The name of the skill that guided this task. Defaults to session context if available.
- `commit-range` (optional): Git commit range to diff (e.g., `HEAD~1..HEAD`, `main..HEAD`). Defaults to `HEAD~1..HEAD`.

## Workflow

### 1. Resolve Active Skill

If a skill name is provided as an argument, use it. Otherwise, attempt to extract the skill name from session context. If neither is available, prompt the user for the skill name.

### 2. Validate Skill Exists

Confirm that the skill documentation exists and is accessible. If the skill cannot be located, report the error and exit.

### 3. Get Actual Changes

Run `git diff {commit-range}` to extract the changes that were actually committed.

```bash
git diff {commit-range}
```

Output: unified diff showing added, removed, and modified lines.

### 4. Extract Skill Guidance

Read the skill's SKILL.md file. Parse its step-by-step guidance, recommendations, and process sections. Build a mental model of what the skill recommends.

### 5. Compare and Classify Changes

Map each actual change against the skill's guidance:

- **Additions**: Code or decisions you made that the skill did not explicitly recommend
- **Removals**: Recommendations from the skill that you chose not to follow
- **Modifications**: Places where you followed the skill's general direction but changed the specific approach

Limit classifications to material changes. Ignore formatting, variable naming, and other stylistic choices unless they represent a deliberate deviation from the skill's approach.

### 6. Render Delta Report

Produce the delta report in this format:

```
## Skill Evolution Delta — {skill-name} — {date}

### Additions (operator added, skill did not suggest)
- ...

### Removals (operator skipped, skill suggested)
- ...

### Modifications (operator changed the skill's approach)
- Original: ...
  Actual: ...

### Notes
(free-form annotation)
```

Output this to the terminal.

### 7. Prompt for Notes

Ask the user:

```
Optional: add a note about why you deviated from the skill's guidance.
(Press Ctrl-D or EOF to finish, or leave blank to skip.)
```

Collect optional free-form annotation.

### 8. Store in Hyphae

Use the Hyphae MCP tool to store the delta report:

```
mcp__hyphae__hyphae_memory_store
  - content: complete delta report with notes
  - topic: "skill-evolution/{skill-name}"
  - importance: "medium"
  - project: {owning-repo} (e.g., "lamella")
```

Invoke the MCP tool with these parameters.

### 9. Confirm Storage

Report the result to the user:

```
✓ Delta stored in hyphae
  Skill: {skill-name}
  Topic: skill-evolution/{skill-name}
  Memory ID: {id}
```

Include the memory ID returned by Hyphae so the user can reference it later.

## Fallback

If the Hyphae CLI is not on PATH, the command still works by using the Hyphae MCP tool `mcp__hyphae__hyphae_memory_store` directly (which is always available in Claude Code). This is the recommended approach.

## Output

The command produces two outputs:

1. **Delta report** rendered to the terminal (as shown in the format above)
2. **Confirmation** of storage in Hyphae with the memory ID

## Example Usage

```bash
# Evolve a skill using the most recent commit
/evolve-skill systematic-debugging

# Evolve with a specific commit range
/evolve-skill tdd-guide main..HEAD

# Evolve from session context and default commit range
/evolve-skill
```

## Skill Reference

For more details on capturing deltas, see the `evolve-skill` skill in `resources/skills/meta/evolve-skill/SKILL.md`.
