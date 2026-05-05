#!/usr/bin/env bash

# Gemini CLI Session-End Hook
# Captures session end events and reports to Cortina for lifecycle signal capture.
# This is a thin wrapper that delegates to cortina's event normalization.
#
# Cortina reuses its existing claude-code hook-event normalization for compatibility.
# If Cortina is unavailable, this hook exits cleanly (fail-open policy).

set -euo pipefail

# Read hook input from stdin
HOOK_INPUT=$(cat)

# Extract required fields from the Claude Code hook envelope
CWD=$(echo "$HOOK_INPUT" | jq -r '.cwd // empty' 2>/dev/null || echo "")
SESSION_ID=$(echo "$HOOK_INPUT" | jq -r '.session_id // empty' 2>/dev/null || echo "")
TRANSCRIPT_PATH=$(echo "$HOOK_INPUT" | jq -r '.transcript_path // empty' 2>/dev/null || echo "")

# If critical fields are missing, exit gracefully (cortina uses defaults)
if [[ -z "$CWD" ]]; then
  exit 0
fi

# Try to invoke cortina to record the session-end event.
# This uses the claude-code adapter's hook-event dispatcher for signal normalization.
# Cortina is expected to be installed and in PATH.
#
# If cortina is unavailable, the hook exits 0 (fail-open).
if ! command -v cortina &> /dev/null; then
  # Cortina not in PATH; skip event capture
  exit 0
fi

# Build the normalized event payload for cortina to ingest.
# This mimics the claude-code hook envelope structure.
EVENT_PAYLOAD=$(jq -n \
  --arg cwd "$CWD" \
  --arg session_id "$SESSION_ID" \
  --arg transcript_path "$TRANSCRIPT_PATH" \
  '{
    "hook_type": "Stop",
    "cwd": $cwd,
    "session_id": $session_id,
    "transcript_path": $transcript_path
  }')

# Attempt to send the event to cortina.
# If cortina fails or is not installed, catch the error and exit cleanly.
if echo "$EVENT_PAYLOAD" | cortina adapter claude-code hook-event Stop 2>/dev/null; then
  exit 0
else
  # Cortina not available or failed; fail-open (do not block session exit)
  exit 0
fi
