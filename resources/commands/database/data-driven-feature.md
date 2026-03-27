---
description: "Build features guided by data insights, A/B testing, and continuous measurement"
argument-hint: "<feature description> [--experiment-type ab|multivariate|bandit] [--confidence 0.90|0.95|0.99]"
---

# Data-Driven Feature Development Orchestrator

## CRITICAL BEHAVIORAL RULES

You MUST follow these rules exactly. Violating any of them is a failure.

1. **Execute steps in order.** Do NOT skip ahead, reorder, or merge steps.
2. **Write output files.** Each step MUST produce its output file in `.data-driven-feature/` before the next step begins. Read from prior step files — do NOT rely on context window memory.
3. **Stop at checkpoints.** When you reach a `PHASE CHECKPOINT`, you MUST stop and wait for explicit user approval before continuing. Use the AskUserQuestion tool with clear options.
4. **Halt on failure.** If any step fails (agent error, test failure, missing dependency), STOP immediately. Present the error and ask the user how to proceed. Do NOT silently continue.
5. **Use only local agents.** All `subagent_type` references use agents bundled with this plugin or `general-purpose`. No cross-plugin dependencies.
6. **Never enter plan mode autonomously.** Do NOT use EnterPlanMode. This command IS the plan — execute it.

## Pre-flight Checks

Before starting, perform these checks:

### 1. Check for existing session

Check if `.data-driven-feature/state.json` exists:

- If it exists and `status` is `"in_progress"`: Read it, display the current step, and ask the user:

  ```
  Found an in-progress data-driven feature session:
  Feature: [name from state]
  Current step: [step from state]

  1. Resume from where we left off
  2. Start fresh (archives existing session)
  ```

- If it exists and `status` is `"complete"`: Ask whether to archive and start fresh.

### 2. Initialize state

Create `.data-driven-feature/` directory and `state.json`:

```json
{
  "feature": "$ARGUMENTS",
  "status": "in_progress",
  "experiment_type": "ab",
  "confidence_level": 0.95,
  "current_step": 1,
  "current_phase": 1,
  "completed_steps": [],
  "files_created": [],
  "started_at": "ISO_TIMESTAMP",
  "last_updated": "ISO_TIMESTAMP"
}
```

Parse `$ARGUMENTS` for `--experiment-type` and `--confidence` flags. Use defaults if not specified.

### 3. Parse feature description

Extract the feature description from `$ARGUMENTS` (everything before the flags). This is referenced as `$FEATURE` in prompts below.

---

## Phase 1: Data Analysis & Hypothesis (Steps 1–3) — Interactive

### Step 1: Exploratory Data Analysis

Use the Task tool:

```
Task:
  subagent_type: "general-purpose"
  description: "Perform exploratory data analysis for $FEATURE"
  prompt: |
    You are a data scientist specializing in product analytics. Perform exploratory data analysis for feature: $FEATURE.

    ## Instructions
    1. Analyze existing user behavior data, identify patterns and opportunities
    2. Segment users by behavior and engagement patterns
    3. Calculate baseline metrics for key indicators
    4. Use modern analytics tools (Amplitude, Mixpanel, Segment) to understand current user journeys, conversion funnels, and engagement patterns
    5. Identify data quality issues or gaps that need addressing

    Provide an EDA report with user segments, behavioral patterns, and baseline metrics.
```

Save the agent's output to `.data-driven-feature/01-eda-report.md`.

Update `state.json`: set `current_step` to 2, add `"01-eda-report.md"` to `files_created`, add step 1 to `completed_steps`.

### Step 2: Business Hypothesis Development

Read `.data-driven-feature/01-eda-report.md` to load EDA context.

Use the Task tool:

