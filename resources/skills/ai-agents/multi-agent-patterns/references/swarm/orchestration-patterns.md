# Orchestration Patterns Reference

Detailed examples of swarm orchestration patterns.

---

## Pattern 1: Parallel Specialists (Leader Pattern)

Multiple specialists review code simultaneously:

```javascript
// 1. Create team
Teammate({ operation: "spawnTeam", team_name: "code-review" })

// 2. Spawn specialists in parallel (single message, multiple Task calls)
Task({
// ... (29 lines trimmed)
Teammate({ operation: "requestShutdown", target_agent_id: "simplicity" })
// Wait for approvals...
Teammate({ operation: "cleanup" })
```

**Use when:** Multiple independent perspectives needed simultaneously.

---

## Pattern 2: Pipeline (Sequential Dependencies)

Each stage depends on the previous:

```javascript
// 1. Create team and task pipeline
Teammate({ operation: "spawnTeam", team_name: "feature-pipeline" })

TaskCreate({ subject: "Research", description: "Research best practices for the feature", activeForm: "Researching..." })
TaskCreate({ subject: "Plan", description: "Create implementation plan based on research", activeForm: "Planning..." })
// ... (25 lines trimmed)
})

// Tasks auto-unblock as dependencies complete
```

**Use when:** Work must proceed in strict order.

---

## Pattern 3: Swarm (Self-Organizing)

Workers grab available tasks from a pool:

```javascript
// 1. Create team and task pool
Teammate({ operation: "spawnTeam", team_name: "file-review-swarm" })

// Create many independent tasks (no dependencies)
for (const file of ["auth.rb", "user.rb", "api_controller.rb", "payment.rb"]) {
// ... (39 lines trimmed)
})

// Workers race to claim tasks, naturally load-balance
```

**Use when:** Many independent tasks of similar complexity.

---

## Pattern 4: Research + Implementation

Research first, then implement:

```javascript
// 1. Research phase (synchronous, returns results)
const research = await Task({
  subagent_type: "compound-engineering:research:best-practices-researcher",
  description: "Research caching patterns",
  prompt: "Research best practices for implementing caching in Rails APIs. Include: cache invalidation strategies, Redis vs Memcached, cache key design."
// ... (11 lines trimmed)
    Focus on the user_controller.rb endpoints.
  `
})
```

**Use when:** Implementation depends on research findings.

---

## Pattern 5: Plan Approval Workflow

Require plan approval before implementation:

```javascript
// 1. Create team
Teammate({ operation: "spawnTeam", team_name: "careful-work" })

// 2. Spawn architect with plan_mode_required
Task({
// ... (21 lines trimmed)
  request_id: "plan-xxx",
  feedback: "Please add rate limiting considerations"
})
```

**Use when:** High-stakes work requiring human/leader oversight.

---

## Pattern 6: Coordinated Multi-File Refactoring

```javascript
// 1. Create team for coordinated refactoring
Teammate({ operation: "spawnTeam", team_name: "refactor-auth" })

// 2. Create tasks with clear file boundaries
TaskCreate({
// ... (41 lines trimmed)
  prompt: "Wait for task #3 to unblock (when #1 and #2 complete), then update specs",
  run_in_background: true
})
```

**Use when:** Coordinated changes across multiple files.

---

## Pattern Selection Guide

| Scenario | Pattern |
|----------|---------|
| Multiple reviewers needed | Parallel Specialists |
| Strict stage ordering | Pipeline |
| Many similar/independent tasks | Swarm |
| Need info before acting | Research + Implementation |
| High-risk changes | Plan Approval |
| Cross-file refactoring | Coordinated Multi-File |
