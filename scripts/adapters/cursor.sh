#!/usr/bin/env bash
set -euo pipefail
input_file="$1"
output_dir="$2"
filename="$(basename "$input_file")"
# Replace underscores with hyphens, change extension to .mdc
mdc_name="${filename%.md}.mdc"
cp "$input_file" "$output_dir/$mdc_name"
