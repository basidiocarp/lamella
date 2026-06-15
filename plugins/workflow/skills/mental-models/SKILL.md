---
name: mental-models
description: "Applies decision-making frameworks such as first-principles decomposition, inversion, pre-mortems, and second-order thinking."
origin: lamella
---

# Mental Models for Decision Making

Four complementary frameworks for structured thinking about complex problems.

## When to Use

| Model | Use When |
|-------|----------|
| **First Principles** | Conventional solutions don't work; need to challenge assumptions |
| **Inversion** | Need to identify risks; direct approaches aren't working |
| **Pre-Mortem** | Before launching or committing resources; assessing project risks |
| **Second-Order Thinking** | Long-term consequences matter; anticipating chain reactions |

---

## First Principles Thinking

*Source: Aristotle, modernized by Elon Musk*

Break down complex problems to fundamental truths, then reason up from there.

### Process
1. **Identify assumptions** — List everything you "know" about the problem
2. **Challenge each** — Is this actually true, or just convention?
3. **Separate facts from beliefs** — What's a physical/logical constraint vs. "how it's always been done"?
4. **Decompose to atoms** — Break to smallest provable components
5. **Rebuild from fundamentals** — Construct new solutions from proven truths only

### Example: Software Cost
```
Assumption: "Auth systems cost $50K to build"
Decompose: What do you actually need?
  - Password hashing (bcrypt, free)
  - Token generation (JWT, free)
  - Session storage (Redis, ~$10/mo)
  - OAuth integration (libraries, free)
Truth: Auth is ~$10/mo in infra + dev time
```

### When It Works Best
- "Impossible" problems where convention says it can't be done
- Cost analysis — finding the true floor price
- Innovation — when iterating on existing solutions isn't enough

See [references/fp-examples.md](references/fp-examples.md) and [references/fp-templates.md](references/fp-templates.md).

---

## Inversion

*Source: Carl Jacobi (mathematician), Charlie Munger (investor)*

"Invert, always invert." Solve problems by thinking backward from failure.

### Process
1. **State the goal** clearly
2. **Invert it** — "What would guarantee failure?"
3. **List failure causes** — Be thorough and specific
4. **Invert again** — Each failure cause becomes something to avoid
5. **Create avoidance checklist** — Concrete preventive actions

### Example: API Launch
```
Goal: Successful API launch
Inverted: How to guarantee API launch failure?
  - No documentation → Write docs first
  - No rate limiting → Add rate limits before launch
  - Breaking changes without versioning → Implement versioning
  - No monitoring → Set up alerts before go-live
  - No error handling → Add comprehensive error responses
```

### When It Works Best
- Risk analysis before starting projects
- Decision making when direct approaches fail
- Goal setting — define what to avoid

See [references/inv-examples.md](references/inv-examples.md) and [references/inv-templates.md](references/inv-templates.md).

---

## Pre-Mortem

*Source: Gary Klein (cognitive psychologist, 1989)*

Imagine the project has already failed. Work backward to identify why.

### Process
1. **Set the scene** — "It's 6 months from now. This project failed completely."
2. **Generate failure stories** — Each person writes independently: what went wrong?
3. **Categorize failures** — Group by theme (technical, people, process, external)
4. **Assess likelihood** — Rate each failure scenario (high/medium/low)
5. **Create mitigations** — For high-likelihood failures, define preventive actions
6. **Update the plan** — Incorporate mitigations before starting

### Example: Database Migration
```
Pre-mortem: The database migration failed.
Why?
  - Data corruption during migration (HIGH) → Run on staging copy first, validate checksums
  - Downtime exceeded 4-hour window (HIGH) → Benchmark migration time, plan rollback
  - Application broke on new schema (MED) → Feature flag new code paths, dual-write period
  - Team member who knows old system quit (MED) → Document schema decisions now
  - Rollback didn't work (HIGH) → Test rollback procedure on staging
```

### When It Works Best
- Before launching products or major features
- Before making irreversible decisions
- When the team is overconfident ("this will be easy")

See [references/pm-examples.md](references/pm-examples.md) and [references/pm-templates.md](references/pm-templates.md).

---

## Second-Order Thinking

*Source: Howard Marks ("The Most Important Thing"), Charlie Munger*

Think beyond immediate consequences to understand chain reactions.

### Process
1. **Identify the decision** and its first-order effect
2. **Ask "And then what?"** for each first-order effect
3. **Map the chain** — 2nd, 3rd, nth order consequences
4. **Identify feedback loops** — Self-reinforcing or self-correcting?
5. **Evaluate total impact** — Does the full chain still look good?
6. **Compare alternatives** — Which decision has the best total consequence chain?

### Example: "Let's skip tests to ship faster"
```
1st order: Ship feature 2 days earlier ✓
2nd order: Bug rate increases → more hotfixes
3rd order: Team spends more time on bugs than features
4th order: Velocity drops, morale drops
5th order: Best engineers leave for teams with better practices
Net: 2-day gain → months of accumulated cost
```

### When It Works Best
- Strategic decisions where long-term consequences matter
- Policy changes that trigger behavioral responses
- Product decisions where user behavior may shift
- When something seems "obviously good" — check for hidden downsides

See [references/sot-examples.md](references/sot-examples.md) and [references/sot-templates.md](references/sot-templates.md).

---

## Combining Models

For complex decisions, use multiple models:

1. **First Principles** → Understand the true problem (not the assumed one)
2. **Pre-Mortem** → Identify what could go wrong
3. **Inversion** → Turn risks into avoidance rules
4. **Second-Order** → Verify long-term consequences of your solution
