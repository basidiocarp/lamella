---
description: "Orchestrate multi-agent incident response with modern SRE practices for rapid resolution and learning"
argument-hint: "<incident description> [--severity P0|P1|P2|P3]"
---

# Incident Response Orchestrator

## CRITICAL BEHAVIORAL RULES

You MUST follow these rules exactly. Violating any of them is a failure.

1. **Execute steps in order.** Do NOT skip ahead, reorder, or merge steps.
2. **Write output files.** Each step MUST produce its output file in `.incident-response/` before the next step begins. Read from prior step files — do NOT rely on context window memory.
3. **Stop at checkpoints.** When you reach a `PHASE CHECKPOINT`, you MUST stop and wait for explicit user approval before continuing. Use the AskUserQuestion tool with clear options.
4. **Halt on failure.** If any step fails (agent error, test failure, missing dependency), STOP immediately. Present the error and ask the user how to proceed. Do NOT silently continue.
5. **Use only local agents.** All `subagent_type` references use agents bundled with this plugin or `general-purpose`. No cross-plugin dependencies.
6. **Never enter plan mode autonomously.** Do NOT use EnterPlanMode. This command IS the plan — execute it.

## Pre-flight Checks

Before starting, perform these checks:

### 1. Check for existing session

Check if `.incident-response/state.json` exists:

- If it exists and `status` is `"in_progress"`: Read it, display the current step, and ask the user:

  ```
  Found an in-progress incident response session:
  Incident: [incident from state]
  Severity: [severity from state]
  Current step: [step from state]

  1. Resume from where we left off
  2. Start fresh (archives existing session)
  ```

- If it exists and `status` is `"complete"`: Ask whether to archive and start fresh.

### 2. Initialize state

Create `.incident-response/` directory and `state.json`:

```json
{
  "incident": "$ARGUMENTS",
  "status": "in_progress",
  "severity": "P1",
  "current_step": 1,
  "current_phase": 1,
  "completed_steps": [],
  "files_created": [],
  "started_at": "ISO_TIMESTAMP",
  "last_updated": "ISO_TIMESTAMP"
}
```

Parse `$ARGUMENTS` for `--severity` flag. Default to P1 if not specified.

### 3. Parse incident description

Extract the incident description from `$ARGUMENTS` (everything before the flags). This is referenced as `$INCIDENT` in prompts below.

---

## Phase 1: Detection & Triage (Steps 1-3)

### Step 1: Incident Detection and Classification

Use the Task tool to launch the incident responder agent:

```
Task:
  subagent_type: "incident-responder"
  description: "URGENT: Classify incident: $INCIDENT"
  prompt: |
    URGENT: Detect and classify incident: $INCIDENT

    Focus on first-response triage:
    - classify severity with justification
    - identify affected services and likely blast radius
    - estimate user and business impact
    - note whether an incident commander should be assigned immediately
    - flag any immediate unknowns that block mitigation

    Provide structured output with: SEVERITY, AFFECTED_SERVICES, USER_IMPACT,
    BUSINESS_RISK, INCIDENT_COMMAND, SLO_STATUS.
```

Save output to `.incident-response/01-classification.md`.

Update `state.json`: set `current_step` to 2, update severity from classification, add step 1 to `completed_steps`.

### Step 2: Observability Analysis

Read `.incident-response/01-classification.md`.

```
Task:
  subagent_type: "general-purpose"
  description: "Observability sweep for incident: $INCIDENT"
  prompt: |
    You are an observability engineer. Perform rapid observability sweep for this incident.

    Use the classification as context. Summarize:
    - metrics anomalies and alert correlations
    - error-rate, latency, saturation, or throughput shifts
    - log signatures and likely failure windows
    - trace or dependency hotspots
    - current health of the affected services

    Provide structured output with: TRACE_ANALYSIS, METRICS_ANOMALIES, LOG_PATTERNS,
    APM_FINDINGS, RUM_IMPACT, SERVICE_HEALTH_MATRIX.
```

