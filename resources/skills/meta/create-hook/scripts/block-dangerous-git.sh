#!/usr/bin/env bash
set -euo pipefail

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required for block-dangerous-git.sh" >&2
  exit 1
fi

payload="$(cat)"
command="$(printf '%s' "$payload" | jq -r '.tool_input.command // ""')"
normalized="$(printf '%s' "$command" | tr '\n' ' ' | tr -s '[:space:]' ' ')"

if [[ -z "$normalized" ]]; then
  exit 0
fi

if [[ "$normalized" =~ ^git[[:space:]]+push([[:space:]]|$) ]] ||
   [[ "$normalized" =~ ^git[[:space:]]+reset[[:space:]]+--hard([[:space:]]|$) ]] ||
   [[ "$normalized" =~ ^git[[:space:]]+clean[[:space:]]+-f(d)?([[:space:]]|$) ]] ||
   [[ "$normalized" =~ ^git[[:space:]]+branch[[:space:]]+-D([[:space:]]|$) ]] ||
   [[ "$normalized" =~ ^git[[:space:]]+checkout[[:space:]]+\.([[:space:]]|$) ]] ||
   [[ "$normalized" =~ ^git[[:space:]]+restore([[:space:]]+--staged)?([[:space:]]+--worktree)?[[:space:]]+\.([[:space:]]|$) ]]; then
  echo "Blocked dangerous git command: $command" >&2
  exit 2
fi

exit 0
