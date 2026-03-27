# Workflow: Plan Phase

<required_reading>
- ../assets/phase-prompt.md
- ../references/plan-format.md
- ../references/scope-estimation.md
- ../references/checkpoints.md
- `.planning/roadmap.md`
- `.planning/BRIEF.md`
</required_reading>

<purpose>
Create one or more executable phase prompts. The output is a plan Claude can run directly, not a planning memo.
</purpose>

<core_flow>

1. Identify the next phase to plan.
2. Check whether the phase needs research first.
3. Gather the specific phase context and any prior findings.
4. Break the phase into tasks and checkpoint types.
5. Split the phase into multiple plans if quality or context risk is too high.
6. Confirm the breakdown with the user.
7. Write the `PLAN.md` files from the phase template.

</core_flow>

<planning_rules>

- prefer 2-3 tasks per plan
- group autonomous work together when possible
- use checkpoints for human verification or decisions, not routine manual work
- prefer thin vertical slices for feature work
- prefer tiny behavior-preserving steps for refactors

</planning_rules>

<outputs>

- one or more `.planning/phases/XX-name/{phase}-NN-PLAN.md` files
- a clear next step: execute, adjust, or stop

</outputs>
