# Mobile Checkpoint and Resume

Long-running agents need explicit checkpointing on mobile because the app can
be suspended or terminated at any time.

## State Model

Use a small session state machine:

- `idle`
- `running`
- `waiting_for_user`
- `backgrounded`
- `blocked`
- `completed`

Checkpoint whenever the app backgrounds or the agent finishes a meaningful
subtask.

## Checkpoint Shape

```json
{
  "session_id": "sess_123",
  "agent_type": "research",
  "state": "backgrounded",
  "completed_tasks": ["collect sources", "download notes"],
  "pending_tasks": ["draft summary"],
  "last_summary": "Two sources were saved into artifacts/"
}
```

Keep the checkpoint small. Store large artifacts in files and reference them by
path.

## Resume Flow

1. Detect resumable checkpoints on launch.
2. Ask the user whether to resume or discard them.
3. Restore the task list, summary, and current state.
4. Re-read files from disk instead of trusting stale in-memory objects.
5. Continue from the next unfinished task.

## Background Time

Use limited background execution only for save-and-exit or other critical
cleanup work. Do not design the product around indefinite background runtime on
iOS.

## User-Facing Status

Always show one of these states clearly:

- working now
- paused waiting for input
- saved for resume
- blocked and needs attention
