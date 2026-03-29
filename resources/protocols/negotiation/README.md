# Negotiation Protocol

Shared response format and evaluation rubrics for agents operating in **negotiation mode** — a pattern where an orchestrator dispatches multiple agents and synthesizes their results.

## Contents

| File | Purpose | Used By |
|------|---------|---------|
| `confidence-rubric.md` | Standardized confidence levels (HIGH/MEDIUM/LOW/UNCERTAIN) for agent responses | Rust research agents |
| `response-format.md` | Required response structure when `negotiation: true` is set | Rust research agents |

## How It Works

1. An orchestrator sends a query to multiple research agents with `negotiation: true`
2. Each agent includes its findings using the `response-format.md` structure
3. Each agent self-assesses confidence using `confidence-rubric.md` criteria
4. The orchestrator compares responses, resolves conflicts, and produces a final answer

These files are **not standalone agents** — they provide reusable protocol definitions referenced by agents via `Read` tool calls.
