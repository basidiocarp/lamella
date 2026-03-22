# Example: API Design

Complete walkthrough of Tree of Thoughts for API design task.

## Invocation

```bash
/tree-of-thoughts "Design REST API for user management (CRUD + auth)" \
  --output "specs/api/users.md" \
  --criteria "RESTfulness,security,scalability,developer-experience"
```

## Phase 1 Outputs

(Assuming date 2025-01-15):

- `.specs/research/users-api-2025-01-15.proposals.a.md` - 3 approaches: Resource-based (0.35), Action-based (0.25), HATEOAS (0.15)
- `.specs/research/users-api-2025-01-15.proposals.b.md` - 3 approaches: GraphQL-first (0.20), REST+GraphQL hybrid (0.30), Pure REST (0.40)
- `.specs/research/users-api-2025-01-15.proposals.c.md` - 3 approaches: Microservices (0.25), Monolithic (0.45), Hybrid (0.20)

## Phase 2 Outputs

- `.specs/research/users-api-2025-01-15.pruning.1.md` - Top 3: Resource-based REST, Pure REST, Monolithic
- `.specs/research/users-api-2025-01-15.pruning.2.md` - Top 3: Pure REST, Hybrid (services), Resource-based REST
- `.specs/research/users-api-2025-01-15.pruning.3.md` - Top 3: Resource-based REST, REST+GraphQL hybrid, Pure REST
- `.specs/research/users-api-2025-01-15.selection.md` - Selected: Resource-based REST (8 pts), Pure REST (7 pts), Monolithic (4 pts)

## Phase 3 Outputs

- `specs/api/users.a.md` - Full resource-based design with nested routes
- `specs/api/users.b.md` - Flat REST design with simple endpoints
- `specs/api/users.c.md` - Monolithic API with service-oriented internals

## Phase 4 Outputs

### Judge 1 Report
`.specs/reports/users-api-2025-01-15.1.md`:
```
VOTE: Solution A
SCORES: A=4.2/5.0, B=3.8/5.0, C=3.4/5.0
```
"Prefers A for RESTfulness, criticizes C complexity"

### Judge 2 Report
`.specs/reports/users-api-2025-01-15.2.md`:
```
VOTE: Solution B
SCORES: A=3.9/5.0, B=4.1/5.0, C=3.5/5.0
```
"Prefers B for simplicity, criticizes A deep nesting"

### Judge 3 Report
`.specs/reports/users-api-2025-01-15.3.md`:
```
VOTE: Solution A
SCORES: A=4.3/5.0, B=3.6/5.0, C=3.2/5.0
```
"Prefers A for discoverability, criticizes B lack of structure"

## Phase 4.5 Decision

Orchestrator parses headers and determines strategy:

- Split votes: A, B, A (no unanimous winner)
- Average scores: A=4.1, B=3.8, C=3.4 (all ≥3.0)
- **Strategy: FULL_SYNTHESIS**
- Reason: Split decision with merit, synthesis needed

## Phase 5 Output

Final synthesized solution: `specs/api/users.md`

Combines:
- Resource-based structure (from A)
- Max 2-level nesting (from B's simplicity feedback)
- Internal services pattern (from C)
