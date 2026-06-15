---
name: security-research
description: "Run this when you need a structured multi-role security audit that produces confirmed, exploitable findings — each with a CWE identifier, CVSS 3.1 base score, and a minimal reproducible PoC."
origin: lamella
type: pipeline
---

## When to Use

- Performing a security audit of a codebase, API surface, or system configuration that must produce actionable, severity-rated findings
- When you need findings that have survived independent falsification — not just hunted hypotheses
- When stakeholders need CVSS 3.1 base scores and CWE identifiers attached to every confirmed vulnerability before scheduling remediation work
- When you want PoC-backed evidence rather than theoretical observations

Do NOT use this skill as a substitute for the `security-audit-methodology` skill's deep context-building phase. Run that first when you need line-by-line code comprehension before starting the hunt.

## How It Works

### Phase 1 — Reconnaissance Hunt

A reconnaissance hunter scans the attack surface:

1. Enumerate all external entry points: HTTP routes, RPC endpoints, file parsers, CLI flags, environment variables, IPC sockets, and deserialization surfaces.
2. Map authentication and authorization boundaries. Note every place a trust decision is made and every caller that can reach it without authentication.
3. Identify data flows that carry attacker-controlled input from an entry point through to a sensitive sink (file writes, shell execution, SQL, memory allocation, cryptographic operations, outbound network calls).
4. Note dependency inventory: record third-party libraries and their versions. Flag anything with a known CVE or with a last-release date older than 24 months.
5. Produce a ranked surface list — highest-exposure entries first — that feeds Phase 2 and Phase 3.

### Phase 2 — Code-Path Hunt

A code-path hunter traces data flow along the surface list from Phase 1:

1. Follow each high-priority entry point into the codebase. Trace the data flow forward until it reaches a sink or is sanitized.
2. Identify every sanitization or validation step and determine whether it is bypassable (type confusion, encoding tricks, off-by-one, null byte injection, race condition).
3. Map indirect flows: data stored to a database or cache in one request and read in another, background job inputs, event payloads, and deserialized objects.
4. Note any code paths that skip authorization checks due to ordering, flag values, or error-handling shortcuts.
5. Record each candidate finding as a precise claim: entry point → code path → sink → hypothesized impact. No vague "could be vulnerable" language — state the exact mechanism.

### Phase 3 — Configuration Hunt

A configuration hunter checks trust boundaries and defaults:

1. Audit default configuration values: credentials, API keys, encryption keys, TLS settings, CORS origins, rate limits, and sandbox flags. Flag anything that ships insecure by default.
2. Check privilege configuration: service accounts, IAM roles, container capabilities, file permissions, and network policies. Identify any over-privileged surface.
3. Examine environment variable handling: document every variable that influences security behavior. Flag variables that accept untrusted values without validation.
4. Review build-time and deploy-time configuration: Dockerfile instructions, CI/CD environment exposure, secret injection patterns, and secrets-in-source risks.
5. Produce a candidate finding list in the same precise claim format as Phase 2.

### Phase 4 — Falsification Gate (mandatory, non-skippable)

**This phase is the quality gate. It runs independently for every hunter before any finding advances to PoC.**

Each hunter must independently attempt to DISPROVE their own findings before passing them forward. This is not optional and cannot be compressed into the PoC phase.

For each candidate finding, the originating hunter must:

1. **State the falsification question**: What evidence, if present, would prove this finding is not exploitable? (e.g., "If the sanitizer runs before the branch that reaches the sink, the finding is invalid.")
2. **Search for that evidence**: Read the sanitizer, trace the execution order, check the relevant tests, inspect the surrounding logic.
3. **Apply a counterfactual**: Attempt to construct a code path, configuration state, or input that would block exploitation. Document whether it succeeded.
4. **Verdict**: Each finding receives one of:
   - `CONFIRMED` — falsification attempt failed; the finding survives
   - `REFUTED` — falsification succeeded; the finding is discarded with the reason recorded
   - `INCONCLUSIVE` — insufficient evidence to confirm or refute; escalate to manual review

Only `CONFIRMED` findings advance to Phase 5. `REFUTED` findings are dropped. `INCONCLUSIVE` findings are noted in the final report as informational only: they carry **no CWE identifier and no CVSS 3.1 score** (those attach exclusively to `CONFIRMED`, PoC-backed findings) and do not receive PoC treatment.

The falsification gate exists because hunters are under implicit pressure to find things. Without an explicit disproof attempt, confirmation bias inflates false-positive rates and burns PoC-engineer time on phantom vulnerabilities.

### Phase 5 — PoC Engineering

A PoC engineer writes a minimal reproducible exploit for each `CONFIRMED` finding from Phase 4:

1. **Write the PoC**: Produce the smallest possible reproducer — a curl command, a crafted input file, a script, or a code snippet — that demonstrates the vulnerability in a controlled environment. The PoC must be self-contained and runnable without deep knowledge of the system.
2. **Verify the PoC runs**: Execute it (or reason through execution step by step if live execution is not available) and confirm the expected impact is achieved.
3. **Attach CWE identifier**: Every confirmed finding must carry a CWE identifier (e.g., CWE-89, CWE-79, CWE-502). If no single CWE fits, use the most specific ancestor. A finding without a CWE is automatically demoted to informational.
4. **Compute CVSS 3.1 base score**: Assign all eight base metrics (AV, AC, PR, UI, S, C, I, A). State each metric value explicitly before computing the score. A finding without a CVSS 3.1 base score is automatically demoted to informational.
5. **Assign severity tier**: Critical (9.0–10.0), High (7.0–8.9), Medium (4.0–6.9), Low (0.1–3.9), Informational (0.0 or demoted).
6. **Write the finding record** in the format below.

#### Finding Record Format

```
## [Severity] [CWE-NNN] <Short Title>

**CVSS 3.1**: <score> (<vector string, e.g., AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H>)
**CWE**: CWE-NNN — <CWE name>
**Component**: <file or module path>
**Entry point**: <function or endpoint name>
**Sink**: <function or resource type>

### Impact
<One sentence: what an attacker achieves on successful exploitation.>

### Reproduction
<Numbered steps to reproduce. Start from a clean or authenticated state. Include the PoC artifact inline.>

```
<PoC code, command, or payload>
```

### Root Cause
<What code-level or configuration-level condition makes this exploitable. Reference the specific line, function, or config key.>

### Remediation
<Specific fix: the function to change, the validation to add, or the default to harden. Include a before/after snippet if the fix is non-obvious.>
```

## Rationalizations to Reject

These are reasoning shortcuts that produce false confidence. Reject them explicitly at each phase.

| Rationalization | Why It Is Wrong | Required Action |
|-----------------|-----------------|-----------------|
| "The input is validated upstream so this path is safe" | Validation can be bypassed or applied inconsistently across code paths | Trace the exact code path from this entry point; do not assume upstream validation applies |
| "This is only reachable by authenticated users" | Authentication is a trust boundary, not a security guarantee; authenticated users can be attackers too | Assess exploitability from the perspective of a legitimately authenticated but malicious actor |
| "The PoC would be too complex to build" | Complexity is not a security control | Attempt the falsification gate first; if the finding survives, build the simplest possible PoC |
| "CVSS is too low to matter" | CVSS base score is context-independent; environmental and temporal scoring may raise it | Report the base score honestly; let the consumer apply environmental factors |
| "We can assign the CWE later" | Deferring CWE assignment lets unclassified findings escape remediation prioritization | Every confirmed finding gets a CWE before the report is closed |
| "This configuration is unlikely to be deployed in the insecure default" | Defaults are what ships; likelihood is not a substitute for evidence | Document the insecure default and the condition required to trigger it |
| "The falsification step is just extra work since I already know it's real" | Hunter confidence does not substitute for a structured disproof attempt | Execute the falsification gate regardless of confidence level |
| "The finding is informational, so no PoC needed" | Informational findings still need a reason for demotion; vague informational status hides refuted findings | Record the falsification result or missing CWE/CVSS that caused demotion |

## Operating Contract

**Loop invariants**: Phase 4 (falsification) runs for every candidate finding from every hunter. No finding advances to Phase 5 without a recorded falsification verdict. No finding in the final report has a severity above Informational without both a CWE and a CVSS 3.1 base score.

**Crash triage**: If a hunter cannot determine whether a finding is `CONFIRMED` or `REFUTED` (code is obfuscated, dependency is closed-source, infrastructure is inaccessible), mark it `INCONCLUSIVE`, describe what evidence is missing, and continue. Do not block the pipeline on a single inconclusive finding.

**Timeout policy**: If any single phase has not produced output after exhausting the available code surface, write a partial summary of what was examined and what remains, then advance. Partial output with documented gaps is better than a stalled pipeline.

**NEVER STOP**: The pipeline must produce a final report even when some findings are inconclusive, some PoCs cannot be verified in-environment, or the attack surface is larger than can be fully covered. Scope the report clearly and note what was out of scope.

## Gotchas

- Running this skill without the `security-audit-methodology` context-building phase risks missing buried data flows that only surface after deep function-by-function analysis. For high-assurance audits, run `security-audit-methodology` first.
- CVSS 3.1 base scores are context-independent. A base score of 4.0 in a critical production environment may be treated as Critical by the consumer after environmental scoring. Report base scores; do not pre-adjust.
- The falsification gate is the most commonly skipped phase in informal audits. Skipping it produces false-positive findings that erode trust in the report.
- Canopy task dispatch: when coordinating multi-role work across agents, dispatch each role with `canopy task create` and role context. Do NOT use `team_*` or any other dispatch API — they are not available in this workspace and will fail.

## Handoff Pointers

- Related: `security-audit-methodology` — deep context building before the hunt
- Related: `stride-analysis-patterns` — threat modeling to scope the attack surface for Phase 1
- Related: `security-review` — lighter-weight checklist review when a full five-role pipeline is not warranted