```
Task:
  subagent_type: "general-purpose"
  description: "Formulate business hypotheses for $FEATURE"
  prompt: |
    You are a business analyst specializing in data-driven product development. Formulate business hypotheses for feature: $FEATURE based on the data analysis below.
    Include:
    - primary user problem and target segment
    - measurable business outcome and guardrail metric
    - expected mechanism of impact
    - leading indicators to watch before the lagging outcome moves

    Provide a hypothesis document with success metrics definition and expected ROI calculations.
```

Save the agent's output to `.data-driven-feature/02-hypotheses.md`.

Update `state.json`: set `current_step` to 3, add step 2 to `completed_steps`.

### Step 3: Statistical Experiment Design

Read `.data-driven-feature/02-hypotheses.md` to load hypothesis context.

Use the Task tool:

```
Task:
  subagent_type: "general-purpose"
  description: "Design statistical experiment for $FEATURE"
  prompt: |
    You are a data scientist specializing in experimentation and statistical analysis. Design the statistical experiment for feature: $FEATURE.

    Include:
    - experiment unit, variants, and assignment strategy
    - primary metric, secondary metrics, and guardrails
    - sample size / power assumptions
    - expected runtime and stop conditions

    Provide an experiment design document with power analysis and statistical test plan.
```

Save the agent's output to `.data-driven-feature/03-experiment-design.md`.

Update `state.json`: set `current_step` to "checkpoint-1", add step 3 to `completed_steps`.

---

## PHASE CHECKPOINT 1 — User Approval Required

You MUST stop here and present the analysis and experiment design for review.

Display a summary of the hypotheses from `.data-driven-feature/02-hypotheses.md` and experiment design from `.data-driven-feature/03-experiment-design.md` (key metrics, target segments, sample size, experiment type) and ask:

```
Data analysis and experiment design complete. Please review:
- .data-driven-feature/01-eda-report.md
- .data-driven-feature/02-hypotheses.md
- .data-driven-feature/03-experiment-design.md

1. Approve — proceed to architecture and implementation
2. Request changes — tell me what to adjust
3. Pause — save progress and stop here
```

Do NOT proceed to Phase 2 until the user selects option 1. If they select option 2, revise and re-checkpoint. If option 3, update `state.json` status and stop.

---

## Phase 2: Architecture & Instrumentation (Steps 4–6)

### Step 4: Feature Architecture Planning

Read `.data-driven-feature/02-hypotheses.md` and `.data-driven-feature/03-experiment-design.md`.

Use the Task tool:

```
Task:
  subagent_type: "backend-architect"
  description: "Design feature architecture for $FEATURE with A/B testing capability"
  prompt: |
    Design the feature architecture for: $FEATURE with A/B testing capability.

    Include:
    - control and treatment execution paths
    - feature flag boundaries
    - persistence and event emission points
    - rollback and kill-switch behavior

    Provide architecture diagrams, feature flag schema, and rollout strategy.
```

Save the agent's output to `.data-driven-feature/04-architecture.md`.

Update `state.json`: set `current_step` to 5, add step 4 to `completed_steps`.

### Step 5: Analytics Instrumentation Design

Read `.data-driven-feature/04-architecture.md`.

Use the Task tool:

```
Task:
  subagent_type: "data-engineer"
  description: "Design analytics instrumentation for $FEATURE"
  prompt: |
    Design comprehensive analytics instrumentation for: $FEATURE.

    Include:
    - event names and trigger conditions
    - required properties and identifiers
    - attribution / experiment metadata
    - data quality checks for missing or malformed events

    Provide an event tracking plan, analytics schema, and instrumentation guide.
```

Save the agent's output to `.data-driven-feature/05-analytics-design.md`.

Update `state.json`: set `current_step` to 6, add step 5 to `completed_steps`.

### Step 6: Data Pipeline Architecture

Read `.data-driven-feature/05-analytics-design.md`.

Use the Task tool:

