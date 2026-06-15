# Message Formats Reference

Complete reference for all message types used in swarm communication.

---

## Regular Message

Basic text communication between agents:

```json
{
  "from": "team-lead",
  "text": "Please prioritize the auth module",
  "timestamp": "2026-01-25T23:38:32.588Z",
  "read": false
}
```

---

## Structured Messages

All structured messages are JSON encoded in the `text` field.

### Shutdown Request

Sent by leader to request teammate shutdown:

```json
{
  "type": "shutdown_request",
  "requestId": "shutdown-abc123@worker-1",
  "from": "team-lead",
  "reason": "All tasks complete",
  "timestamp": "2026-01-25T23:38:32.588Z"
}
```

### Shutdown Approved

Sent by teammate confirming shutdown:

```json
{
  "type": "shutdown_approved",
  "requestId": "shutdown-abc123@worker-1",
  "from": "worker-1",
  "paneId": "%5",
  "backendType": "in-process",
  "timestamp": "2026-01-25T23:39:00.000Z"
}
```

### Idle Notification

Auto-sent when teammate stops working:

```json
{
  "type": "idle_notification",
  "from": "worker-1",
  "timestamp": "2026-01-25T23:40:00.000Z",
  "completedTaskId": "2",
  "completedStatus": "completed"
}
```

### Task Completed

Sent when a task is finished:

```json
{
  "type": "task_completed",
  "from": "worker-1",
  "taskId": "2",
  "taskSubject": "Review authentication module",
  "timestamp": "2026-01-25T23:40:00.000Z"
}
```

### Plan Approval Request

Sent by teammate needing plan approval:

```json
{
  "type": "plan_approval_request",
  "from": "architect",
  "requestId": "plan-xyz789",
  "planContent": "# Implementation Plan\n\n1. ...",
  "timestamp": "2026-01-25T23:41:00.000Z"
}
```

### Join Request

Sent by agent wanting to join team:

```json
{
  "type": "join_request",
  "proposedName": "helper",
  "requestId": "join-abc123",
  "capabilities": "Code review and testing",
  "timestamp": "2026-01-25T23:42:00.000Z"
}
```

### Permission Request

For sandbox/tool permissions:

```json
{
  "type": "permission_request",
  "requestId": "perm-123",
  "workerId": "worker-1@my-project",
  "workerName": "worker-1",
  "workerColor": "#4A90D9",
  "toolName": "Bash",
  "toolUseId": "toolu_abc123",
  "description": "Run npm install",
  "input": {"command": "npm install"},
  "permissionSuggestions": ["Bash(npm *)"],
  "createdAt": 1706000000000
}
```

---

## Message Type Summary

| Type | Sender | Recipient | Purpose |
|------|--------|-----------|---------|
| (regular) | Any | Any | General communication |
| `shutdown_request` | Leader | Teammate | Request exit |
| `shutdown_approved` | Teammate | Leader | Confirm exit |
| `idle_notification` | Teammate | Leader | Auto-sent on idle |
| `task_completed` | Teammate | Leader | Task done notification |
| `plan_approval_request` | Teammate | Leader | Request plan approval |
| `join_request` | Agent | Leader | Request to join team |
| `permission_request` | Teammate | Leader | Request tool permission |

---

## Reading Messages

Check your inbox:

```bash
cat ~/.claude/teams/{team}/inboxes/{agent}.json | jq '.'
```

Watch for new messages:

```bash
tail -f ~/.claude/teams/{team}/inboxes/team-lead.json
```
