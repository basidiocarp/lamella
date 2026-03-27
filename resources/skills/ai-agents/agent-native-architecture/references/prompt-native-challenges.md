# Prompt-Native Challenges

Common objections:

- "the agent might make mistakes"
- "the workflow is complex"
- "we need deterministic behavior"

Response pattern:

- add clearer guidance before adding heavier workflow code
- graduate hot paths only when latency, cost, or determinism truly require it
- keep the agent responsible for deciding what to do unless code must own it