```
Task:
  subagent_type: "data-engineer"
  description: "Design data pipelines for $FEATURE"
  prompt: |
    Design data pipelines for feature: $FEATURE.

    Include:
    - source systems and event ingestion path
    - transformations and aggregation layers
    - late-arriving / duplicate event handling
    - output tables or views consumed by analysis

    Provide pipeline architecture, ETL/ELT specifications, and data flow diagrams.
```

Save the agent's output to `.data-driven-feature/06-data-pipelines.md`.

Update `state.json`: set `current_step` to "checkpoint-2", add step 6 to `completed_steps`.

---

## PHASE CHECKPOINT 2 — User Approval Required

Display a summary of the architecture, analytics design, and data pipelines and ask:

```
Architecture and instrumentation design complete. Please review:
- .data-driven-feature/04-architecture.md
- .data-driven-feature/05-analytics-design.md
- .data-driven-feature/06-data-pipelines.md

1. Approve — proceed to implementation
2. Request changes — tell me what to adjust
3. Pause — save progress and stop here
```

Do NOT proceed to Phase 3 until the user approves.

---

## Phase 3: Implementation (Steps 7–9)

### Step 7: Backend Implementation

Read `.data-driven-feature/04-architecture.md` and `.data-driven-feature/05-analytics-design.md`.

Use the Task tool:

```
Task:
  subagent_type: "backend-architect"
  description: "Implement backend for $FEATURE with full instrumentation"
  prompt: |
    Implement the backend for feature: $FEATURE with full instrumentation.

    Include:
    - feature flag evaluation and experiment assignment
    - business logic and persistence changes
    - analytics events at meaningful state transitions
    - tests for flag, metrics, and fallback behavior

    Write all code files. Report what files were created/modified.
```

Save a summary to `.data-driven-feature/07-backend.md`.

Update `state.json`: set `current_step` to 8, add step 7 to `completed_steps`.

### Step 8: Frontend Implementation

Read `.data-driven-feature/04-architecture.md`, `.data-driven-feature/05-analytics-design.md`, and `.data-driven-feature/07-backend.md`.

Use the Task tool:

```
Task:
  subagent_type: "general-purpose"
  description: "Implement frontend for $FEATURE with analytics tracking"
  prompt: |
    You are a frontend developer. Build the frontend for feature: $FEATURE with analytics tracking.

    Include:
    - control/treatment UI behavior
    - analytics events for user-visible actions
    - loading, empty, and error states
    - accessibility and experiment guardrails

    Write all code files. Report what files were created/modified.
```

Save a summary to `.data-driven-feature/08-frontend.md`.

**Note:** If the feature has no frontend component (pure backend/API/pipeline), skip this step — write a brief note in `08-frontend.md` explaining why it was skipped, and continue.

Update `state.json`: set `current_step` to 9, add step 8 to `completed_steps`.

### Step 9: ML Model Integration (if applicable)

Read `.data-driven-feature/04-architecture.md` and `.data-driven-feature/06-data-pipelines.md`.

Use the Task tool:

```
Task:
  subagent_type: "general-purpose"
  description: "Integrate ML models for $FEATURE"
  prompt: |
    You are an ML engineer. Integrate ML models for feature: $FEATURE if needed.

    Include:
    - whether ML is justified for the problem
    - model inputs, outputs, and serving boundary
    - instrumentation for prediction quality
    - deterministic fallback when the model is unavailable
    If no ML component is needed for this feature, explain why and skip.
    Write all code files. Report what files were created/modified.
```

Save a summary to `.data-driven-feature/09-ml-integration.md`.

Update `state.json`: set `current_step` to "checkpoint-3", add step 9 to `completed_steps`.

---

## PHASE CHECKPOINT 3 — User Approval Required

Display a summary of the implementation and ask:

```
Implementation complete. Please review:
- .data-driven-feature/07-backend.md
- .data-driven-feature/08-frontend.md
- .data-driven-feature/09-ml-integration.md

1. Approve — proceed to validation and launch
2. Request changes — tell me what to fix
3. Pause — save progress and stop here
```

