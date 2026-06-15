---
name: create-handoff
description: Create a structured handoff document with verification script
category: meta
version: 0.1.0
tags: [handoff, planning, delegation, verification]
origin: lamella
---

# Create Handoff

Create a handoff document following the ecosystem convention. Handoffs are
structured task specifications that agents can execute independently, with
machine-checkable verification gates.

## Convention

```
.handoffs/
├── HANDOFFS.md             # Active dashboard
├── <project>/              # Active repo-owned handoffs
├── cross-project/          # Active cross-repo handoffs
├── campaigns/              # Multi-step programs
└── archive/                # Completed work
```

Templates for this workflow live in the repo-level handoff template folder.

## Workflow

### 1. Determine project and topic

- Single project? → `.handoffs/<project>/<topic>.md`
- Multiple projects? → `.handoffs/cross-project/<topic>.md`
- Project directory must match an ecosystem project: canopy, mycelium,
  hyphae, rhizome, cortina, lamella, spore, stipe, cap, volva

### 2. Write the handoff

Follow the repo-level work-item handoff template:

- **Problem**: 1-3 sentences on what's broken or missing
- **What exists**: Current state of relevant code/features
- **Steps**: Each step has:
  - Project, effort estimate, dependencies
  - Files to modify with code snippets
  - Verification section with paste-output markers
  - Checklist of testable assertions
- **Completion Protocol**: References the verify script

**Three conventions to follow while authoring:**

1. **Clarification markers**: if a section is intentionally incomplete pending input, use `[NEEDS CLARIFICATION]`, `[TBD]`, or `[OPEN QUESTION]` inline. These are dispatch blockers — resolve and remove every marker before the handoff is dispatched.

2. **Execution freeze note**: the template includes a note after the Scope section stating that Problem/Scope/Intent are read-only once dispatched. Do not remove it. If an implementer discovers the plan is wrong mid-execution, they raise a flag — they do not rewrite the plan to fit the diff.

3. **Residual Work section**: the template includes a `## Residual Work` table between the last step and `## Completion`. After Stage 2 review, log every accepted-but-unfixed finding there with its disposition. An empty table is only valid when Stage 2 confirms zero open findings.

Every step MUST have:
```markdown
#### Verification

<!-- AGENT: Run the command and paste output between the markers -->
```bash
[specific verification command]
```

**Output:**
<!-- PASTE START -->

<!-- PASTE END -->
```

### 3. Create the verify script

Create `verify-<topic>.sh` in the same directory as the handoff.

Structure:
```bash
#!/bin/bash
# Verification script for <topic>.md
# Run: bash .handoffs/<project>/verify-<topic>.sh

set -euo pipefail
PASS=0
FAIL=0
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"

check() {
  local desc="$1"
  local cmd="$2"
  if eval "$cmd" >/dev/null 2>&1; then
    echo "  PASS: $desc"
    ((PASS++))
  else
    echo "  FAIL: $desc"
    ((FAIL++))
  fi
}

echo "=== <TOPIC> Verification ==="
echo ""

# One check() call per checklist item from the handoff
check "description of what to verify" \
  "command that returns 0 on success"

echo ""
echo "================================"
echo "Results: $PASS passed, $FAIL failed"
[ "$FAIL" -eq 0 ] || exit 1
```

Rules for verify scripts:
- One `check()` per checklist item in the handoff
- Use `grep -q` for code presence checks
- Use `test -f` for file existence checks
- Use `cargo test --quiet` for build verification
- Exit 1 on any failure
- Print "Results: N passed, M failed" as the last line
- Make executable: `chmod +x verify-<topic>.sh`

### 4. Update the index

Add an entry to `.handoffs/HANDOFFS.md` under the appropriate project section:

```markdown
| [Topic Name](project/topic.md) | Ready | Priority | Dependencies |
```

### 5. Validate

Before considering the handoff complete:
- [ ] File is at `.handoffs/<project>/<topic>.md`
- [ ] Verify script is at `.handoffs/<project>/verify-<topic>.sh`
- [ ] Verify script is executable
- [ ] Verify script has one check per checklist item
- [ ] HANDOFFS.md index updated
- [ ] Handoff follows the work-item template format
- [ ] Every step has specific files to modify
- [ ] Every step has a verification section

## Anti-Patterns

- Do NOT create handoffs in the `.handoffs/` root — use project subdirectories
- Do NOT use the `HANDOFF-` prefix — the directory provides context
- Do NOT skip the verify script — it's the enforcement mechanism
- Do NOT write vague checklists like "code works" — each item must be
  checkable by grep, test, or a command
- Do NOT forget to update HANDOFFS.md — agents reading the index need
  to discover your handoff
