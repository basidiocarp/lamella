---
name: gateguard
description: "Three-stage investigation gate (DENY → INVESTIGATE → ALLOW) enforced before any Edit, Write, MultiEdit, or destructive Bash operation. Forces models to gather specific facts before proceeding."
origin: "Everything-Claude-Code ecosystem audit (ECC, 2026-04-23)"
metadata:
  author: "basidiocarp"
  version: "1.0"
---

# GateGuard Deliberation Skill

Use this skill when you need to enforce a deliberate investigation phase before making destructive changes. GateGuard is a three-stage workflow: first an operation is blocked outright; then you are forced to gather specific facts; only after those facts are presented does the operation proceed.

## When to Activate

GateGuard is built into cortina's PreToolUse hook and activates automatically for:

- **Edit or MultiEdit on existing code files** — requires you to name callers, public APIs, and schema changes
- **Write (new file creation)** — requires you to confirm the caller and interface contract
- **Destructive Bash operations** (`rm -rf`, `git reset --hard`, `DROP TABLE`, `git push --force`, `dd`, `mkfs`) — requires you to list targets and state a rollback plan
- **Routine Bash commands** — requires you to confirm purpose in one sentence

Read-only git operations (`git log`, `git diff`, `git status`, `git show`, `git branch`, `git remote -v`) bypass the gate entirely.

## Why It Works

GateGuard's effectiveness is empirical. Two independent A/B tests showed +2.25 points average quality improvement (9.0 vs 6.75/10 on a 10-point scale) when the investigation gate was enforced versus relying on self-evaluation alone. The key insight: forcing investigation is qualitatively different from advising it. Models that ignore advisory nudges will not ignore a blocking gate.

## How It Works

### Phase 1: Gate Triggers (Automatic)

When you attempt an Edit, Write, MultiEdit, or destructive Bash operation, cortina blocks the call immediately and returns a fact template. The template is specific to the operation type.

### Phase 2: Investigation (Your Work)

Read the template. It names 2–4 specific facts you must gather before retrying:

**For Edit / MultiEdit:**
1. Run Grep to find every file that imports or calls the target.
2. List every public API that would change.
3. Confirm the data schema before and after.
4. Quote the verbatim user instruction authorizing the edit.

**For Write:**
1. Run Glob to confirm the path does not already exist.
2. Identify the existing code that will import or invoke this new file.
3. Confirm the schema or interface contract.

**For Destructive Bash:**
1. List the complete targets affected (files, rows, branches, etc.).
2. State the rollback procedure if the command goes wrong.

**For Routine Bash:**
1. Confirm the purpose in one sentence.

### Phase 3: Retry with Facts (Automatic)

Present your investigation findings in your next message (add them to the context, quote them, or summarize them). When you retry the same operation with investigation content present in the context, cortina's gate allows the operation to proceed. The gate entry is cached for 30 minutes, so repeated calls within that window do not re-trigger.

Destructive operations reset the gate every time (no TTL bypass) — you must re-state facts for each attempt.

## Key Design Principles

- **Blocking, not advisory.** GateGuard does not suggest or nudge; it blocks and waits for facts.
- **Fact-driven, not self-evaluation.** The gate forces action (Grep, Glob, Read, schema checks) rather than relying on model self-reflection.
- **Tool-specific templates.** Each operation type has a tailored template that names the most valuable facts to gather.
- **No persistence across restarts.** Gate state is in-process only (per session). Cortina restarts reset all gate entries.
- **TTL and destructive override.** File operations have a 30-minute TTL; destructive commands bypass the TTL and gate every time.

## Workflow Example

```
1. You attempt: Edit /tmp/src/auth.rs
   → cortina blocks and returns the Edit template

2. You read the template and run:
   - Grep to find callers
   - Read to examine the public API
   - Review the schema

3. You present your findings and retry: Edit /tmp/src/auth.rs
   → cortina checks: do I see investigation keywords in the context?
   → yes → gate allows
   → no → gate blocks again with the template

4. Within 30 minutes, another Edit to the same file
   → gate is already allowed (cached)
   → operation proceeds without re-investigating
```

## Common Patterns

### Handling a Large Edit

If the edit is truly complex and requires multiple sub-facts, present them in phases:

- First retry: "I found X callers (grep results). The public API changes are Y (read results). The schema change is Z (compare before/after)."
- Gate allows.
- You continue with any follow-up edits within the TTL.

### When the Gate Blocks a Second Time

If you retry without the facts, the gate re-blocks with the same template. Read the template again and ensure you have gathered all 3–4 required facts before retrying.

### Destructive Operations

For `rm -rf`, `git reset --hard`, `DROP TABLE`, etc.:

1. First attempt blocked.
2. You state: "Targets: files `/tmp/data/*`. Rollback: `git checkout HEAD` then `rsync -a backup/ /tmp/data/`."
3. Retry the command.
4. Gate allows.
5. Next attempt to the same destructive operation: gate blocks again (no TTL bypass).

## Troubleshooting

**Q: The gate blocks my retry even though I provided facts.**
A: The gate uses simple keyword heuristics to detect investigation content. If your response lacks keywords like "grep," "glob," "import," "schema," "api," "targets," or "rollback," the gate may not detect it. Retry with those words or concepts explicitly named.

**Q: Routine Bash commands keep gating every time.**
A: Routine commands gate once per session (30-minute TTL). If you're seeing repeated blocks, your session may have restarted or the TTL expired. State the purpose and retry; after the first gate-pass, the command is allowed for 30 minutes.

**Q: Read, Glob, and Grep operations skip the gate.**
A: Yes, intentionally. Only Edit, Write, MultiEdit, and Bash trigger the gate. Discovery and read-only operations do not block.

## See Also

- [pre_tool_use documentation](#) — how cortina's PreToolUse hook system works
- [Destructive bash patterns](#) — list of command patterns that always re-gate
- [Investigation keywords](#) — which terms the gate recognizes in detection

