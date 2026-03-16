# Error Handling Reference

Common errors, debugging techniques, and graceful shutdown procedures.

---

## Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Cannot cleanup with active members" | Teammates still running | `requestShutdown` all teammates first, wait for approval |
| "Already leading a team" | Team already exists | `cleanup` first, or use different team name |
| "Agent not found" | Wrong teammate name | Check `config.json` for actual names |
| "Team does not exist" | No team created | Call `spawnTeam` first |
| "team_name is required" | Missing team context | Provide `team_name` parameter |
| "Agent type not found" | Invalid subagent_type | Check available agents with proper prefix |

---

## Graceful Shutdown Sequence

**Always follow this sequence:**

```javascript
// 1. Request shutdown for all teammates
Teammate({ operation: "requestShutdown", target_agent_id: "worker-1" })
Teammate({ operation: "requestShutdown", target_agent_id: "worker-2" })

// 2. Wait for shutdown approvals
// Check for {"type": "shutdown_approved", ...} messages

// 3. Verify no active members
// Read ~/.claude/teams/{team}/config.json

// 4. Only then cleanup
Teammate({ operation: "cleanup" })
```

---

## Handling Crashed Teammates

Teammates have a 5-minute heartbeat timeout. If a teammate crashes:

1. They'll be automatically marked as inactive after timeout
2. Their tasks remain in the task list
3. Another teammate can claim their tasks
4. Cleanup will work after timeout expires

---

## Debugging Commands

```bash
# Check team config
cat ~/.claude/teams/{team}/config.json | jq '.members[] | {name, agentType, backendType}'

# Check teammate inboxes
cat ~/.claude/teams/{team}/inboxes/{agent}.json | jq '.'

# List all teams
ls ~/.claude/teams/

# Check task states
cat ~/.claude/tasks/{team}/*.json | jq '{id, subject, status, owner, blockedBy}'

# Watch for new messages
tail -f ~/.claude/teams/{team}/inboxes/team-lead.json
```

---

## Retry Strategies

### For Task Failures

```javascript
// Build retry into worker prompts
prompt: `
  ...do the work...

  If you encounter an error:
  1. Log the error details
  2. Wait 10 seconds
  3. Retry up to 3 times
  4. If still failing, send error report to team-lead and mark task as blocked
`
```

### For Communication Failures

```javascript
// Check inbox after sending
Teammate({ operation: "write", target_agent_id: "worker-1", value: "..." })

// Verify delivery by checking their response
// If no response within timeout, retry or escalate
```

---

## Recovery Patterns

### Orphaned Tasks

If a worker crashes mid-task:

```javascript
// 1. Find orphaned tasks
TaskList()  // Look for in_progress tasks with no recent updates

// 2. Reset task status
TaskUpdate({ taskId: "X", status: "pending", owner: null })

// 3. Another worker can claim it
```

### Stuck Teams

If cleanup fails:

```bash
# Manual cleanup (use with caution)
rm -rf ~/.claude/teams/{team-name}/
rm -rf ~/.claude/tasks/{team-name}/
```

---

## Prevention Tips

1. **Always use meaningful names** - easier to debug
2. **Log liberally in prompts** - "Log your progress every 30 seconds"
3. **Set reasonable timeouts** - don't let workers run forever
4. **Check inbox regularly** - catch issues early
5. **Use task dependencies** - prevent race conditions