Save output to `.incident-response/02-observability.md`.

Update `state.json`: set `current_step` to 3, add step 2 to `completed_steps`.

### Step 3: Initial Mitigation

Read `.incident-response/01-classification.md` and `.incident-response/02-observability.md`.

```
Task:
  subagent_type: "incident-responder"
  description: "Immediate mitigation for: $INCIDENT"
  prompt: |
    Implement immediate mitigation for this incident.

    Work from the classification and observability findings. Recommend:
    - fastest safe containment action
    - temporary mitigations and guardrails
    - rollback or traffic-shaping options
    - risks of each mitigation path
    - expected user impact reduction after mitigation

    Provide structured output with: MITIGATION_ACTIONS, TEMPORARY_FIXES,
    ROLLBACK_DECISIONS, SERVICE_STATUS_AFTER, USER_IMPACT_REDUCTION.
```

Save output to `.incident-response/03-mitigation.md`.

Update `state.json`: set `current_step` to "checkpoint-1", add step 3 to `completed_steps`.

---

## PHASE CHECKPOINT 1 — User Approval Required

You MUST stop here and present the triage results.

Display a summary from `.incident-response/01-classification.md` and `.incident-response/03-mitigation.md` and ask:

```
Triage and initial mitigation complete.

Severity: [from classification]
Affected services: [from classification]
Mitigation status: [from mitigation]
User impact reduction: [from mitigation]

1. Approve — proceed to investigation and root cause analysis
2. Request changes — adjust mitigation or severity
3. Pause — save progress and stop here (mitigation in place)
```

Do NOT proceed to Phase 2 until the user approves.

---

## Phase 2: Investigation & Root Cause (Steps 4-6)

### Step 4: Deep System Debugging

Read `.incident-response/02-observability.md` and `.incident-response/03-mitigation.md`.

```
Task:
  subagent_type: "debugger"
  description: "Deep debugging for: $INCIDENT"
  prompt: |
    Conduct deep debugging for this incident using observability data.

    Trace the likely failure chain. Include:
    - most probable root cause
    - contributing factors and missing safeguards
    - dependency or upstream/downstream interactions
    - a concise five-whys analysis
    - confidence level for the current root-cause hypothesis

    Provide structured output with: ROOT_CAUSE, CONTRIBUTING_FACTORS,
    DEPENDENCY_IMPACT_MAP, FIVE_WHYS_ANALYSIS.
```

Save output to `.incident-response/04-debugging.md`.

Update `state.json`: set `current_step` to 5, add step 4 to `completed_steps`.

### Step 5: Security Assessment

Read `.incident-response/04-debugging.md`.

```
Task:
  subagent_type: "general-purpose"
  description: "Security assessment for: $INCIDENT"
  prompt: |
    You are a security auditor. Assess security implications of this incident.

    Determine whether the incident suggests:
    - compromise, abuse, or policy failure
    - data exposure or privacy impact
    - authentication, authorization, or secret-management issues
    - immediate containment or notification obligations

    Provide structured output with: SECURITY_ASSESSMENT, BREACH_ANALYSIS,
    VULNERABILITY_IDENTIFICATION, DATA_EXPOSURE_RISK, REMEDIATION_STEPS.
```

### Step 6: Performance Analysis

Read `.incident-response/04-debugging.md`.

Launch in parallel with Step 5:

```
Task:
  subagent_type: "general-purpose"
  description: "Performance analysis for: $INCIDENT"
  prompt: |
    You are a performance engineer. Analyze performance aspects of this incident.

    Focus on:
    - bottlenecks or resource exhaustion
    - queueing, concurrency, and capacity issues
    - performance side effects of mitigation options
    - opportunities to stabilize the system while a permanent fix is prepared

    Provide structured output with: PERFORMANCE_BOTTLENECKS, RESOURCE_RECOMMENDATIONS,
    OPTIMIZATION_OPPORTUNITIES, CAPACITY_ISSUES.
```

After both complete, consolidate into `.incident-response/05-investigation.md`:

