#!/usr/bin/env bash

set -euo pipefail

if [[ $# -ne 2 ]]; then
    echo "Usage: $0 <changelog-path> <version>" >&2
    exit 1
fi

changelog_path="$1"
version="$2"

awk -v version="$version" '
    BEGIN {
        in_section = 0
        matches = 0
    }
    $0 ~ "^## \\[" version "\\] - [0-9]{4}-[0-9]{2}-[0-9]{2}$" {
        in_section = 1
        matches++
        print
        next
    }
    /^## \[/ {
        if (in_section) {
            exit
        }
    }
    in_section {
        print
    }
    END {
        if (matches == 0) {
            exit 2
        }
        if (matches > 1) {
            exit 3
        }
    }
' "$changelog_path"
