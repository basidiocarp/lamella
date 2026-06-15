---
name: incident-commander
description: "Coordinates live incident response with severity classification, role separation, communication cadence, and timeline reconstruction."
origin: lamella
---

# Incident Commander

Use this skill for the live-response side of incident management.
Hand the post-incident writeup to `postmortem-writing` once the system is stable.

## Workflow

1. Classify severity with `scripts/incident_classifier.py`.
2. Assign incident roles and set the update cadence.
3. Create one command channel and keep decisions flowing through it.
4. Reconstruct or maintain the timeline with `scripts/timeline_reconstructor.py`.
5. Hand the final timeline and decisions to `postmortem-writing` and update `runbook-generator` if the response exposed gaps.

## Commands

Classify an incident from a JSON file:

```bash
python3 scripts/incident_classifier.py --input incident.json --format text
```

Classify from stdin:

```bash
echo "Payment API is timing out for most users" | python3 scripts/incident_classifier.py --format text
```

Reconstruct a timeline:

```bash
python3 scripts/timeline_reconstructor.py --input events.json --gap-analysis --format markdown
```

PowerShell equivalents:

```powershell
Get-Content .\incident.json | python scripts\incident_classifier.py --format text
python scripts\timeline_reconstructor.py --input .\events.json --gap-analysis --format markdown
```

## Rules

- The incident commander should coordinate, not debug.
- Keep one decision channel. Avoid DM-driven incident response.
- Announce the next update time even when there is no new diagnosis yet.
- Bias toward containing customer impact first, then narrowing root cause.
- Hand off live artifacts cleanly to `postmortem-writing` instead of rebuilding the story later.

## References

- `references/incident-response-framework.md`
- `references/incident-severity-matrix.md`
- `references/communication-templates.md`