```markdown
# Investigation: $INCIDENT

## Root Cause (from debugging)

[From Step 4]

## Security Review
[Summary from Step 5]

## Performance Review
[Summary from Step 6]

## Synthesis

[Synthesis of all investigation results]
```

Update `state.json`: set `current_step` to "checkpoint-2", add steps 4-6 to `completed_steps`.

---

## PHASE CHECKPOINT 2 — User Approval Required

Display investigation results from `.incident-response/05-investigation.md` and ask:

```
Investigation complete. Please review .incident-response/05-investigation.md

Root cause: [brief summary]
Security concerns: [summary]
Performance issues: [summary]

1. Approve — proceed to fix implementation and deployment
2. Request changes — investigate further
3. Pause — save progress and stop here
```

Do NOT proceed to Phase 3 until the user approves.

---

## Phase 3: Resolution & Recovery (Steps 7-8)

### Step 7: Fix Implementation

Read `.incident-response/05-investigation.md`.

```
Task:
  subagent_type: "general-purpose"
  description: "Implement production fix for: $INCIDENT"
  prompt: |
    You are a senior backend architect. Design and implement a production fix for this incident.

    Work from the approved investigation. Produce:
    - the fix strategy and scope
    - deployment sequencing
    - validation steps
    - rollback criteria
    - the long-term corrective action, separate from the immediate fix

    Provide structured output with: FIX_IMPLEMENTATION, DEPLOYMENT_STRATEGY,
    VALIDATION_PLAN, ROLLBACK_PROCEDURES, LONG_TERM_SOLUTION.
```

Save output to `.incident-response/06-fix.md`.

Update `state.json`: set `current_step` to 8, add step 7 to `completed_steps`.

### Step 8: Deployment and Validation

Read `.incident-response/06-fix.md`.

```
Task:
  subagent_type: "devops-troubleshooter"
  description: "Deploy and validate fix for: $INCIDENT"
  prompt: |
    Execute emergency deployment for incident fix.

    Use the fix plan as the source of truth. Summarize:
    - deployment steps and outcome
    - validation checks performed
    - current service health
    - rollback readiness and triggers
    - any remaining elevated monitoring requirements

    Provide structured output with: DEPLOYMENT_STATUS, VALIDATION_RESULTS,
    MONITORING_DASHBOARD, ROLLBACK_READINESS, SERVICE_HEALTH_POST_DEPLOY.
```

Save output to `.incident-response/07-deployment.md`.

Update `state.json`: set `current_step` to "checkpoint-3", add step 8 to `completed_steps`.

---

## PHASE CHECKPOINT 3 — User Approval Required

Display deployment results from `.incident-response/07-deployment.md` and ask:

```
Fix deployed and validated.

Deployment status: [from deployment]
Service health: [from deployment]
Rollback ready: [yes/no]

1. Approve — proceed to communication and postmortem
2. Rollback — revert the deployment
3. Pause — save progress and monitor
```

Do NOT proceed to Phase 4 until the user approves.

---

## Phase 4: Communication & Coordination (Steps 9-10)

### Step 9: Stakeholder Communication

Read `.incident-response/01-classification.md`, `.incident-response/05-investigation.md`, and `.incident-response/07-deployment.md`.

```
Task:
  subagent_type: "general-purpose"
  description: "Manage incident communication for: $INCIDENT"
  prompt: |
    You are a communications specialist. Manage incident communication for this incident.

    Prepare audience-specific communication for:
    - public or customer-facing status updates
    - engineering/internal incident updates
    - executive summary
    - support-team briefing
    - timeline of major milestones

    Provide structured output with: STATUS_PAGE_UPDATE, ENGINEERING_UPDATE,
    EXECUTIVE_SUMMARY, SUPPORT_BRIEFING, INCIDENT_TIMELINE.
```

Save output to `.incident-response/08-communication.md`.

Update `state.json`: set `current_step` to 10, add step 9 to `completed_steps`.

### Step 10: Customer Impact Assessment

