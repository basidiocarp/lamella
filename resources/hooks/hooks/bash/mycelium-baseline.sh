#!/bin/bash
# .claude/hooks/mycelium-baseline.sh
# Event: SessionStart
# Save Mycelium gain baseline for session-summary.sh delta tracking
#
# This hook captures Mycelium's cumulative stats at session start.
# At session end, session-summary.sh reads this baseline, captures current stats,
# and computes the delta to show per-session Mycelium savings.
#
# Configuration:
#   SESSION_SUMMARY_MYCELIUM=0  - Force disable (skip baseline capture)
#   SESSION_SUMMARY_MYCELIUM=1  - Force enable
#   (default: auto-detect if mycelium is in PATH)
#
# Place in: ~/.claude/hooks/mycelium-baseline.sh
# Register in: ~/.claude/settings.json under SessionStart event

set -euo pipefail

MYCELIUM_ENABLED="${SESSION_SUMMARY_MYCELIUM:-auto}"

# Auto-detect Mycelium availability
if [[ "$MYCELIUM_ENABLED" == "auto" ]]; then
    command -v mycelium &>/dev/null && MYCELIUM_ENABLED=1 || MYCELIUM_ENABLED=0
fi

# Skip if disabled or Mycelium not available
if [[ "$MYCELIUM_ENABLED" != "1" ]]; then
    exit 0
fi

# Build baseline file path (must match session-summary.sh)
baseline_key=$(echo "${CLAUDE_PROJECT_DIR:-$(pwd)}" | tr '/' '-')
baseline_file="/tmp/mycelium-baseline${baseline_key}.json"

# Capture current Mycelium cumulative stats
mycelium gain --format json > "$baseline_file" 2>/dev/null || true

exit 0
