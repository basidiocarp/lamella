# Context Health Monitoring Workflow

Long-running agent sessions accumulate context that degrades over time. This workflow monitors context health and triggers intervention.

## When to Use

- During long-running agent sessions (>20 turns)
- When agents start exhibiting degradation symptoms
- As a periodic health check in agent orchestration systems
- Before critical decision points in agent workflows

## Health Check Pattern

### Step 1: Periodic Symptom Detection

Every N turns (recommended: every 10 turns), spawn a health check agent:

```markdown
<TASK>
Analyze the recent conversation history for signs of context degradation.
</TASK>

<RECENT_HISTORY>
// ... (35 lines trimmed)
RECOMMENDED_ACTION: [CONTINUE | COMPACT | RESTART]
SPECIFIC_ISSUES: [detailed description of problems found]
</OUTPUT_FORMAT>
```

### Step 2: Automated Intervention

Based on health status, trigger appropriate intervention:

```markdown
IF HEALTH_STATUS == "DEGRADED" or HEALTH_STATUS == "CRITICAL":
  <RESTART_INTERVENTION>
  1. Extract essential state to preserve and save to a file
  2. Ask user to start a new session with clean context and load the preserved state from the file after the new session is started
  </RESTART_INTERVENTION>
```

## Guidelines for Multi-Agent Verification

1. Spawn verification agents with focused, single-purpose prompts
2. Use structured output formats for reliable parsing
3. Set clear thresholds for action vs. continue decisions
4. Log all verification results for debugging and optimization
5. Balance verification overhead against error prevention value
6. Implement verification at natural checkpoints, not every turn
7. Use lighter-weight checks for routine operations, heavier for critical ones
8. Design verification to be skippable in time-critical scenarios
