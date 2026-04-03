#!/usr/bin/env bash
#
# content-root.sh - Resolve the content root directory for lamella resources
#
# Provides CONTENT_ROOT, defaulting to "resources/" within the lamella repo.
# Override via the LAMELLA_CONTENT_ROOT environment variable to read content
# from an external directory (e.g., a sibling lamella-skills/ repo).
#
# Usage (source in any shell script that needs resource paths):
#   source "$(dirname "${BASH_SOURCE[0]}")/../lib/content-root.sh"
#   local src="$CONTENT_ROOT/skills/$item"
#

# Derive BASE_DIR relative to this file (scripts/lib/ -> repo root)
_CONTENT_ROOT_BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# LAMELLA_CONTENT_ROOT can be absolute or relative to BASE_DIR.
# Default: resources/ (backward compatible).
if [[ -n "${LAMELLA_CONTENT_ROOT:-}" ]]; then
    if [[ "$LAMELLA_CONTENT_ROOT" == /* ]]; then
        CONTENT_ROOT="$LAMELLA_CONTENT_ROOT"
    else
        CONTENT_ROOT="$_CONTENT_ROOT_BASE_DIR/$LAMELLA_CONTENT_ROOT"
    fi
else
    CONTENT_ROOT="$_CONTENT_ROOT_BASE_DIR/resources"
fi

export CONTENT_ROOT
