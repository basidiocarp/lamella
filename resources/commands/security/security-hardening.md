---
description: "Orchestrate comprehensive security hardening with defense-in-depth strategy across all application layers"
argument-hint: "<target description> [--depth quick|standard|comprehensive] [--compliance owasp,soc2,gdpr,hipaa,pci-dss]"
---

# Security Hardening Orchestrator

## CRITICAL BEHAVIORAL RULES

You MUST follow these rules exactly. Violating any of them is a failure.

1. **Execute steps in order.** Do NOT skip ahead, reorder, or merge steps.
2. **Write output files.** Each step MUST produce its output file in `.security-hardening/` before the next step begins. Read from prior step files — do NOT rely on context window memory.
3. **Stop at checkpoints.** When you reach a `PHASE CHECKPOINT`, you MUST stop and wait for explicit user approval before continuing. Use the AskUserQuestion tool with clear options.
4. **Halt on failure.** If any step fails (agent error, test failure, missing dependency), STOP immediately. Present the error and ask the user how to proceed. Do NOT silently continue.
5. **Use only local agents.** All `subagent_type` references use agents bundled with this plugin or `general-purpose`. No cross-plugin dependencies.
6. **Never enter plan mode autonomously.** Do NOT use EnterPlanMode. This command IS the plan — execute it.

## Pre-flight Checks

Before starting, perform these checks:

### 1. Check for existing session

Check if `.security-hardening/state.json` exists:

- If it exists and `status` is `"in_progress"`: Read it, display the current step, and ask the user:

  ```
  Found an in-progress security hardening session:
  Target: [target from state]
  Current step: [step from state]

  1. Resume from where we left off
  2. Start fresh (archives existing session)
  ```

- If it exists and `status` is `"complete"`: Ask whether to archive and start fresh.

### 2. Initialize state

Create `.security-hardening/` directory and `state.json`:

```json
{
  "target": "$ARGUMENTS",
  "status": "in_progress",
  "depth": "comprehensive",
  "compliance_frameworks": ["owasp"],
  "current_step": 1,
  "current_phase": 1,
  "completed_steps": [],
  "files_created": [],
  "started_at": "ISO_TIMESTAMP",
  "last_updated": "ISO_TIMESTAMP"
}
```

Parse `$ARGUMENTS` for `--depth` and `--compliance` flags. Use defaults if not specified.

### 3. Parse target description

Extract the target description from `$ARGUMENTS` (everything before the flags). This is referenced as `$TARGET` in prompts below.

---

## Phase 1: Assessment & Threat Modeling (Steps 1–3)

### Step 1: Vulnerability Scanning

Use the Task tool to launch the security auditor agent:

```
Task:
  subagent_type: "security-auditor"
  description: "Comprehensive vulnerability scan of $TARGET"
  prompt: |
    Perform a comprehensive security assessment on: $TARGET.

    ## Instructions
    1. Execute SAST analysis (Semgrep/SonarQube patterns)
    2. Identify DAST scanning targets (OWASP ZAP patterns)
    3. Perform dependency audit (Snyk/Trivy patterns)
    4. Run secrets detection (GitLeaks/TruffleHog patterns)
    5. Generate SBOM for supply chain analysis
    6. Identify OWASP Top 10 vulnerabilities, CWE weaknesses, and CVE exposures
    7. Assign CVSS scores to all findings

    Provide a detailed vulnerability report with: CVSS scores, exploitability analysis,
    attack surface mapping, secrets exposure report, and SBOM inventory.
```

Save the agent's output to `.security-hardening/01-vulnerability-scan.md`.

Update `state.json`: set `current_step` to 2, add step 1 to `completed_steps`.

### Step 2: Threat Modeling & Risk Analysis

Read `.security-hardening/01-vulnerability-scan.md` to load vulnerability context.

Use the Task tool to launch the threat modeling expert:

