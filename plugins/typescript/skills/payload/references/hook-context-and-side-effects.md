# Hook Context and Side Effects

Use this reference for context sharing, revalidation, and transaction-aware nested operations.

- store expensive work in context when later hooks need it
- pass `req` into nested operations when atomicity matters
- keep revalidation and other side effects explicit
