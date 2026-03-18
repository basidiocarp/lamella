#!/bin/bash
# PostToolUse hook: warn when edited files contain inline-dash comment headers
# Detects: # ── TEXT ─────  or  // ── TEXT ─────
# Suggests: boxed style with 80-char bars

set -e

# Read hook input from stdin
INPUT=$(cat)

# Extract the file path from the tool input
FILE_PATH=$(echo "$INPUT" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    # Edit tool
    fp = data.get('tool_input', {}).get('file_path', '')
    if not fp:
        # Write tool
        fp = data.get('tool_input', {}).get('file_path', '')
    print(fp)
except:
    pass
" 2>/dev/null)

if [[ -z "$FILE_PATH" || ! -f "$FILE_PATH" ]]; then
    echo "$INPUT"
    exit 0
fi

# Check for inline-dash comment style (# ── TEXT ─── or // ── TEXT ───)
MATCHES=$(grep -n '^\s*\(#\|//\) ─\{2,\}\s\+.\+\s\+─\{3,\}' "$FILE_PATH" 2>/dev/null || true)

if [[ -n "$MATCHES" ]]; then
    COUNT=$(echo "$MATCHES" | wc -l | tr -d ' ')
    echo "[Hook] Found $COUNT inline-dash comment(s) in $FILE_PATH" >&2
    echo "[Hook] Use boxed style instead:" >&2
    echo "[Hook]   # ─────────────────────────────────────────────────────────────────────────────" >&2
    echo "[Hook]   # Section Name" >&2
    echo "[Hook]   # ─────────────────────────────────────────────────────────────────────────────" >&2
    echo "$MATCHES" | head -3 | while read -r line; do
        echo "[Hook]   → $line" >&2
    done
fi

# Always pass through (non-blocking)
echo "$INPUT"
exit 0
