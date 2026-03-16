# Complete Workflows Reference

End-to-end workflow examples for common swarm orchestration scenarios.

---

## Workflow 1: Full Code Review with Parallel Specialists

```javascript
// === STEP 1: Setup ===
Teammate({ operation: "spawnTeam", team_name: "pr-review-123", description: "Reviewing PR #123" })

// === STEP 2: Spawn reviewers in parallel ===
// (Send all these in a single message for parallel execution)
// ... (59 lines trimmed)
Teammate({ operation: "requestShutdown", target_agent_id: "arch" })
// Wait for approvals...
Teammate({ operation: "cleanup" })
```

---

## Workflow 2: Research → Plan → Implement → Test Pipeline

```javascript
// === SETUP ===
Teammate({ operation: "spawnTeam", team_name: "feature-oauth" })

// === CREATE PIPELINE ===
TaskCreate({ subject: "Research OAuth providers", description: "Research OAuth2 best practices and compare providers (Google, GitHub, Auth0)", activeForm: "Researching OAuth..." })
// ... (50 lines trimmed)
})

// Pipeline auto-progresses as each stage completes
```

---

## Workflow 3: Self-Organizing Code Review Swarm

```javascript
// === SETUP ===
Teammate({ operation: "spawnTeam", team_name: "codebase-review" })

// === CREATE TASK POOL (all independent, no dependencies) ===
const filesToReview = [
// ... (47 lines trimmed)

// Workers self-organize: race to claim tasks, naturally load-balance
// Monitor progress with TaskList() or by reading inbox
```

---

## Workflow Checklist

Before starting any workflow:

- [ ] Choose appropriate pattern for your use case
- [ ] Plan team name and worker names
- [ ] Define tasks and dependencies
- [ ] Write clear, specific prompts

During workflow:

- [ ] Monitor inbox for results
- [ ] Check task progress with `TaskList()`
- [ ] Handle any permission requests

After workflow:

- [ ] Collect and synthesize results
- [ ] Shutdown all teammates gracefully
- [ ] Run cleanup to remove team resources