```
Task:
  subagent_type: "threat-modeling-expert"
  description: "Threat modeling and risk analysis for $TARGET"
  prompt: |
    Conduct threat modeling using STRIDE methodology for: $TARGET.

    ## Vulnerability Context
    [Insert full contents of .security-hardening/01-vulnerability-scan.md]

    ## Instructions
    1. Analyze attack vectors and create attack trees
    2. Assess business impact of identified vulnerabilities
    3. Map threats to MITRE ATT&CK framework
    4. Prioritize risks based on likelihood and impact
    5. Use vulnerability scan results to inform threat priorities

    Provide: threat model diagrams, risk matrix with prioritized vulnerabilities,
    attack scenario documentation, and business impact analysis.
```

Save the agent's output to `.security-hardening/02-threat-model.md`.

Update `state.json`: set `current_step` to 3, add step 2 to `completed_steps`.

### Step 3: Architecture Security Review

Read `.security-hardening/01-vulnerability-scan.md` and `.security-hardening/02-threat-model.md`.

Use the Task tool:

```
Task:
  subagent_type: "general-purpose"
  description: "Architecture security review for $TARGET"
  prompt: |
    You are a backend security architect. Review the architecture for security weaknesses in: $TARGET.

    Focus on:
    - trust boundaries and privileged paths
    - authentication, authorization, and secret handling
    - network exposure, data classification, and isolation
    - concrete hardening steps tied to the deployed architecture
    Provide: security architecture assessment, zero-trust design recommendations,
    service mesh security requirements, and data classification matrix.
```

Save the agent's output to `.security-hardening/03-architecture-review.md`.

Update `state.json`: set `current_step` to "checkpoint-1", add step 3 to `completed_steps`.

---

## PHASE CHECKPOINT 1 — User Approval Required

You MUST stop here and present the assessment results for review.

Display a summary of findings from `.security-hardening/01-vulnerability-scan.md`, `.security-hardening/02-threat-model.md`, and `.security-hardening/03-architecture-review.md` (critical vulnerabilities count, top threats, key architecture concerns) and ask:

```
Security assessment complete. Please review:
- .security-hardening/01-vulnerability-scan.md
- .security-hardening/02-threat-model.md
- .security-hardening/03-architecture-review.md

Critical vulnerabilities: [count]
High-risk threats: [count]
Architecture concerns: [count]

1. Approve — proceed to vulnerability remediation
2. Request changes — tell me what to adjust
3. Pause — save progress and stop here
```

Do NOT proceed to Phase 2 until the user selects option 1. If they select option 2, revise and re-checkpoint. If option 3, update `state.json` status and stop.

---

## Phase 2: Vulnerability Remediation (Steps 4–7)

### Step 4: Critical Vulnerability Fixes

Read `.security-hardening/01-vulnerability-scan.md` and `.security-hardening/02-threat-model.md`.

Use the Task tool:

```
Task:
  subagent_type: "security-auditor"
  description: "Remediate critical vulnerabilities for $TARGET"
  prompt: |
    Coordinate immediate remediation of critical vulnerabilities (CVSS 7+) in: $TARGET.

    Prioritize:
    - exploitability and blast radius
    - safest code or config fix first
    - required regression coverage
    - rollback plan if remediation changes runtime behavior
    Provide: patched code with vulnerability fixes, security patch documentation,
    and regression test requirements.
```

Save the agent's output to `.security-hardening/04-critical-fixes.md`.

Update `state.json`: set `current_step` to 5, add step 4 to `completed_steps`.

### Step 5: Backend Security Hardening

Read `.security-hardening/03-architecture-review.md` and `.security-hardening/04-critical-fixes.md`.

Use the Task tool:

```
Task:
  subagent_type: "general-purpose"
  description: "Backend security hardening for $TARGET"
  prompt: |
    You are a backend security engineer. Implement comprehensive backend security controls for: $TARGET.

    Include:
    - strict input validation
    - authz checks at resource boundaries
    - safe secret and key handling
    - secure defaults for logging and error handling
    Provide: hardened API endpoints, validation middleware, encryption implementation,
    and secure configuration templates.
```

Save the agent's output to `.security-hardening/05-backend-hardening.md`.

Update `state.json`: set `current_step` to 6, add step 5 to `completed_steps`.

### Step 6: Frontend Security Implementation

Read `.security-hardening/03-architecture-review.md` and `.security-hardening/05-backend-hardening.md`.

Use the Task tool:

