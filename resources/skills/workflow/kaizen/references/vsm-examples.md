# Value Stream Mapping Examples

## Example: Feature Development Value Stream Map

```
CURRENT STATE: Feature request → Production

Step 1: Requirements Gathering
├─ Processing: 2 days (meetings, writing spec)
├─ Waiting: 3 days (stakeholder review)
├─ Output: approved scope

Step 2: Implementation
├─ Processing: 4 days (coding and unit tests)
├─ Waiting: 2 days (PR review queue)
├─ Rework: 1 day (late feedback)

Step 3: QA
├─ Processing: 2 days (manual regression)
├─ Waiting: 2 days (environment access)
├─ Output: release signoff

Step 4: Release
├─ Processing: 0.5 day (deploy + smoke test)
├─ Waiting: 1 day (release window)

BOTTLENECKS:
1. Review queue delay
2. Manual regression cycle
3. Fixed release windows

IMPROVEMENTS:
Week 1: Break work into smaller PRs
Week 2: Automate test suite
Week 3: Enable continuous staging deployment
Week 4: Train team on incremental delivery
```

---

## Example: Incident Response Value Stream Map

```
CURRENT STATE: Incident detected → Resolution

Step 1: Detection
├─ Processing: 0 min (automated alert)
├─ Waiting: 15 min (until someone sees alert)

Step 2: Triage
├─ Processing: 20 min (scope impact, assign lead)
├─ Waiting: 10 min (assemble responders)

Step 3: Mitigation
├─ Processing: 45 min (rollback or feature flag)
├─ Waiting: 30 min (approval or access)

Step 4: Recovery
├─ Processing: 30 min (verify service health)
├─ Waiting: 20 min (customer comms and monitoring)

BOTTLENECKS:
1. Alert acknowledgment lag
2. Access approval during incidents
3. Manual rollback coordination

IMPROVEMENTS:
5. Automated rollback for deployment incidents

Projected improvement: 230min → 120min (48% faster)
```

---

## Example: Customer Onboarding Value Stream Map

```
CURRENT STATE: Signed contract → Active customer

Step 1: Contract Signed
├─ Processing: 0 (trigger)
├─ Waiting: 2 days (sales to CS handoff)

Step 2: Implementation Kickoff
├─ Processing: 1 day (requirements review)
├─ Waiting: 3 days (customer scheduling)

Step 3: Provisioning
├─ Processing: 2 days (tenant setup, permissions)
├─ Waiting: 4 days (manual approvals)

Step 4: Training and Launch
├─ Processing: 3 days (training, data import, go-live)
├─ Waiting: 4 days (customer readiness)

BOTTLENECKS:
1. Slow internal handoff
2. Manual provisioning approvals
3. Customer scheduling gaps

IMPROVEMENTS:
4. Automated account provisioning

Target: 19 days → 7 days (63% reduction)
```

---

## VSM Template

```
CURRENT STATE: [Start] → [End]

Step N: [Name]
├─ Processing: [Time] ([Work description])
├─ Waiting: [Time] ([Reason for wait])
├─ Rework: [Time] ([Fixes, clarifications, retries])

BOTTLENECKS:
1. [Largest delay]
2. [Second largest delay]

[Changes to make]

Target: [Current] → [Future] ([%] reduction)
```
