---
name: orchestration-boundaries
description: "Pre-dispatch checklist for orchestrators: what to keep in the parent session and what is safe to delegate to subagents."
type: reference
origin: lamella
---

# Orchestration Boundaries

Use this skill before dispatching any subagent. Run the five-question checklist. If any answer is "yes, but...", keep that part in the parent session.

## What Stays in the Parent Session

| Capability | Why |
|---|---|
| `mcp__hyphae__*`, `mcp__rhizome__*` | MCP servers are per-session; subagents start fresh with no inherited connections |
| Architecture decisions, scope changes, plan rewrites | Decisions belong with the orchestrator |
| Synthesizing results from multiple subagents | Cross-agent coordination requires the full picture |
| `git push`, PR creation, branch management | Requires persistent auth context |
| Handoff and dashboard updates | Orchestrator owns the record of work |

Use the **CLI equivalents** when a subagent genuinely needs hyphae or rhizome:
- `hyphae store`, `hyphae search`, `hyphae recall` — available in any shell
- `rhizome` CLI commands — available in any shell

## What Is Safe to Delegate

- Bounded file/code changes with an explicit file list and owning repo
- Build and test execution (`cargo test`, `npm test`) — uses local toolchains, not MCP
- Read-only research in a specified directory tree
- Code review of a concrete diff — reviewers only need `Read` and `Grep`
- hyphae/rhizome operations via CLI (not MCP tools)

## Pre-Dispatch Checklist

Before writing a subagent prompt, answer each question:

1. **Does this work require an MCP tool?**
   → Yes: keep it in the parent, or switch to the CLI equivalent.

2. **Does this work touch more than one repo?**
   → Yes: split into two agents with disjoint write scopes.

3. **Am I delegating a decision or a bounded implementation?**
   → Decision: keep it in the parent. Implementations only.

4. **Will the subagent need prior conversation context to do the work?**
   → Yes: include the relevant context explicitly in the prompt; don't assume it carries over.

5. **Does this work require `git push`, PR creation, or branch management?**
   → Yes: keep it in the parent.

## When a Delegation Goes Wrong

If a subagent reports a tool missing, returns meta-status instead of a diff, or produces off-scope changes:

1. Close the subagent immediately — do not retry the same delegation.
2. Do the work in the parent session using the correct tool.
3. If it was an MCP tool, switch to the CLI equivalent and document why.

## Naming Convention for Strict Workflows

```
<role>/<repo>/<handoff-slug>/<run>
```

Examples: `impl/spore/otel-foundation/1`, `audit/canopy/sprint-contract/1`
