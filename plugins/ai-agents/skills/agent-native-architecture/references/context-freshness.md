# Context Freshness

Rules:

- build fresh context when the agent starts
- avoid stale app-launch snapshots
- provide a refresh mechanism only when sessions are long-lived enough to need
  it

Freshness matters because capability without current state still produces bad
decisions.
