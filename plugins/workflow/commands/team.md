---
description: "Multi-agent team orchestration - spawn, delegate, debug, feature development, review, and more"
argument-hint: "<subcommand> [args] -- Available: spawn, debug, delegate, feature, review, status, shutdown"
---

# Team Command

Orchestrate multi-agent teams. Requires `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`.

## Usage

```
/team spawn <preset> [--name N] [--members N]
/team debug <error-or-file> [--hypotheses N]
/team delegate [--assign task-id=member] [--message member 'msg']
/team feature <description> [--team-size N] [--branch name]
/team review <target> [--reviewers security,performance,architecture]
/team status [team-name] [--tasks] [--members]
/team shutdown [team-name] [--force]
```

## Subcommands

### spawn
Spawn a team using presets or custom composition.

**Presets:**
| Preset | Members | Purpose |
|--------|---------|---------|
| `review` | 3 | Security, performance, architecture reviewers |
| `debug` | 3 | Competing hypothesis investigators |
| `feature` | 3 | Lead + 2 implementers |
| `fullstack` | 4 | Lead + frontend/backend/test implementers |
| `security` | 4 | OWASP, auth, deps, secrets reviewers |

### debug
Debug using competing hypotheses with parallel investigation.
1. Triage: Analyze error/file
2. Hypothesize: Generate N competing hypotheses
3. Investigate: Spawn parallel investigators
4. Arbitrate: Compare findings, rank by confidence
5. Report: Root cause with citations

### delegate
Coordinate work across spawned team members.
- Assign tasks to specific members
- Send messages to members
- Rebalance workload

### feature
Parallel feature development with team.
- Spawns lead + implementers
- Creates feature branch
- Coordinates implementation across files

### review
Multi-perspective code review.
- Parallel reviewers for security, performance, architecture, testing
- Consolidated findings report

### status
Check team status, member states, and task progress.

### shutdown
Clean shutdown of team, completing or canceling tasks.

## Pre-flight Check

All subcommands verify:
```bash
if [ -z "$CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS" ]; then
  echo "Set CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 to use team features"
  exit 1
fi
```

## Execution

Parse first argument as subcommand, route to appropriate handler with remaining args.
