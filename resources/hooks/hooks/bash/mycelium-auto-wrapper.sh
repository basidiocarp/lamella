#!/bin/bash
# Mycelium Auto-Wrapper Hook
# Suggests Mycelium for high-verbosity commands that already have a compact wrapper
#
# Hook: PreToolUse
# Matcher: Bash
# Purpose: Intercept bash commands and suggest the Mycelium wrapper when applicable
#
# Installation:
# 1. Copy to .claude/hooks/bash/mycelium-auto-wrapper.sh
# 2. Make executable: chmod +x .claude/hooks/bash/mycelium-auto-wrapper.sh
# 3. Add to settings.json:
#    {
#      "hooks": {
#        "PreToolUse": [{
#          "matcher": "Bash",
#          "hooks": [".claude/hooks/bash/mycelium-auto-wrapper.sh"]
#        }]
#      }
#    }
#
# Or install Mycelium and use its own setup flow where appropriate.

# Check if Mycelium is installed
if ! command -v mycelium &> /dev/null; then
    # Mycelium not installed, skip silently
    exit 0
fi

source "$(dirname "$0")/../../lib/envelope.sh"
read_envelope

# Parse tool input to get the bash command
COMMAND=$(tool_input_command)

if [ -z "$COMMAND" ]; then
    # No command found, continue
    exit 0
fi

# Define Mycelium-supported commands with example savings
declare -A MYCELIUM_COMMANDS=(
    ["git log"]="92.3"
    ["git status"]="76.0"
    ["git diff"]="55.9"
    ["find"]="76.3"
    ["ls"]="70.0"
    ["grep"]="70.0"
    ["cargo test"]="90.0"
    ["cargo build"]="80.0"
    ["cargo clippy"]="80.0"
    ["pnpm list"]="82.0"
    ["pnpm outdated"]="90.0"
    ["npm list"]="80.0"
    ["pytest"]="90.0"
    ["go test"]="90.0"
)

# Check if command matches a Mycelium-supported pattern
for cmd in "${!MYCELIUM_COMMANDS[@]}"; do
    if [[ "$COMMAND" == "$cmd"* ]] && [[ "$COMMAND" != "mycelium "* ]]; then
        savings="${MYCELIUM_COMMANDS[$cmd]}"

        # Suggest Mycelium wrapper
        cat << EOF
Mycelium Optimization Available

Command: $COMMAND
Suggested: mycelium $COMMAND
Token Savings: ~${savings}%

Use the Mycelium wrapper when you want the result, not every raw line.
EOF

        # Modify command to use Mycelium
        # Note: This is informational only - actual command modification
        # requires additionalContext return (Claude Code v2.1.9+)

        # For now, just inform user
        exit 0
    fi
done

# Continue with original command
exit 0
