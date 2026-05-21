---
name: coordinator-delegation-discipline
type: reference
user-invocable: true
description: >
  Apply this when coordinating multi-agent work to avoid lazy delegation: synthesize
  research findings yourself before writing any worker prompt, and enforce strict phase
  ownership so workers never forward raw output to each other.
origin: lamella
---

# Coordinator Delegation Discipline

## When to Activate

Use this skill when:
- You are about to write a prompt for a worker agent after receiving research or prior output
- A worker agent is stuck or returning off-scope work and you suspect the brief was underspecified
- A worker's prompt contains "based on your findings" or similar phrases
- You are deciding whether to continue in the same agent or spawn a new one

---

## Contents

- [The Anti-Pattern Catalog](#the-anti-pattern-catalog)
- [The Synthesis Requirement](#the-synthesis-requirement)
- [Continue vs. Spawn Decision Matrix](#continue-vs-spawn-decision-matrix)
- [Phase Ownership Rules](#phase-ownership-rules)
- [Scratchpad Convention](#scratchpad-convention)
- [Why This Matters](#why-this-matters)

---

## The Anti-Pattern Catalog

These phrases in a worker prompt signal lazy delegation — the coordinator is pushing synthesis onto the worker instead of doing it first:

- "Based on your findings, implement…"
- "Based on the research, create…"
- "Using what you found, write…"
- "Take the output from the previous step and…"
- Forwarding a worker's raw output verbatim to the next worker's prompt without distillation

Any of these patterns means the coordinator has not done its job. The worker receives undistilled context and cannot make the decisions the coordinator is supposed to have already made.

---

## The Synthesis Requirement

Before writing any worker prompt, the coordinator must:

1. **Read and understand the prior output itself.** Do not forward it unread. If a research agent returned findings, read every finding before dispatching the implementer.
2. **Identify the concrete targets.** Name the specific files, functions, line numbers, data shapes, or schema fields the worker must act on. Vague scope is a coordinator failure, not a worker problem.
3. **Write the worker prompt with explicit references.** Include file paths, function names, data shapes — not "the relevant module" but "`src/foo.rs:42`, the `process_event` function."
4. **State the required output precisely.** Not "implement the feature" but "add `X` to `src/foo.rs:42` such that `cargo test integration_test_Y` passes."

The coordinator synthesizes. Workers execute against a concrete brief. Workers that receive vague prompts fail because the coordinator failed first.

---

## Continue vs. Spawn Decision Matrix

| Condition | Action |
|-----------|--------|
| Prior context is still relevant and the next step is small | Continue in the same agent |
| The next step is logically independent and the prior context would confuse it | Spawn a new agent |
| The next step requires a different capability (reviewer vs. implementer) | Spawn a typed agent |
| The prior agent already has all the state it needs | SendMessage to it |
| The prior agent is stalled or off-scope | Close it and spawn fresh |

The default is to **continue in the same agent** when context is still valid. Spawning is not cheaper — it discards context and costs a fresh load. Spawn only when independence or capability difference justifies it.

---

## Phase Ownership Rules

The coordinator owns all cross-phase transitions. Workers own only their assigned phase.

| Phase | Owner | What workers do | What coordinator does |
|-------|-------|-----------------|-----------------------|
| **Research** | Coordinator | Gather and return data; no code | Read, synthesize, decide what to implement |
| **Synthesis** | Coordinator only | Nothing — no delegation during synthesis | Identify targets, write precise briefs |
| **Implementation** | One implementer per scoped task | Write code, run tests, report diff | Check that scope matches intent; do not re-delegate |
| **Verification** | Coordinator | Nothing — coordinator checks output against original intent | Compare result against the original spec, not the worker's summary |

No phase skips. Synthesis cannot be delegated. If the coordinator has not synthesized research, it is not ready to dispatch an implementer.

---

## Scratchpad Convention

When cross-worker knowledge must persist within a session, the coordinator owns the scratchpad:

1. The coordinator writes findings to a named scratchpad directory (e.g., `.claude/state/scratchpad/<task>/`).
2. Each worker's prompt references the scratchpad path explicitly.
3. Workers do not read each other's output directly — they read what the coordinator placed in the scratchpad.
4. The coordinator updates the scratchpad after each worker completes and before dispatching the next.

This pattern prevents workers from treating each other as information sources and keeps all synthesis with the coordinator.

---

## Why This Matters

Lazy delegation produces circular loops:

1. Coordinator forwards research prompt → Research agent returns raw findings
2. Coordinator forwards findings verbatim → Implementer cannot identify what to change
3. Implementer asks for clarification → Coordinator asks research agent again
4. Loop repeats

Each iteration costs tokens. None produces a code change. The exit condition is the coordinator synthesizing the research — which should have happened before step 2.

The synthesis discipline is not a style preference. It is the failure mode check. A coordinator that cannot name the specific file and function before dispatching an implementer is not ready to dispatch.
