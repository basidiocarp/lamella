#!/bin/bash
# =============================================================================
# Unicode Injection Scanner Hook
# =============================================================================
# Event: PreToolUse (runs before Edit/Write operations)
# Purpose: Detect invisible Unicode characters used for prompt injection
#
# Checks for:
#   - Zero-width characters (U+200B-U+200D, U+FEFF)
#   - RTL/LTR override (U+202A-U+202E, U+2066-U+2069)
#   - ANSI escape sequences (terminal injection)
#   - Null bytes (truncation attacks)
#   - Tag characters (U+E0000-U+E007F)
#   - Overlong UTF-8 sequences
#   - Homoglyph characters (Cyrillic/Greek mixed with Latin)
#
# Uses Node.js for Unicode detection (always available with Claude Code).
# Exit codes:
#   0 = allow (no injection detected)
#   2 = block (injection detected, stderr message shown to Claude)
#
# References:
#   - CVE-2025-53109/53110: Unicode-based sandbox escape
#   - Arxiv 2509.22040: Prompt Injection on Coding Assistants
# =============================================================================

set -euo pipefail

source "$(dirname "$0")/../../lib/envelope.sh"
read_envelope

TOOL_NAME=$(tool_name)

# Only check Edit and Write tools
case "$TOOL_NAME" in
    Edit|Write)
        ;;
    *)
        exit 0
        ;;
esac

# Extract content to analyze
CONTENT=""
case "$TOOL_NAME" in
    Write)
        CONTENT=$(tool_input_content)
        ;;
    Edit)
        CONTENT=$(tool_input_new_string)
        ;;
esac

# Skip if no content
[[ -z "$CONTENT" ]] && exit 0

# Use Node.js for all Unicode detection (reliable cross-platform)
RESULT=$(printf '%s' "$CONTENT" | node -e '
let data = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", chunk => data += chunk);
process.stdin.on("end", () => {
  const issues = [];

  // Zero-width characters (U+200B-U+200D, U+FEFF)
  if (/[\u200B-\u200D\uFEFF]/.test(data)) {
    issues.push("BLOCKED: Zero-width characters detected (U+200B-U+200D or BOM). These can hide malicious instructions.");
  }

  // Bidirectional text overrides (U+202A-U+202E, U+2066-U+2069)
  if (/[\u202A-\u202E\u2066-\u2069]/.test(data)) {
    issues.push("BLOCKED: Bidirectional text override detected (U+202A-U+202E). These can disguise malicious commands.");
  }

  // ANSI escape sequences
  if (/\x1b[\[\]\(]/.test(data)) {
    issues.push("BLOCKED: ANSI escape sequence detected. These can manipulate terminal display.");
  }

  // Null bytes
  if (/\x00/.test(data)) {
    issues.push("BLOCKED: Null byte detected. These can cause string truncation attacks.");
  }

  // Tag characters (U+E0000-U+E007F)
  if (/[\uDB40][\uDC00-\uDC7F]/.test(data)) {
    issues.push("BLOCKED: Unicode tag characters detected (U+E0000-E007F). These can embed invisible data.");
  }

  // Overlong UTF-8 sequences (check raw bytes via Buffer)
  const buf = Buffer.from(data, "utf8");
  for (let i = 0; i < buf.length - 1; i++) {
    if ((buf[i] === 0xC0 || buf[i] === 0xC1) && buf[i+1] >= 0x80 && buf[i+1] <= 0xBF) {
      issues.push("BLOCKED: Overlong UTF-8 sequence detected. These can bypass security filters.");
      break;
    }
  }

  // Homoglyphs: Cyrillic characters that look like Latin
  const hasCyrillic = /[\u0430\u0435\u043E\u0440\u0441\u0445]/.test(data);
  const hasGreekWithLatin = /[\u0391-\u03C9]/.test(data) && /[a-zA-Z]/.test(data);
  if (hasCyrillic || hasGreekWithLatin) {
    console.log("WARN:Potential homoglyph characters detected (Cyrillic/Greek mixed with Latin). Verify this is not an attempt to bypass filters.");
  }

  if (issues.length > 0) {
    // Print first blocking issue
    console.log("BLOCK:" + issues[0]);
  } else {
    console.log("OK");
  }
});
')

case "$RESULT" in
    BLOCK:*)
        echo "${RESULT#BLOCK:}" >&2
        exit 2
        ;;
    WARN:*)
        echo "{\"systemMessage\": \"Warning: ${RESULT#WARN:}\"}"
        exit 0
        ;;
    *)
        exit 0
        ;;
esac
