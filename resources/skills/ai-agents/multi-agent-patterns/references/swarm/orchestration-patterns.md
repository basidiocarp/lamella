# Orchestration Patterns Reference

Use this page to choose the swarm shape. The detailed examples are split so you can load the pattern family that matches the job instead of one oversized catalog.

## Reference Map

| Need | Load |
|------|------|
| Parallel specialists and pipeline execution | [parallel-and-pipeline.md](parallel-and-pipeline.md) |
| Swarm task pools, research-before-build, and approval gates | [swarm-research-and-approval.md](swarm-research-and-approval.md) |
| Coordinated multi-file refactors and dependency-aware tasking | [refactor-coordination.md](refactor-coordination.md) |

## Pattern Selection Guide

| Scenario | Pattern |
|----------|---------|
| Multiple independent perspectives | Parallel specialists |
| Strict stage ordering | Pipeline |
| Many same-shaped tasks | Swarm |
| Need research before acting | Research + implementation |
| High-risk changes requiring review | Plan approval |
| Cross-file refactors with handoffs | Coordinated refactoring |
