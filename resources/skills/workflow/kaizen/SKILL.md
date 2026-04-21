---
name: kaizen
description: "Applies Kaizen continuous-improvement methods such as 5 Whys, Fishbone, PDCA, and A3 problem documentation."
origin: lamella
---

# Kaizen: Continuous Improvement

Small improvements, continuously. Error-proof by design. Follow what works. Build only what's needed.

## When to Use

- Root cause analysis of bugs, failures, or regressions
- Process improvement (CI/CD, dev workflow, code review)
- Structured problem-solving for complex issues
- Architecture and design decisions
- Code quality and refactoring decisions

## Method Selection

| Analyzing | Best Method | Command |
|-----------|-------------|---------|
| Root cause of a specific symptom | **5 Whys** | Drill from symptom to systemic cause |
| Multi-factor problem across domains | **Fishbone** | Explore People, Process, Tech, Environment, Methods, Materials |
| Iterative improvement with experiments | **PDCA** | Plan hypothesis → Do small change → Check results → Act on findings |
| Comprehensive problem documentation | **A3** | One-page analysis: background, current state, root cause, countermeasures |
| Understanding actual vs. expected | **Gemba Walk** | "Go and see" the real code/process |
| Workflow bottlenecks and delays | **Value Stream Mapping** | Map stages, measure time, find waste |
| Code/process waste identification | **Muda Analysis** | 7 wastes: overproduction, waiting, transport, over-processing, inventory, motion, defects |

## The Four Pillars

### 1. Continuous Improvement
- Make smallest viable change that improves quality
- Always leave code better than you found it
- First make it work, then make it clear, then make it efficient
- Stop when "good enough" (diminishing returns)

### 2. Poka-Yoke (Error Proofing)
- Make errors impossible through type system
- Validate at boundaries, not everywhere
- Fail fast with clear messages
- Defense layers: types → validation → guards → error boundaries

### 3. Standardized Work
- Consistency over cleverness
- Follow existing codebase patterns
- Automate standards with linters/types

### 4. Just-In-Time (JIT)
- YAGNI: implement only current requirements
- Optimize only when measured
- Abstract after 3+ similar cases (Rule of Three)

---

## 5 Whys Analysis

Iteratively ask "why" to move from surface symptoms to fundamental causes.

### Process
1. State the problem clearly
2. Ask "Why did this happen?" — document the answer
3. For that answer, ask "Why?" again
4. Continue until reaching root cause (usually 5 iterations)
5. Validate by working backwards: root cause → symptom
6. Explore branches if multiple causes emerge
7. Propose solutions addressing root causes, not symptoms

### Example
```
Problem: Users see 500 error on checkout
Why 1: Payment service throws exception
Why 2: Request timeout after 30 seconds
Why 3: Database query takes 45 seconds
Why 4: Missing index on transactions table
Why 5: Index creation wasn't in migration scripts
Root Cause: Migration review process doesn't check query performance
Solution: Add query performance checks to migration PR template
```

### Tips
- Don't stop at symptoms; keep digging for systemic issues
- If "human error" appears, keep digging: why was error possible?
- Multiple root causes are common — explore branches separately
- Root cause usually involves: missing validation, missing docs, unclear process, or missing automation

---

## Fishbone (Cause & Effect) Analysis

Systematically examine causes across six categories.

### Categories
| Category | Software Examples |
|----------|-------------------|
| **People** | Skills, training, communication |
| **Process** | Workflows, procedures, reviews |
| **Technology** | Tools, infra, dependencies, config |
| **Environment** | Deployment targets, external factors |
| **Methods** | Patterns, architectures, practices |
| **Materials** | Data, dependencies, third-party services |

### Process
1. State the problem (the "head" of the fish)
2. For each category, brainstorm potential causes
3. For each cause, ask "why" to dig deeper
4. Identify contributing vs. root causes
5. Prioritize by impact × likelihood
6. Propose solutions for highest-priority causes

---

## PDCA (Plan-Do-Check-Act)

Four-phase iterative cycle for systematic experimentation.

### Phases

**PLAN:** Define problem → analyze baseline → develop hypothesis ("If we change X, Y improves") → set measurable success criteria

**DO:** Implement change (small scale first) → document what was actually done → record deviations → collect data

**CHECK:** Measure results vs. success criteria → compare to baseline → analyze: did hypothesis hold?

**ACT:**
- If successful: standardize (update docs, automate, monitor)
- If unsuccessful: learn, refine hypothesis, start new cycle
- If partially successful: standardize what worked, plan next cycle

### Example
```
PLAN: Docker build takes 45min. Hypothesis: caching deps → <10min
DO:   Restructured Dockerfile, added .dockerignore, configured CI cache
CHECK: Cached builds = 8min ✓ (82% reduction). Changed deps = 12min.
ACT:   Merged changes, documented. New problem: 12min still slow → CYCLE 2
```

---

## A3 Problem Analysis

Structured one-page format for comprehensive problem documentation.

### Sections
1. **Background** — Why this matters (context, business impact)
2. **Current Condition** — What's happening now (data, metrics)
3. **Goal/Target** — What success looks like (specific, measurable)
4. **Root Cause Analysis** — Why problem exists (use 5 Whys or Fishbone)
5. **Countermeasures** — Solutions addressing root causes
6. **Implementation Plan** — Who, what, when, how
7. **Follow-up** — Verification metrics and review dates

---

## Gemba Walk, Value Stream Mapping, Muda

See references for detailed examples:
- [references/gemba-examples.md](references/gemba-examples.md)
- [references/vsm-examples.md](references/vsm-examples.md)
- [references/muda-examples.md](references/muda-examples.md)
- [references/examples.md](references/examples.md)

## Red Flags

| Pillar | Warning Signs |
|--------|---------------|
| Continuous Improvement | "I'll refactor it later", big bang rewrites |
| Poka-Yoke | "Users should be careful", validation after use |
| Standardized Work | "I prefer my way", ignoring conventions |
| Just-In-Time | "We might need this", optimizing without measuring |
