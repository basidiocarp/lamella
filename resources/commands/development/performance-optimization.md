---
description: "Orchestrate end-to-end application performance optimization from profiling to monitoring"
argument-hint: "<application or service> [--focus latency|throughput|cost|balanced] [--depth quick-wins|comprehensive|enterprise]"
---

# Performance Optimization Orchestrator

## CRITICAL BEHAVIORAL RULES

You MUST follow these rules exactly. Violating any of them is a failure.

1. **Execute steps in order.** Do NOT skip ahead, reorder, or merge steps.
2. **Write output files.** Each step MUST produce its output file in `.performance-optimization/` before the next step begins. Read from prior step files — do NOT rely on context window memory.
3. **Stop at checkpoints.** When you reach a `PHASE CHECKPOINT`, you MUST stop and wait for explicit user approval before continuing. Use the AskUserQuestion tool with clear options.
4. **Halt on failure.** If any step fails (agent error, test failure, missing dependency), STOP immediately. Present the error and ask the user how to proceed. Do NOT silently continue.
5. **Use only local agents.** All `subagent_type` references use agents bundled with this plugin or `general-purpose`. No cross-plugin dependencies.
6. **Never enter plan mode autonomously.** Do NOT use EnterPlanMode. This command IS the plan — execute it.

## Pre-flight Checks

Before starting, perform these checks:

### 1. Check for existing session

Check if `.performance-optimization/state.json` exists:

- If it exists and `status` is `"in_progress"`: Read it, display the current step, and ask the user:

  ```
  Found an in-progress performance optimization session:
  Target: [name from state]
  Current step: [step from state]

  1. Resume from where we left off
  2. Start fresh (archives existing session)
  ```

- If it exists and `status` is `"complete"`: Ask whether to archive and start fresh.

### 2. Initialize state

Create `.performance-optimization/` directory and `state.json`:

```json
{
  "target": "$ARGUMENTS",
  "status": "in_progress",
  "focus": "balanced",
  "depth": "comprehensive",
  "current_step": 1,
  "current_phase": 1,
  "completed_steps": [],
  "files_created": [],
  "started_at": "ISO_TIMESTAMP",
  "last_updated": "ISO_TIMESTAMP"
}
```

Parse `$ARGUMENTS` for `--focus` and `--depth` flags. Use defaults if not specified.

### 3. Parse target description

Extract the target description from `$ARGUMENTS` (everything before the flags). This is referenced as `$TARGET` in prompts below.

---

## Phase 1: Performance Profiling & Baseline (Steps 1–3)

### Step 1: Comprehensive Performance Profiling

Use the Task tool to launch the performance engineer:

```
Task:
  subagent_type: "performance-engineer"
  description: "Profile application performance for $TARGET"
  prompt: |
    Profile application performance comprehensively for: $TARGET.

    Generate flame graphs for CPU usage, heap dumps for memory analysis, trace I/O operations,
    and identify hot paths. Use APM tools like DataDog or New Relic if available. Include database
    query profiling, API response times, and frontend rendering metrics. Establish performance
    baselines for all critical user journeys.

    ## Deliverables
    1. Performance profile with flame graphs and memory analysis
    2. Bottleneck identification ranked by impact
    3. Baseline metrics for critical user journeys
    4. Database query profiling results
    5. API response time measurements

    Write your complete profiling report as a single markdown document.
```

Save the agent's output to `.performance-optimization/01-profiling.md`.

Update `state.json`: set `current_step` to 2, add step 1 to `completed_steps`.

### Step 2: Observability Stack Assessment

Read `.performance-optimization/01-profiling.md` to load profiling context.

Use the Task tool:

```
Task:
  subagent_type: "observability-engineer"
  description: "Assess observability setup for $TARGET"
  prompt: |
    Assess current observability setup for: $TARGET.

    Review whether the current stack can support performance work. Cover:
    - metrics, logs, traces, and dashboard coverage
    - gaps in latency, throughput, error-rate, and resource telemetry
    - missing service-level or user-journey instrumentation
    - whether the current tooling supports regression detection

    Write your complete assessment as a single markdown document.
```

