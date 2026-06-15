# Graduating to Optimized Code

Move operations into dedicated code when:

- they are called frequently
- latency or token cost matters
- deterministic behavior is required
- state management becomes too heavy for agent orchestration alone

Even after optimization, the agent should still be able to trigger the behavior
and fall back for edge cases where appropriate.
