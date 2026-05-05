#!/usr/bin/env bash
set -euo pipefail

# Validate agents manifest (if present).
#
# Lamella does NOT currently have a dedicated agent manifest file.
# This script checks if resources/agents/ directory or resources/agents.json exists.
# If neither exists, it emits empty findings and exits 0.
#
# If found in future, rules would be:
# - agent-001 MUST: every agent entry has a name field
# - agent-002 MUST: every agent entry has a description field

AGENTS_DIR="resources/agents"
AGENTS_JSON="resources/agents.json"

# If neither agents directory nor agents.json exists, return empty findings
if [ ! -d "$AGENTS_DIR" ] && [ ! -f "$AGENTS_JSON" ]; then
    cat <<EOF
{
  "validator": "validate-agents",
  "findings": []
}
EOF
    exit 0
fi

# Placeholder: future validation rules would go here
# For now, always emit empty findings since no agent manifest exists yet

cat <<EOF
{
  "validator": "validate-agents",
  "findings": []
}
EOF

exit 0
