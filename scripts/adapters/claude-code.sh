#!/usr/bin/env bash
set -euo pipefail
input_file="$1"
output_dir="$2"
filename="$(basename "$input_file")"
cp "$input_file" "$output_dir/$filename"
