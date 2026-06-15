# Workflow: Execute Phase

<purpose>
Execute the next plan prompt and produce the matching summary without letting execution sprawl or lose context quality.
</purpose>

<core_flow>

1. Identify the next `PLAN.md` without a matching `SUMMARY.md`.
2. Read the selected plan and classify it:
   - no checkpoints → autonomous execution
   - verify-only checkpoints → segmented execution
   - decision or human-action checkpoints → execute in main context
3. Run autonomous segments in fresh subagents.
4. Stop at real checkpoints and wait for the required confirmation or decision.
5. Aggregate deviations, create `SUMMARY.md`, and commit the outcome.

</core_flow>

<routing_rules>

- **Autonomous plan**: one subagent executes the entire plan, writes the summary, and commits.
- **Segmented plan**: each autonomous segment runs in its own subagent; the main context handles checkpoints and final aggregation.
- **Decision-dependent plan**: keep execution in the main context because downstream tasks depend on the choice.

</routing_rules>

<execution_guards>

- Fix blockers, critical bugs, and correctness gaps immediately and record them in the summary.
- Ask the user only for architectural changes or true human-only actions.
- Do not create partial milestone artifacts during segmented execution.
- Keep subagent prompts scoped to the exact segment being executed.

</execution_guards>

<outputs>

- Updated code or docs from the executed tasks
- `.planning/phases/XX-name/{phase}-{plan}-SUMMARY.md`
- one commit covering the executed work

</outputs>