Save the agent's output to `.performance-optimization/02-observability.md`.

Update `state.json`: set `current_step` to 3, add step 2 to `completed_steps`.

### Step 3: User Experience Analysis

Read `.performance-optimization/01-profiling.md`.

Use the Task tool:

```
Task:
  subagent_type: "performance-engineer"
  description: "Analyze user experience metrics for $TARGET"
  prompt: |
    Analyze user experience metrics for: $TARGET.

    Focus on the user-visible experience:
    - Core Web Vitals or equivalent UX metrics
    - slow journeys, loading delays, or interaction stalls
    - mobile and low-bandwidth behavior if relevant
    - the specific user pain created by the current bottlenecks

    Write your complete analysis as a single markdown document.
```

Save the agent's output to `.performance-optimization/03-ux-analysis.md`.

Update `state.json`: set `current_step` to "checkpoint-1", add step 3 to `completed_steps`.

---

## PHASE CHECKPOINT 1 — User Approval Required

You MUST stop here and present the profiling results for review.

Display a summary from `.performance-optimization/01-profiling.md`, `.performance-optimization/02-observability.md`, and `.performance-optimization/03-ux-analysis.md` (key bottlenecks, observability gaps, UX findings) and ask:

```
Performance profiling complete. Please review:
- .performance-optimization/01-profiling.md
- .performance-optimization/02-observability.md
- .performance-optimization/03-ux-analysis.md

Key bottlenecks: [summary]
Observability gaps: [summary]
UX findings: [summary]

1. Approve — proceed to optimization
2. Request changes — tell me what to adjust
3. Pause — save progress and stop here
```

Do NOT proceed to Phase 2 until the user selects option 1. If they select option 2, revise and re-checkpoint. If option 3, update `state.json` status and stop.

---

## Phase 2: Database & Backend Optimization (Steps 4–6)

### Step 4: Database Performance Optimization

Read `.performance-optimization/01-profiling.md` and `.performance-optimization/03-ux-analysis.md`.

Use the Task tool:

```
Task:
  subagent_type: "general-purpose"
  description: "Optimize database performance for $TARGET"
  prompt: |
    You are a database optimization expert. Optimize database performance for: $TARGET.

    Use the profiling and UX findings. Include:
    - slow queries and indexing opportunities
    - schema or access-pattern changes
    - caching or batching options
    - migration or rollout risks
    - expected impact and validation approach

    Write your complete optimization plan as a single markdown document.
```

Save output to `.performance-optimization/04-database.md`.

Update `state.json`: set `current_step` to 5, add step 4 to `completed_steps`.

### Step 5: Backend Code & API Optimization

Read `.performance-optimization/01-profiling.md` and `.performance-optimization/04-database.md`.

Use the Task tool:

```
Task:
  subagent_type: "general-purpose"
  description: "Optimize backend services for $TARGET"
  prompt: |
    You are a backend performance architect. Optimize backend services for: $TARGET.

    Focus on:
    - CPU, memory, and I/O bottlenecks
    - request lifecycle inefficiencies
    - caching, concurrency, and queueing improvements
    - API contract or payload reductions where justified
    - rollout order and validation

    Write your complete optimization plan as a single markdown document.
```

Save output to `.performance-optimization/05-backend.md`.

Update `state.json`: set `current_step` to 6, add step 5 to `completed_steps`.

### Step 6: Microservices & Distributed System Optimization

Read `.performance-optimization/01-profiling.md` and `.performance-optimization/05-backend.md`.

Use the Task tool:

```
Task:
  subagent_type: "performance-engineer"
  description: "Optimize distributed system performance for $TARGET"
  prompt: |
    Optimize distributed system performance for: $TARGET.

    Review cross-service performance concerns:
    - network hops, fan-out, and retry storms
    - message queues, backpressure, and timeout policies
    - service-to-service bottlenecks
    - tracing or coordination gaps that obscure latency sources

    Write your complete optimization plan as a single markdown document.
```

