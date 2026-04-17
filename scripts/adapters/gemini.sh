#!/usr/bin/env bash
set -euo pipefail
input_file="$1"
output_dir="$2"
filename="$(basename "$input_file")"

# Rewrite tool names to Gemini equivalents.
# Uses perl for portable word-boundary support (BSD sed does not support \b).
perl -pe '
  s/\bRead\b/read_file/g;
  s/\bBash\b/run_shell_command/g;
  s/\bWrite\b/write_file/g;
  s/\bEdit\b/edit_file/g;
  s/\bGlob\b/list_files/g;
  s/\bGrep\b/search_files/g;
' "$input_file" > "$output_dir/$filename"