```
Task:
  subagent_type: "general-purpose"
  description: "Frontend security implementation for $TARGET"
  prompt: |
    You are a frontend security engineer. Implement frontend security measures for: $TARGET.

    Include:
    - XSS-safe rendering and content handling
    - secure token/session handling
    - CSP and header expectations
    - clickjacking and cross-origin considerations
    Provide: secure frontend components, CSP policy configuration,
    authentication flow implementation, and security headers configuration.
```

Save the agent's output to `.security-hardening/06-frontend-hardening.md`.

**Note:** If the target has no frontend component (pure backend/API), skip this step — write a brief note in `06-frontend-hardening.md` explaining why it was skipped, and continue.

Update `state.json`: set `current_step` to 7, add step 6 to `completed_steps`.

### Step 7: Mobile Security Hardening

Read `.security-hardening/03-architecture-review.md` and `.security-hardening/05-backend-hardening.md`.

Use the Task tool:

```
Task:
  subagent_type: "general-purpose"
  description: "Mobile security hardening for $TARGET"
  prompt: |
    You are a mobile security engineer. Implement mobile app security for: $TARGET.

    Include:
    - secure storage and key material handling
    - transport security and certificate pinning
    - hardening for debug, logging, and tamper-sensitive flows
    - configuration differences by environment
    Provide: hardened mobile application configuration, security configuration files,
    obfuscation rules, and certificate pinning implementation.
```

Save the agent's output to `.security-hardening/07-mobile-hardening.md`.

**Note:** If the target has no mobile component, skip this step — write a brief note in `07-mobile-hardening.md` explaining why it was skipped, and continue.

Update `state.json`: set `current_step` to "checkpoint-2", add step 7 to `completed_steps`.

---

## PHASE CHECKPOINT 2 — User Approval Required

Display a summary of all remediation work from steps 4–7 and ask:

```
Vulnerability remediation complete. Please review:
- .security-hardening/04-critical-fixes.md
- .security-hardening/05-backend-hardening.md
- .security-hardening/06-frontend-hardening.md
- .security-hardening/07-mobile-hardening.md

Critical fixes applied: [count]
Backend controls added: [summary]
Frontend controls added: [summary]
Mobile controls added: [summary]

1. Approve — proceed to security controls & validation
2. Request changes — tell me what to adjust
3. Pause — save progress and stop here
```

Do NOT proceed to Phase 3 until the user approves.

---

## Phase 3: Security Controls & Infrastructure (Steps 8–10)

### Step 8: Authentication & Authorization Enhancement

Read `.security-hardening/03-architecture-review.md` and `.security-hardening/05-backend-hardening.md`.

Use the Task tool:

```
Task:
  subagent_type: "security-auditor"
  description: "Enhance authentication and authorization for $TARGET"
  prompt: |
    Implement a modern authentication system for: $TARGET.

    Include:
    - identity provider / credential flow choice
    - MFA and recovery paths
    - session/token lifecycle rules
    - authorization model and default-deny behavior
    Provide: authentication service configuration, MFA implementation,
    authorization policies, and session management system.
```

Save the agent's output to `.security-hardening/08-auth-enhancement.md`.

Update `state.json`: set `current_step` to 9, add step 8 to `completed_steps`.

### Step 9: Infrastructure Security Controls

Read `.security-hardening/03-architecture-review.md` and `.security-hardening/08-auth-enhancement.md`.

Use the Task tool:

```
Task:
  subagent_type: "general-purpose"
  description: "Deploy infrastructure security controls for $TARGET"
  prompt: |
    You are an infrastructure security engineer. Deploy infrastructure security controls for: $TARGET.

    Include:
    - network segmentation and ingress controls
    - WAF / IDS / IPS coverage
    - cloud account and IAM boundary recommendations
    - logging and audit retention expectations
    Provide: WAF configuration, network security policies, IDS/IPS rules,
    and cloud security configurations.
```

Save the agent's output to `.security-hardening/09-infra-security.md`.

Update `state.json`: set `current_step` to 10, add step 9 to `completed_steps`.

### Step 10: Secrets Management Implementation

Read `.security-hardening/01-vulnerability-scan.md` and `.security-hardening/09-infra-security.md`.

Use the Task tool:

```
Task:
  subagent_type: "general-purpose"
  description: "Implement secrets management for $TARGET"
  prompt: |
    You are a DevOps security engineer. Implement enterprise secrets management for: $TARGET.

    Include:
    - secret storage backend selection
    - access policy and rotation rules
    - runtime injection path
    - auditability and break-glass handling
    Provide: secrets management configuration, rotation policies,
    IAM role definitions, and key management procedures.
```

Save the agent's output to `.security-hardening/10-secrets-management.md`.

Update `state.json`: set `current_step` to "checkpoint-3", add step 10 to `completed_steps`.

---

## PHASE CHECKPOINT 3 — User Approval Required

Display a summary of security controls from steps 8–10 and ask:

```
Security controls implementation complete. Please review:
- .security-hardening/08-auth-enhancement.md
- .security-hardening/09-infra-security.md
- .security-hardening/10-secrets-management.md

Auth controls: [summary]
Infrastructure controls: [summary]
Secrets management: [summary]

1. Approve — proceed to validation & compliance
2. Request changes — tell me what to adjust
3. Pause — save progress and stop here
```

Do NOT proceed to Phase 4 until the user approves.

---

## Phase 4: Validation & Compliance (Steps 11–13)

### Step 11: Penetration Testing & Validation

Read `.security-hardening/04-critical-fixes.md`, `.security-hardening/05-backend-hardening.md`, and `.security-hardening/08-auth-enhancement.md`.

Use the Task tool:

```
Task:
  subagent_type: "security-auditor"
  description: "Penetration testing and validation for $TARGET"
  prompt: |
    Execute comprehensive penetration testing for: $TARGET.

    Include:
    - target surface and in-scope assumptions
    - test categories and likely abuse paths
    - evidence requirements for findings
    - remediation validation expectations
    Provide: penetration test report, proof-of-concept exploits,
    remediation validation, and security control effectiveness metrics.
```

Save the agent's output to `.security-hardening/11-pentest-results.md`.

Update `state.json`: set `current_step` to 12, add step 11 to `completed_steps`.

### Step 12: Compliance & Standards Verification

Read `.security-hardening/11-pentest-results.md`.

Use the Task tool:

```
Task:
  subagent_type: "security-auditor"
  description: "Compliance verification for $TARGET"
  prompt: |
    Verify compliance with security frameworks for: $TARGET.

    Include:
    - applicable framework controls
    - evidence expected per control family
    - current gaps and compensating controls
    - concrete remediation work to close gaps
    Provide: compliance assessment report, gap analysis,
    remediation requirements, and audit evidence collection.
```

Save the agent's output to `.security-hardening/12-compliance-report.md`.

Update `state.json`: set `current_step` to 13, add step 12 to `completed_steps`.

### Step 13: Security Monitoring & SIEM Integration

Read `.security-hardening/09-infra-security.md` and `.security-hardening/12-compliance-report.md`.

Use the Task tool:

```
Task:
  subagent_type: "general-purpose"
  description: "Implement security monitoring and SIEM for $TARGET"
  prompt: |
    You are a security operations engineer specializing in SIEM and incident response.
    Implement security monitoring and SIEM integration for: $TARGET.
    Include:
    - log sources and normalization expectations
    - detection rules for the highest-risk behaviors
    - triage and escalation path
    - dashboards and alert fatigue controls
    Provide: SIEM configuration, correlation rules, incident response playbooks,
    security dashboards, and alert definitions.
```

Save the agent's output to `.security-hardening/13-monitoring-siem.md`.

Update `state.json`: set `current_step` to "complete", add step 13 to `completed_steps`.

---

## Completion

Update `state.json`:

- Set `status` to `"complete"`
- Set `last_updated` to current timestamp

Present the final summary:

```
Security hardening complete: $TARGET

## Output Files
- .security-hardening/01-vulnerability-scan.md
- .security-hardening/02-threat-model.md
- .security-hardening/03-architecture-review.md
- .security-hardening/04-critical-remediation.md
- .security-hardening/05-backend-controls.md
- .security-hardening/06-frontend-controls.md
- .security-hardening/07-authentication.md
- .security-hardening/08-secrets-management.md
- .security-hardening/09-monitoring-and-siem.md
3. Deploy monitoring configuration to production
4. Schedule regular security reviews
```