Read `.incident-response/01-classification.md` and `.incident-response/07-deployment.md`.

```
Task:
  subagent_type: "incident-responder"
  description: "Assess customer impact for: $INCIDENT"
  prompt: |
    Assess and document customer impact for this incident.

    Estimate:
    - who was affected and for how long
    - SLA or contractual impact
    - revenue or operational impact
    - whether proactive customer outreach is warranted

    Provide structured output with: CUSTOMER_IMPACT_REPORT, SLA_ANALYSIS,
    REVENUE_IMPACT, OUTREACH_RECOMMENDATIONS.
```

Save output to `.incident-response/09-customer-impact.md`.

Update `state.json`: set `current_step` to 11, add step 10 to `completed_steps`.

---

## Phase 5: Postmortem & Prevention (Steps 11-13)

### Step 11: Blameless Postmortem

Read all `.incident-response/*.md` files.

```
Task:
  subagent_type: "general-purpose"
  description: "Blameless postmortem for: $INCIDENT"
  prompt: |
    You are an SRE documentation specialist. Conduct a blameless postmortem for this incident.

    Use all prior reports. Capture:
    - timeline and trigger
    - root cause summary
    - what went well
    - what failed or was missing
    - concrete action items with owners or roles

    Provide structured output with: INCIDENT_TIMELINE, ROOT_CAUSE_SUMMARY,
    WHAT_WENT_WELL, IMPROVEMENTS, ACTION_ITEMS, LESSONS_LEARNED.
```

Save output to `.incident-response/10-postmortem.md`.

Update `state.json`: set `current_step` to 12, add step 11 to `completed_steps`.

### Step 12: Monitoring Enhancement

Read `.incident-response/05-investigation.md` and `.incident-response/10-postmortem.md`.

```
Task:
  subagent_type: "general-purpose"
  description: "Enhance monitoring for: $INCIDENT prevention"
  prompt: |
    You are an observability engineer. Enhance monitoring to prevent recurrence of this incident.

    Recommend:
    - new alerts and thresholds
    - SLO or dashboard updates
    - runbook automation opportunities
    - chaos or game-day scenarios that would catch this failure earlier

    Provide structured output with: NEW_ALERTS, SLO_ADJUSTMENTS, DASHBOARD_UPDATES,
    RUNBOOK_AUTOMATION, CHAOS_SCENARIOS.
```

Save output to `.incident-response/11-monitoring.md`.

Update `state.json`: set `current_step` to 13, add step 12 to `completed_steps`.

### Step 13: System Hardening

Read `.incident-response/05-investigation.md` and `.incident-response/10-postmortem.md`.

```
Task:
  subagent_type: "general-purpose"
  description: "System hardening for: $INCIDENT prevention"
  prompt: |
    You are a senior backend architect. Design system improvements to prevent recurrence.

    Focus on durable prevention:
    - architecture or workflow changes
    - resilience patterns to adopt
    - capacity or scaling work
    - technical debt to retire
    - implementation roadmap in sensible phases

    Provide structured output with: ARCHITECTURE_IMPROVEMENTS, RESILIENCE_PATTERNS,
    CAPACITY_PLAN, TECH_DEBT_ITEMS, IMPLEMENTATION_ROADMAP.
```

Save output to `.incident-response/12-hardening.md`.

Update `state.json`: set `current_step` to "complete", add step 13 to `completed_steps`.

---

## Completion

Update `state.json`:

- Set `status` to `"complete"`
- Set `last_updated` to current timestamp

Present the final summary:

```
Incident response complete: $INCIDENT

## Files Created
[List all .incident-response/ output files]

## Response Summary
- Severity and scope confirmed
- Mitigation executed and checkpointed
- Root cause investigated and documented
- Fix implemented, deployed, and validated
- Stakeholder communication and customer impact completed
- Postmortem, monitoring, and hardening follow-up prepared

## Success Metrics
- Monitoring improvements deployed within 1 week
- No recurrence of the same root cause
```

Production incident requiring immediate response: $ARGUMENTS
