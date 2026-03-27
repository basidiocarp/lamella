# Complete Workflows Reference

Use these patterns when you need an end-to-end swarm workflow rather than a
single delegation step.

## Workflow 1: Parallel Specialist Review

Use this when one artifact needs several independent reviews at the same time.

```text
1. Spawn team
2. Assign independent review tracks
3. Collect results
4. Synthesize findings
5. Shut down workers
```

Best fit:
- code review with security, architecture, and testing lenses
- document review with separate factual and editorial checks
- audits where findings can be gathered independently

Avoid it if every worker depends on the same evolving intermediate result.

## Workflow 2: Research -> Plan -> Implement -> Test

Use this when later work should start only after earlier outputs are ready.

```text
research -> planning -> implementation -> verification
```

Best fit:
- feature delivery with clear stage gates
- new integration work
- migrations where the plan needs to exist before code changes start

The key is explicit handoff artifacts between stages.

## Workflow 3: Self-Organizing Task Pool

Use this when many tasks are independent and workers can claim them from a pool.

```text
1. define a shared task pool
2. let workers claim tasks
3. monitor progress and rebalance only if needed
4. synthesize outputs at the end
```

Best fit:
- codebase-wide review sweeps
- many-file cleanup passes
- independent research tasks

This pattern fails when tasks have hidden dependencies or inconsistent finish
criteria.

## Choosing the Workflow

| Situation | Better workflow |
|---|---|
| same artifact, multiple lenses | parallel specialist review |
| staged delivery with dependencies | research -> plan -> implement -> test |
| many independent tasks | self-organizing task pool |

## Checklist

Before starting:
- choose the workflow shape deliberately
- define worker ownership
- define output format and handoff points

During execution:
- monitor for blocked tasks or scope drift
- keep synthesis centralized
- shut workers down once their slice is complete

After execution:
- collect outputs into one final artifact
- record any reusable workflow decisions

The workflow matters as much as the individual prompts. Pick the structure that
matches the dependency pattern.