Save output to `.performance-optimization/06-distributed.md`.

Update `state.json`: set `current_step` to "checkpoint-2", add step 6 to `completed_steps`.

---

## PHASE CHECKPOINT 2 — User Approval Required

Display a summary of optimization plans from steps 4-6 and ask:

```
Backend optimization plans complete. Please review:
- .performance-optimization/04-database.md
- .performance-optimization/05-backend.md
- .performance-optimization/06-distributed.md

1. Approve — proceed to frontend & CDN optimization
2. Request changes — tell me what to adjust
3. Pause — save progress and stop here
```

Do NOT proceed to Phase 3 until the user approves.

---

## Phase 3: Frontend & CDN Optimization (Steps 7–9)

### Step 7: Frontend Bundle & Loading Optimization

Read `.performance-optimization/03-ux-analysis.md` and `.performance-optimization/05-backend.md`.

Use the Task tool:

```
Task:
  subagent_type: "frontend-developer"
  description: "Optimize frontend performance for $TARGET"
  prompt: |
    Optimize frontend performance for: $TARGET targeting Core Web Vitals improvements.

    Focus on:
    - bundle size, code splitting, and asset loading
    - render waterfalls and hydration costs
    - image, font, and caching opportunities
    - user-journey improvements that directly affect perceived speed

    Write your complete optimization plan as a single markdown document.
```

Save output to `.performance-optimization/07-frontend.md`.

Update `state.json`: set `current_step` to 8, add step 7 to `completed_steps`.

### Step 8: CDN & Edge Optimization

Read `.performance-optimization/07-frontend.md`.

Use the Task tool:

```
Task:
  subagent_type: "general-purpose"
  description: "Optimize CDN and edge performance for $TARGET"
  prompt: |
    You are a cloud infrastructure and CDN optimization expert. Optimize CDN and edge
    performance for: $TARGET.
    Review:
    - cache keys, TTLs, and invalidation strategy
    - origin load and edge offload opportunities
    - compression, image transformation, and regional routing
    - edge middleware or worker overhead

    Write your complete optimization plan as a single markdown document.
```

Save output to `.performance-optimization/08-cdn.md`.

Update `state.json`: set `current_step` to 9, add step 8 to `completed_steps`.

### Step 9: Mobile & Progressive Web App Optimization

Read `.performance-optimization/07-frontend.md` and `.performance-optimization/08-cdn.md`.

Use the Task tool:

```
Task:
  subagent_type: "general-purpose"
  description: "Optimize mobile experience for $TARGET"
  prompt: |
    You are a mobile performance optimization expert. Optimize mobile experience for: $TARGET.

    Cover:
    - mobile loading and interaction latency
    - bandwidth, battery, and memory constraints
    - offline or degraded-network behavior if relevant
    - PWA or installability improvements where justified

    Write your complete optimization plan as a single markdown document.
```

Save output to `.performance-optimization/09-mobile.md`.

Update `state.json`: set `current_step` to "checkpoint-3", add step 9 to `completed_steps`.

---

## PHASE CHECKPOINT 3 — User Approval Required

Display a summary of frontend/CDN/mobile optimization plans and ask:

```
Frontend optimization plans complete. Please review:
- .performance-optimization/07-frontend.md
- .performance-optimization/08-cdn.md
- .performance-optimization/09-mobile.md

1. Approve — proceed to load testing & validation
2. Request changes — tell me what to adjust
3. Pause — save progress and stop here
```

Do NOT proceed to Phase 4 until the user approves.

---

## Phase 4: Load Testing & Validation (Steps 10–11)

### Step 10: Comprehensive Load Testing

Read `.performance-optimization/01-profiling.md`.

Use the Task tool:

