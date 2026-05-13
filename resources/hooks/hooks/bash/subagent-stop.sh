#!/bin/bash
# subagent-stop.sh
# Runs when a sub-agent completes
# Use for cleanup, logging, or metrics
#
# SubagentStop payload (flat, not a tool-use envelope):
#   {"hook_event_name":"SubagentStop","agent_id":"...","agent_type":"...","agent_transcript_path":"..."}

source "$(dirname "$0")/../../lib/envelope.sh"
read_envelope

# Read flat SubagentStop fields directly — no tool_input/tool_response here.
AGENT_ID=$(printf '%s' "$INPUT" | jq -r '.agent_id // "unknown"')
AGENT_TYPE=$(printf '%s' "$INPUT" | jq -r '.agent_type // "unknown"')

# Log subagent completion
LOG_DIR="$HOME/.claude/logs"
mkdir -p "$LOG_DIR"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

LOG_ENTRY=$(jq -n \
  --arg timestamp "$TIMESTAMP" \
  --arg agent_id "$AGENT_ID" \
  --arg agent_type "$AGENT_TYPE" \
  '{timestamp: $timestamp, agent_id: $agent_id, agent_type: $agent_type}')

echo "$LOG_ENTRY" >> "$LOG_DIR/subagents-$(date +%Y-%m-%d).jsonl"

# SubagentStop hooks do not block execution and do not use hookSpecificOutput.
# Emit nothing to stdout; log to file only. Exit 0 always.
exit 0
