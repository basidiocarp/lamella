# Muda (Waste) Analysis Examples

## Example: API Codebase Waste Analysis

```
SCOPE: REST API backend (50K LOC)

1. OVERPRODUCTION
   Found:
   • 15 API endpoints with zero usage (last 90 days)
// ... (83 lines trimmed)
• 20% faster feature delivery
• 50% fewer production issues
• 30% less operational overhead
```

---

## The 7 Types of Waste (Software Context)

### 1. Overproduction
Building more than needed

**Code Symptoms:**
- Features no one uses
- Overly complex solutions
- Premature optimization
- Unnecessary abstractions
- "Just in case" code

**Detection Questions:**
- When was this code last executed?
- What problem does this solve?
- Who requested this?

### 2. Waiting
Idle time

**Code Symptoms:**
- Slow build/test/deploy cycles
- Code review delays
- Waiting for dependencies
- Blocked by other teams
- Environment setup time

**Detection Questions:**
- How long from commit to production?
- What's blocking progress?
- Where do queues form?

### 3. Transportation
Moving things unnecessarily

**Code Symptoms:**
- Excessive data transformations
- API layers with no value add
- Copying data between systems
- Repeated serialization
- Network hops without purpose

**Detection Questions:**
- How many times is this data transformed?
- Are all these layers necessary?
- Could this be simplified?

### 4. Over-processing
Doing more than necessary

**Code Symptoms:**
- Excessive logging
- Redundant validations
- Over-normalized databases
- Unnecessary computation
- Gold-plating features

**Detection Questions:**
- Is this validation redundant?
- Does anyone read these logs?
- Is this really needed?

### 5. Inventory
Work sitting idle

**Code Symptoms:**
- Unmerged branches
- Half-finished features
- Untriaged bugs
- Undeployed code
- Stale documentation

**Detection Questions:**
- How many open PRs?
- What's not deployed?
- What's waiting in the backlog?

### 6. Motion
Unnecessary movement

**Code Symptoms:**
- Context switching
- Meetings without purpose
- Manual deployments
- Repetitive tasks
- Tool switching

**Detection Questions:**
- How many tools for one task?
- What's done manually?
- How much context switching?

### 7. Defects
Rework and bugs

**Code Symptoms:**
- Production bugs
- Technical debt
- Flaky tests
- Incomplete features
- Missing error handling

**Detection Questions:**
- How many bugs per sprint?
- What keeps breaking?
- What needs refactoring?

---

## Muda Analysis Template

```
SCOPE: [Area to analyze]

1. OVERPRODUCTION
   Found:
   • [Item 1]
// ... (18 lines trimmed)
Estimated Recovery:
• [Benefit 1]
• [Benefit 2]
```
