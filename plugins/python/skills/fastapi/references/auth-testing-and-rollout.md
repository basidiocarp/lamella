# Auth, Testing, and Rollout

Authentication, test harnesses, and migration rollout should move together.

## Cover

- token or session replacement strategy
- async test client setup
- coexistence period between old and new endpoints
- rollback or traffic-shift plan

## Rule

Do not cut over the old API until the new FastAPI surface has equivalent auth,
tests, and observability.
