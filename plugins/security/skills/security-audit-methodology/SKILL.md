---
name: security-audit-methodology
description: "Guides end-to-end security audits, scoping, and deep code review."
origin: lamella
---

# Security Audit Methodology

End-to-end framework for security audits: from practical preparation to deep code comprehension.

## Contents

- [When to Use](#when-to-use)
- [Phase 1 — Audit Preparation](#phase-1--audit-preparation)
  - [Step 1: Set Review Goals](#step-1-set-review-goals)
  - [Step 2: Resolve Easy Issues](#step-2-resolve-easy-issues)
  - [Step 3: Ensure Code Accessibility](#step-3-ensure-code-accessibility)
  - [Step 4: Generate Documentation](#step-4-generate-documentation)
  - [Prep Timeline](#prep-timeline)
  - [Prep Checklist](#prep-checklist)
- [Phase 2 — Deep Context Building](#phase-2--deep-context-building)
  - [Initial Orientation](#initial-orientation)
  - [Ultra-Granular Function Analysis](#ultra-granular-function-analysis)
  - [Cross-Function & External Flow Analysis](#cross-function--external-flow-analysis)
  - [Output Requirements](#output-requirements)
  - [Completeness Checklist](#completeness-checklist)
- [Phase 3 — Global System Understanding](#phase-3--global-system-understanding)
- [Stability & Consistency Rules](#stability--consistency-rules)
- [Rationalizations (Do Not Skip)](#rationalizations-do-not-skip)
- [Subagent Usage](#subagent-usage)
- [Non-Goals](#non-goals)
- [References](#references)

---

## When to Use

- **Audit Preparation**: 1–2 weeks before a security review — run static analysis, increase coverage, generate docs
- **Deep Context Building**: When bottom-up code comprehension is needed before vulnerability discovery
- **Full Audit Lifecycle**: Combine both phases for complete audit methodology

Do **not** use for vulnerability findings, fix recommendations, exploit reasoning, or severity rating — those belong to separate phases.

---

## Phase 1 — Audit Preparation

Practical steps to prepare a codebase for security review, based on Trail of Bits' checklist.

### Step 1: Set Review Goals

Define what you want from the review:

- What's the overall security level you're aiming for?
- What areas concern you most (previous audit issues, complex components, fragile parts)?
- What's the worst-case scenario for your project?

Document goals to share with the assessment team.

### Step 2: Resolve Easy Issues

**Run Static Analysis** (platform-appropriate):

```bash
# Solidity
slither . --exclude-dependencies

# Rust
dylint --all

# Go
golangci-lint run

# General (CodeQL, Semgrep)
```

Then:
- Triage all findings and help fix easy issues
- Document accepted risks
- Analyze current test coverage, identify untested code, and suggest new tests
- Find and remove dead code (unused functions, variables, libraries, stale features)

**Goal**: Clean static analysis report, high test coverage, minimal dead code.

### Step 3: Ensure Code Accessibility

- **File list**: All files in scope, out-of-scope files marked, folder structure explained
- **Build instructions**: Step-by-step setup guide tested on a fresh environment, all dependencies and versions documented
- **Freeze stable version**: Identify commit hash, create dedicated branch, tag release, lock dependencies
- **Identify boilerplate**: Mark copied/forked code, highlight modifications, document third-party code

### Step 4: Generate Documentation

| Artifact | Contents |
|----------|----------|
| Flowcharts & Sequence Diagrams | Primary workflows, component relationships, data flow, critical paths |
| User Stories | User roles, use cases, interactions, expectations |
| Assumptions | Data validation, oracle info, bridge assumptions, trust boundaries |
| Actors & Privileges | All actors, roles, privileges, access controls |
| Function Documentation | Invariants, parameter ranges, arithmetic formulas, complex logic, NatSpec |
| Glossary | Domain terms, acronyms, business logic concepts |

### Prep Timeline

| When | Actions |
|------|---------|
| 2 weeks before | Set review goals, run static analysis, start fixing issues |
| 1 week before | Increase test coverage, remove dead code, freeze version, start documentation |
| Few days before | Complete documentation, verify build instructions, create final checklist, send package |

### Prep Checklist

- [ ] Review goals documented
- [ ] Static analysis clean/triaged
- [ ] Test coverage >80%
- [ ] Dead code removed
- [ ] Build instructions verified
- [ ] Stable version frozen
- [ ] Flowcharts created
- [ ] User stories documented
- [ ] Assumptions documented
- [ ] Actors/privileges listed
- [ ] Function docs complete
- [ ] Glossary created

---

## Phase 2 — Deep Context Building

Ultra-granular, line-by-line code analysis to build deep architectural context **before** vulnerability hunting.

When active, Claude will:
- Perform line-by-line / block-by-block code analysis by default
- Apply First Principles, 5 Whys, and 5 Hows at micro scale
- Continuously link insights → functions → modules → entire system
- Maintain a stable, explicit mental model that evolves with new evidence

### Initial Orientation

Before deep analysis, perform a minimal mapping:

1. Identify major modules/files/contracts
2. Note obvious public/external entrypoints
3. Identify likely actors (users, owners, relayers, oracles, other contracts)
4. Identify important storage variables, dicts, state structs, or cells
5. Build a preliminary structure without assuming behavior

### Ultra-Granular Function Analysis

Every non-trivial function receives full micro-analysis:

**Per-Function Checklist:**

1. **Purpose** — Why the function exists and its role in the system
2. **Inputs & Assumptions** — Parameters, implicit inputs (state, sender, env), preconditions, constraints
3. **Outputs & Effects** — Return values, state/storage writes, events/messages, external interactions
4. **Block-by-Block Analysis** — For each logical block:
   - What it does
   - Why it appears here (ordering logic)
   - What assumptions it relies on
   - What invariants it establishes or maintains
   - What later logic depends on it
   - Apply: First Principles, 5 Whys, 5 Hows

### Cross-Function & External Flow Analysis

**Internal Calls**: Jump into the callee immediately. Perform block-by-block analysis. Track data flow, assumptions, and invariants: caller → callee → return → caller.

**External Call — Code Available**: Treat as internal call. Jump into target, continue micro-analysis, propagate invariants seamlessly.

**External Call — Black Box**: Analyze as adversarial:
- Describe payload/parameters sent
- Identify assumptions about the target
- Consider all outcomes: revert, incorrect returns, unexpected state changes, reentrancy

**Continuity Rule**: Treat the entire call chain as one continuous execution flow. Never reset context. All invariants and data dependencies must propagate across calls.

### Output Requirements

See [resources/OUTPUT_REQUIREMENTS.md](resources/OUTPUT_REQUIREMENTS.md) for the full structured format.

Quality thresholds per function:
- Minimum 3 invariants
- Minimum 5 assumptions documented
- Minimum 3 risk considerations for external interactions
- At least 1 First Principles application
- At least 3 combined 5 Whys/5 Hows applications

### Completeness Checklist

See [resources/COMPLETENESS_CHECKLIST.md](resources/COMPLETENESS_CHECKLIST.md).

Verify: structural completeness, content depth, continuity & integration, anti-hallucination (line number citations, evidence-based claims). Analysis is complete when all checklist items are satisfied.

---

## Phase 3 — Global System Understanding

After sufficient micro-analysis:

1. **State & Invariant Reconstruction** — Map reads/writes per state variable, derive multi-function/multi-module invariants
2. **Workflow Reconstruction** — End-to-end flows (deposit, withdraw, lifecycle, upgrades), state transforms, persistent assumptions
3. **Trust Boundary Mapping** — Actor → entrypoint → behavior, untrusted input paths, privilege changes
4. **Complexity & Fragility Clustering** — Functions with many assumptions, high branching, multi-step dependencies, coupled state changes

These clusters guide the vulnerability-hunting phase.

---

## Stability & Consistency Rules

- **Never reshape evidence to fit earlier assumptions.** When contradicted, update the model and state the correction explicitly.
- **Periodically anchor key facts**: invariants, state relationships, actor roles, workflows.
- **Avoid vague guesses.** Use "Unclear; need to inspect X" instead of "It probably…"
- **Cross-reference constantly.** Connect new insights to previous state, flows, and invariants.

---

## Rationalizations (Do Not Skip)

| Rationalization | Why It's Wrong | Required Action |
|-----------------|----------------|-----------------|
| "I get the gist" | Gist-level understanding misses edge cases | Line-by-line analysis required |
| "This function is simple" | Simple functions compose into complex bugs | Apply 5 Whys anyway |
| "I'll remember this invariant" | Context degrades | Write it down explicitly |
| "External call is probably fine" | External = adversarial until proven otherwise | Jump into code or model as hostile |
| "I can skip this helper" | Helpers contain assumptions that propagate | Trace the full call chain |
| "README covers setup" | READMEs assume context auditors don't have | Test build on fresh environment |
| "Static analysis already ran" | Codebase changed since last run | Execute tools, generate fresh report |
| "Test coverage looks decent" | "Looks decent" isn't measured | Run coverage tools, identify untested paths |
| "Architecture is straightforward" | Text descriptions miss visual patterns | Generate actual flowcharts and diagrams |
| "Terms are self-explanatory" | Domain knowledge isn't universal | Create comprehensive glossary |
| "This is taking too long" | Rushed context = hallucinated vulnerabilities later | Slow is fast |

---

## Subagent Usage

Spawn subagents for dense/complex functions, long data-flow chains, cryptographic logic, complex state machines, or multi-module workflow reconstruction.

Use the **`function-analyzer`** agent for per-function deep analysis. Subagents must follow the same micro-first rules and return summaries for integration into the global model.

---

## Non-Goals

While active, Claude should NOT identify vulnerabilities, propose fixes, generate PoCs, model exploits, or assign severity. This is **preparation and context building** only.

---

## References

| File | Description |
|------|-------------|
| [resources/FUNCTION_MICRO_ANALYSIS_EXAMPLE.md](resources/FUNCTION_MICRO_ANALYSIS_EXAMPLE.md) | Complete walkthrough of DEX swap function micro-analysis |
| [resources/OUTPUT_REQUIREMENTS.md](resources/OUTPUT_REQUIREMENTS.md) | Structured output format for ultra-granular analysis |
| [resources/COMPLETENESS_CHECKLIST.md](resources/COMPLETENESS_CHECKLIST.md) | Verification checklist for analysis completeness |
```
