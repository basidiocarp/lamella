---
name: strategy-execution-alignment
description: "Checks whether company strategy, team goals, and execution are aligned."
origin: lamella
---
# Strategy Execution Alignment

Use this skill to test whether strategy survives the cascade from leadership goals to team execution. It helps surface orphan goals, conflicting incentives, coverage gaps, and weak communication loops.

## When to Use

- Cascading company strategy into departmental or team OKRs
- Diagnosing teams that are pulling in different directions
- Reviewing quarterly plans for conflict or coverage gaps
- Running a strategy refresh after drift or reorganization

## Quick Start

Run the checker with sample data:

```bash
python scripts/alignment_checker.py
```

On Windows PowerShell:

```powershell
py -3 .\scripts\alignment_checker.py
```

To inspect the JSON input shape first:

```bash
python scripts/alignment_checker.py --sample
```

## Workflow

1. **Test strategy clarity**
   Ask people from different teams to state the top company priorities. If the answers diverge, fix the articulation before fixing the cascade.

2. **Map parent-child links**
   Trace company goals to department goals, then to team work. Every meaningful goal should have a parent.

3. **Detect failure modes**
   Look for:
   - orphan goals
   - conflicting goals
   - coverage gaps
   - local optimization and silos

4. **Run a cross-functional alignment review**
   Resolve gaps and conflicts in a workshop, not in a broadcast memo.

5. **Install recurring checks**
   Add an alignment review to quarterly planning and a lighter pulse during the quarter.

Use `references/alignment-playbook.md` for workshop structure and recurring alignment cadence. Use `scripts/alignment_checker.py` when the user can provide structured OKR data.

## Output Expectations

Produce:
- an alignment diagnosis
- a list of orphan, conflicting, or uncovered goals
- the required ownership or metric changes
- a recurring alignment cadence for the next quarter

## Quality Checklist

- [ ] Company priorities are stated clearly enough to repeat consistently
- [ ] Team goals can be traced to company goals
- [ ] Cross-functional conflicts are identified before quarter start
- [ ] Each company priority has explicit team support
- [ ] Alignment checks are part of the planning rhythm, not a one-off audit
