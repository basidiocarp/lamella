#!/usr/bin/env bash
# Source this file to get Claude Code envelope helpers

read_envelope() { INPUT=$(cat); }

tool_name() { printf '%s' "$INPUT" | jq -r '.tool_name // empty'; }
tool_input_command() { printf '%s' "$INPUT" | jq -r '.tool_input.command // empty'; }
tool_input_file_path() { printf '%s' "$INPUT" | jq -r '.tool_input.file_path // empty'; }
tool_input_content() { printf '%s' "$INPUT" | jq -r '.tool_input.content // empty'; }
tool_input_new_string() { printf '%s' "$INPUT" | jq -r '.tool_input.new_string // empty'; }
tool_input_url() { printf '%s' "$INPUT" | jq -r '.tool_input.url // empty'; }
tool_response_output() { printf '%s' "$INPUT" | jq -r '.tool_response.output // .tool_response.stdout // empty'; }

# emit_block and emit_warn are PreToolUse-only helpers.
# Do NOT call from PostToolUse, Stop, or SubagentStop hooks — the hookEventName and
# response shape are PreToolUse-specific and will be ignored or misinterpreted by
# other hook event types.
emit_block() { # usage: emit_block "reason"
    jq -n --arg reason "$1" \
      '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"block","permissionDecisionReason":$reason}}'
}
emit_warn() { # usage: emit_warn "message"
    jq -n --arg msg "$1" \
      '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"continue","reason":$msg}}'
}