```
Task:
  subagent_type: "performance-engineer"
  description: "Conduct comprehensive load testing for $TARGET"
  prompt: |
    Conduct comprehensive load testing for: $TARGET using k6/Gatling/Artillery.

    Build a plan that includes:
    - baseline, stress, and soak scenarios
    - success thresholds tied to the profiling baseline
    - bottlenecks observed under load
    - recommended next changes before production rollout

    Write your complete load test report as a single markdown document.
```

Save output to `.performance-optimization/10-load-testing.md`.

Update `state.json`: set `current_step` to 11, add step 10 to `completed_steps`.

### Step 11: Performance Regression Testing

Read `.performance-optimization/10-load-testing.md` and `.performance-optimization/01-profiling.md`.

Use the Task tool:

```
Task:
  subagent_type: "general-purpose"
  description: "Create performance regression tests for $TARGET"
  prompt: |
    You are a test automation expert specializing in performance testing. Create automated
    performance regression tests for: $TARGET.
    Recommend:
    - the most valuable regression checks to automate
    - thresholds and guardrails for CI or scheduled jobs
    - test data, environments, and artifacts to retain
    - how to detect regressions before users do

    Write your complete regression testing plan as a single markdown document.
```

Save output to `.performance-optimization/11-regression-testing.md`.

Update `state.json`: set `current_step` to "checkpoint-4", add step 11 to `completed_steps`.

---

## PHASE CHECKPOINT 4 — User Approval Required

Display a summary of testing results and ask:

```
Load testing and validation complete. Please review:
- .performance-optimization/10-load-testing.md
- .performance-optimization/11-regression-testing.md

1. Approve — proceed to monitoring & continuous optimization
2. Request changes — tell me what to adjust
3. Pause — save progress and stop here
```

Do NOT proceed to Phase 5 until the user approves.

---

## Phase 5: Monitoring & Continuous Optimization (Steps 12–13)

### Step 12: Production Monitoring Setup

Read `.performance-optimization/02-observability.md` and `.performance-optimization/10-load-testing.md`.

Use the Task tool:

```
Task:
  subagent_type: "observability-engineer"
  description: "Implement production performance monitoring for $TARGET"
  prompt: |
    Implement production performance monitoring for: $TARGET.

    Define:
    - production dashboards and key alerts
    - SLOs, budgets, or thresholds tied to the optimized system
    - alert routing and escalation expectations
    - how to compare live metrics against the original baseline

    Write your complete monitoring plan as a single markdown document.
```

Save output to `.performance-optimization/12-monitoring.md`.

Update `state.json`: set `current_step` to 13, add step 12 to `completed_steps`.

### Step 13: Continuous Performance Optimization

Read all previous `.performance-optimization/*.md` files.

Use the Task tool:

```
Task:
  subagent_type: "performance-engineer"
  description: "Establish continuous optimization process for $TARGET"
  prompt: |
    Establish continuous optimization process for: $TARGET.

    Produce an operating cadence that covers:
    - recurring performance review checkpoints
    - ownership and escalation
    - budget or threshold review
    - how profiling, regression tests, and monitoring stay aligned over time

    Write your complete continuous optimization plan as a single markdown document.
```

Save output to `.performance-optimization/13-continuous.md`.

Update `state.json`: set `current_step` to "complete", add step 13 to `completed_steps`.

---

## Completion

Update `state.json`:

- Set `status` to `"complete"`
- Set `last_updated` to current timestamp

Present the final summary:

```
Performance optimization complete: $TARGET

## Files Created
[List all .performance-optimization/ output files]

## Optimization Summary
- Baseline and profiling complete
- Backend, distributed, frontend, and edge plans prepared
- Load and regression testing defined
- Monitoring and continuous optimization plans documented

## Recommended Next Actions
1. Implement the highest-impact quick wins first
2. Re-measure against the original baseline after each major change
3. Monitor production metrics against baselines
4. Review performance budgets in weekly cycles
```