Do NOT proceed to Phase 4 until the user approves.

---

## Phase 4: Validation & Launch (Steps 10–13)

### Step 10: Analytics Validation

Read `.data-driven-feature/05-analytics-design.md`, `.data-driven-feature/07-backend.md`, and `.data-driven-feature/08-frontend.md`.

Use the Task tool:

```
Task:
  subagent_type: "data-engineer"
  description: "Validate analytics implementation for $FEATURE"
  prompt: |
    Validate the analytics implementation for: $FEATURE.

    Include:
    - event coverage against the tracking plan
    - field completeness and type validation
    - duplicate / missing event checks
    - experiment assignment consistency across events

    Provide a validation report with data quality metrics and tracking coverage analysis.
```

Save the agent's output to `.data-driven-feature/10-analytics-validation.md`.

Update `state.json`: set `current_step` to 11, add step 10 to `completed_steps`.

### Step 11: Experiment Setup & Deployment

Read `.data-driven-feature/03-experiment-design.md` and `.data-driven-feature/04-architecture.md`.

Launch two agents in parallel using multiple Task tool calls in a single response:

**11a. Experiment Infrastructure:**

```
Task:
  subagent_type: "general-purpose"
  description: "Configure experiment infrastructure for $FEATURE"
  prompt: |
    You are a deployment engineer specializing in experimentation platforms. Configure experiment infrastructure for: $FEATURE.

    Include:
    - feature flag / experiment definitions
    - environment-specific configuration
    - rollout controls and blast-radius limits
    - observability hooks for experiment health

    Provide experiment configuration, monitoring dashboards, and rollout plan.
```

**11b. Monitoring Setup:**

```
Task:
  subagent_type: "general-purpose"
  description: "Set up monitoring for $FEATURE experiment"
  prompt: |
    You are an observability engineer. Set up comprehensive monitoring for: $FEATURE.

    Include:
    - golden signals for the new feature path
    - business and experiment guardrail alerts
    - dashboard panels for adoption and failures
    - SLO view for the critical user journey

    Provide monitoring dashboard configs, alert definitions, and SLO specifications.
```

After both complete, consolidate results into `.data-driven-feature/11-experiment-setup.md`:

```markdown
# Experiment Setup: $FEATURE

## Experiment Infrastructure

[Summary from 11a — feature flags, traffic allocation, rollback plan]

## Monitoring Configuration

[Summary from 11b — dashboards, alerts, SLOs]
```

Update `state.json`: set `current_step` to 12, add step 11 to `completed_steps`.

### Step 12: Gradual Rollout

Read `.data-driven-feature/11-experiment-setup.md`.

Use the Task tool:

```
Task:
  subagent_type: "general-purpose"
  description: "Create gradual rollout plan for $FEATURE"
  prompt: |
    You are a deployment engineer. Create a detailed gradual rollout plan for feature: $FEATURE.
    Include:
    - rollout stages and traffic percentages
    - entry and exit criteria per stage
    - monitoring checks before expansion
    - rollback thresholds and owners

    Provide a stage-by-stage rollout plan with decision criteria.
```

Save the agent's output to `.data-driven-feature/12-rollout-plan.md`.

Update `state.json`: set `current_step` to 13, add step 12 to `completed_steps`.

### Step 13: Security Review

Read `.data-driven-feature/04-architecture.md`, `.data-driven-feature/07-backend.md`, and `.data-driven-feature/08-frontend.md`.

Use the Task tool:

```
Task:
  subagent_type: "general-purpose"
  description: "Security review of $FEATURE"
  prompt: |
    You are a security auditor. Perform a security review of this data-driven feature implementation.

    Include:
    - data exposure and permission boundaries
    - experimentation abuse or tampering risks
    - logging / analytics privacy concerns
    - concrete remediation guidance tied to files or flows

    Provide findings with severity, location, and specific fix recommendations.
```

Save the agent's output to `.data-driven-feature/13-security-review.md`.

