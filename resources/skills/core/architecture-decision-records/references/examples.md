# ADR Examples

## Example 1: Database Selection

```markdown
# ADR-0001: Use PostgreSQL as Primary Database

## Status

Accepted
// ... (45 lines trimmed)
### Negative
- Need to learn PostgreSQL-specific features
- Vertical scaling limits may require read replicas sooner
```

---

## Example 2: API Versioning

```markdown
# ADR-0015: Version API Using URL Path

**Status**: Accepted
**Date**: 2024-02-15
**Deciders**: @api-team, @platform-lead
// ... (13 lines trimmed)
**Bad**: URL pollution, may encourage lazy deprecation

**Mitigations**: Strict deprecation policy (12-month support minimum), clear migration guides
```

---

## Example 3: Y-Statement Format

```markdown
# ADR-0022: GraphQL for Mobile API

In the context of **building APIs for mobile applications**,
facing **over-fetching issues with REST and high data costs for users**,
we decided for **GraphQL using Apollo Server**
and against **REST with sparse fieldsets and Backend-for-Frontend (BFF)**,
to achieve **optimal data fetching and reduced bandwidth for mobile users**,
accepting that **team needs GraphQL training and we add query complexity**.
```

---

## Example 4: Deprecation ADR

```markdown
# ADR-0030: Deprecate MongoDB in Favor of PostgreSQL

## Status

Accepted (Supersedes ADR-0003)
// ... (22 lines trimmed)
- Schema flexibility benefits were overestimated
- Operational cost of multiple databases was underestimated
- Consider long-term maintenance in technology decisions
```

---

## Example 5: Security Architecture

```markdown
# ADR-0045: Implement Zero Trust Network Architecture

## Status

Accepted
// ... (43 lines trimmed)
- Significant engineering investment (~6 months)
- Performance overhead from encryption
- Operational complexity increase
```
