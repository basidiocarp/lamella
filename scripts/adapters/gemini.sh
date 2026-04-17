#!/usr/bin/env bash
set -euo pipefail
input_file="$1"
output_dir="$2"
filename="$(basename "$input_file")"

# Tool name rewriting table
sed \
    -e 's/\bRead\b/read_file/g' \
    -e 's/\bBash\b/run_shell_command/g' \
    -e 's/\bWrite\b/write_file/g' \
    -e 's/\bEdit\b/edit_file/g' \
    -e 's/\bGlob\b/list_files/g' \
    -e 's/\bGrep\b/search_files/g' \
    "$input_file" > "$output_dir/$filename"
