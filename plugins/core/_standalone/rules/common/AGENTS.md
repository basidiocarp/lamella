# Common Agent Notes

## Purpose

This file is the short operational rule set for when a task really does need multiple agents. It exists to keep delegation narrow, independent, and reviewable. The point is not to outsource judgment; it is to split clean work that can safely run in parallel.

---

## Source of Truth

- This file: the local rules for agent orchestration in this content area.
- Adjacent rule and skill files: more specific guidance for the task at hand.

When this file and a more specific local rule disagree, the more specific file wins.

---

## Before You Start

Before spawning agents, verify:

1. **Need**: the work really splits into independent parts.
2. **Scope**: each agent can own one concrete responsibility.
3. **Context**: each agent only gets the files and context it actually needs.
4. **Review**: someone will review the output before acting on it.

---

## Preferred Commands

Use these for most work:

```bash
rg "AGENTS.md|SKILL.md" lamella/resources
fd AGENTS.md lamella/resources
```

For targeted work:

```bash
rg "subagent|agent" lamella/docs lamella/resources
```

---

## Repo Architecture

This is guidance content, not executable code. Keep it short, local, and easy to route from. More specific rule files should carry the detail.

Key boundaries:

- this file: broad orchestration rules
- adjacent rule files: task-specific guidance
- repo-level AGENTS and CLAUDE files: wider operational context

Current direction:

- Keep delegation guidance narrow
- Keep context passed to agents minimal
- Keep review mandatory for higher-risk work

---

## Working Rules

- Choose the smallest capable agent.
- Give each agent one concrete responsibility.
- Keep parallel work independent; do not parallelize dependencies.
- Review agent output before acting on it.
- Prefer a second opinion for security, architecture, or other high-risk audits.

---

## Done Means

A task is not complete until:

- [ ] Agent scopes are clear and non-overlapping
- [ ] Output has been reviewed before reuse
- [ ] Any high-risk work has had an independent second look

If review was skipped, say so clearly and explain why.
