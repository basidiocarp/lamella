# Context Health Monitoring Workflow

Long-running agent sessions degrade over time. This workflow checks for that drift and triggers intervention.

## When to Use

- sessions longer than about 20 turns
- signs of degraded recall or repeated mistakes
- before critical decisions

## Health Check Pattern

### Step 1: Symptom Detection

Every N turns, run a focused health check:

```markdown
<TASK>
Analyze recent conversation history for signs of context degradation.
</TASK>

<RECENT_HISTORY>
{recent_history}
</RECENT_HISTORY>

<OUTPUT_FORMAT>
HEALTH_STATUS: [HEALTHY | DEGRADED | CRITICAL]
RECOMMENDED_ACTION: [CONTINUE | COMPACT | RESTART]
SPECIFIC_ISSUES: [brief evidence]
</OUTPUT_FORMAT>
```

### Step 2: Automated Intervention

If status is degraded or critical:
1. preserve essential state in a file
2. recommend compaction or restart
3. resume with the preserved state loaded explicitly

## Verification Guidelines

- keep health checks focused
- use structured output
- run them at natural checkpoints, not every turn
