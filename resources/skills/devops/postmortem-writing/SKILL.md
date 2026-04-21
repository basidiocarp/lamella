---
name: postmortem-writing
description: "Writes effective blameless postmortems with root cause analysis, timelines, and action items."
origin: lamella
---

# Postmortem Writing

Use this skill to turn an incident record into a blameless postmortem that supports learning and follow-through. Keep the main skill focused on structure, facilitation, and action quality.

## When to Use

- Writing a postmortem after an outage, security incident, or serious near miss
- Facilitating a blameless review meeting
- Converting incident timelines into a durable learning artifact
- Creating follow-up actions that should survive beyond the meeting

## Core Rules

1. Focus on conditions and system behavior, not individual blame.
2. Use exact times, symptoms, and remediation steps.
3. Separate contributing factors from root causes.
4. Every significant postmortem should end with owned follow-up work.

## Required Sections

- Executive summary
- Impact
- Timeline
- Root cause and contributing factors
- Detection and response analysis
- Lessons learned
- Action items with owners and expected outcome

## Core Workflow

1. Build the timeline from incident artifacts before the meeting.
2. Draft impact and symptoms in plain language.
3. Analyze causes with a method such as 5 Whys where appropriate.
4. Run the review in a blameless frame and capture dissenting interpretations.
5. Finalize action items as prevention, detection, mitigation, or recovery work.

## Short Template

```markdown
# Postmortem: [Incident]

## Summary

## Impact

## Timeline

## Root Cause

## Contributing Factors

## Detection and Response

## Lessons Learned

## Action Items
```
