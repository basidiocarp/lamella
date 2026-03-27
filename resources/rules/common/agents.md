# Agent Orchestration

Use agents as focused collaborators, not as a substitute for your own judgment.
Choose the smallest capable agent, keep prompts scoped, and review the result
before acting on it.

## Choosing an Agent

Pick the agent that matches the immediate job:

| Need | Typical Agent Shape |
|------|---------------------|
| Plan or break down work | planner / planning agent |
| Review implementation risk | code-reviewer / self-review agent |
| Investigate failures | debugger / build-error-resolver |
| Validate security-sensitive changes | security-reviewer |
| Drive TDD or testing | tdd-guide / test-runner / e2e-runner |
| Evaluate architecture | architect / architecture reviewer |

Prefer the agent already bundled with the active plugin or project setup rather
than assuming a fixed global roster.

## When to Dispatch Immediately

Dispatch an agent early when:

1. The task is large enough to benefit from parallel work.
2. A review or verification pass is required before closing.
3. The user asked for comparison, alternatives, or a second opinion.
4. The next step benefits from specialized domain context.

## Parallel Execution

Use parallel agents only for independent work streams.

```text
Good:
- Agent 1: security review of auth module
- Agent 2: performance review of cache path
- Agent 3: test gap analysis for billing flows

Bad:
- Agent 1 writes code that Agent 2 immediately depends on
- Agent 2 waits on Agent 1 but both were launched in parallel anyway
```

## Orchestration Rules

- Give each agent one concrete responsibility.
- Pass only the files and context that agent needs.
- Do not treat the first agent response as final if the task is ambiguous.
- Synthesize multiple agent results against the original user request.
- Prefer a second opinion for high-risk audits instead of a single-agent close.