If there are Critical or High severity findings, address them now before proceeding. Apply fixes and re-validate.

Update `state.json`: set `current_step` to "checkpoint-4", add step 13 to `completed_steps`.

---

## PHASE CHECKPOINT 4 — User Approval Required

Display a summary of validation and launch readiness and ask:

```
Validation and launch preparation complete. Please review:
- .data-driven-feature/10-analytics-validation.md
- .data-driven-feature/11-experiment-setup.md
- .data-driven-feature/12-rollout-plan.md
- .data-driven-feature/13-security-review.md

Security findings: [X critical, Y high, Z medium]

1. Approve — proceed to analysis planning
2. Request changes — tell me what to fix
3. Pause — save progress and stop here
```

Do NOT proceed to Phase 5 until the user approves.

---

## Phase 5: Analysis & Decision (Steps 14–16)

### Step 14: Statistical Analysis

Read `.data-driven-feature/03-experiment-design.md` and `.data-driven-feature/02-hypotheses.md`.

Use the Task tool:

```
Task:
  subagent_type: "general-purpose"
  description: "Create statistical analysis plan for $FEATURE experiment"
  prompt: |
    You are a data scientist specializing in experimentation. Create the statistical analysis plan for the A/B test results of: $FEATURE.

    Include:
    - primary success metric and guardrail interpretation
    - treatment effect estimation method
    - segmentation rules and caveats
    - rules for inconclusive or harmful outcomes

    Provide an analysis plan with templates for results reporting.
```

Save the agent's output to `.data-driven-feature/14-analysis-plan.md`.

Update `state.json`: set `current_step` to 15, add step 14 to `completed_steps`.

### Step 15: Business Impact Assessment Framework

Read `.data-driven-feature/02-hypotheses.md` and `.data-driven-feature/14-analysis-plan.md`.

Use the Task tool:

```
Task:
  subagent_type: "general-purpose"
  description: "Create business impact assessment framework for $FEATURE"
  prompt: |
    You are a business analyst. Create a business impact assessment framework for feature: $FEATURE.

    Include:
    - revenue / retention / efficiency impact dimensions
    - cost assumptions
    - short-term vs long-term tradeoffs
    - decision matrix for scale, iterate, or stop

    Provide a business impact framework and decision matrix.
```

Save the agent's output to `.data-driven-feature/15-impact-framework.md`.

Update `state.json`: set `current_step` to 16, add step 15 to `completed_steps`.

### Step 16: Optimization Roadmap

Read `.data-driven-feature/14-analysis-plan.md` and `.data-driven-feature/15-impact-framework.md`.

Use the Task tool:

```
Task:
  subagent_type: "general-purpose"
  description: "Create post-launch optimization roadmap for $FEATURE"
  prompt: |
    You are a data scientist specializing in product optimization. Create a post-launch optimization roadmap for: $FEATURE.

    Include:
    - first-wave follow-up experiments
    - instrumentation gaps to close
    - user segments needing deeper analysis
    - criteria for graduating the feature from experiment to default

    Provide an optimization roadmap with follow-up experiment plans.
```

Save the agent's output to `.data-driven-feature/16-optimization-roadmap.md`.

Update `state.json`: set `current_step` to "complete", add step 16 to `completed_steps`.

---

## Completion

Update `state.json`:

- Set `status` to `"complete"`
- Set `last_updated` to current timestamp

Present the final summary:

```
Data-driven feature development complete: $FEATURE

## Files Created
[List all .data-driven-feature/ output files]

## Development Summary
1. Finalize the hypothesis and experiment artifacts before coding.
2. Implement backend, frontend, analytics, and any required data pipelines.
3. Validate instrumentation and experiment infrastructure before rollout.
4. Run analysis after experiment completes using .data-driven-feature/14-analysis-plan.md
5. Make go/no-go decision using .data-driven-feature/15-impact-framework.md
```
