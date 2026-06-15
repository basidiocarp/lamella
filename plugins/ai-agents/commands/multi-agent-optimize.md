# Multi-Agent Optimization

Optimize performance across a multi-agent system by profiling bottlenecks, improving coordination, and reducing cost.

## Arguments

- `$TARGET`: System or application to optimize
- `$PERFORMANCE_GOALS`: Specific metrics and targets
- `$OPTIMIZATION_SCOPE`: `quick-win` or `comprehensive`

## Phase 1: Profile

1. Identify the slowest agents and highest-cost operations
2. Measure per-agent: response latency, token consumption, error rate
3. Map inter-agent communication overhead and blocking dependencies
4. Establish baseline cost per task across the system

## Phase 2: Optimize Coordination

1. Maximize parallelism -- agents that don't depend on each other should run concurrently
2. Minimize inter-agent message passing; batch where possible
3. Reduce context duplication between agents (shared context layer vs repeated assembly)
4. Right-size agent capabilities: use cheaper models for simple tasks, reserve expensive models for reasoning-heavy work

## Phase 3: Optimize Context

1. Compress context per agent to only what that agent needs
2. Implement caching for repeated context retrievals
3. Pre-warm agent contexts for predictable workflows
4. Set per-agent token budgets and enforce them

## Phase 4: Optimize Cost

1. Track token usage per agent per task
2. Route tasks to the cheapest model that can handle them
3. Cache and reuse results for repeated operations
4. Eliminate redundant agent invocations

## Phase 5: Validate

1. Re-run the same workload with optimizations applied
2. Compare: latency, cost, error rate, output quality
3. Verify no quality regression from cost optimizations
4. Document trade-offs made and their measured impact

Target Optimization: $ARGUMENTS
