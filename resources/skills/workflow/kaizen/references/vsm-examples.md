# Value Stream Mapping Examples

## Example: Feature Development Value Stream Map

```
CURRENT STATE: Feature request → Production

Step 1: Requirements Gathering
├─ Processing: 2 days (meetings, writing spec)
├─ Waiting: 3 days (stakeholder review)
// ... (68 lines trimmed)
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
// ... (43 lines trimmed)
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
// ... (48 lines trimmed)
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
// ... (15 lines trimmed)
[Changes to make]

Target: [Current] → [Future] ([%] reduction)
```
