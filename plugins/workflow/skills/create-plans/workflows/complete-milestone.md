# Workflow: Complete Milestone

<required_reading>
- ../assets/milestone.md
- `.planning/roadmap.md`
- `.planning/BRIEF.md`
</required_reading>

<purpose>
Mark a shipped version as complete, record what shipped, update the planning state, and optionally tag the release.
</purpose>

<core_flow>

1. Verify the milestone is actually ready to ship.
2. Gather milestone statistics from the roadmap, summaries, and git history.
3. Extract the milestone's key accomplishments from completed phase summaries.
4. Create or prepend the new entry in `.planning/MILESTONES.md`.
5. Update `.planning/BRIEF.md` with the current state.
6. Reorganize `.planning/roadmap.md` around shipped milestones and next work.
7. Create the git tag and the milestone housekeeping commit.

</core_flow>

<confirmation_points>

- confirm milestone scope before writing records
- confirm extracted accomplishments
- confirm brief and roadmap diffs
- confirm whether to push the tag

</confirmation_points>

<outputs>

- updated `.planning/MILESTONES.md`
- updated `.planning/BRIEF.md`
- updated `.planning/roadmap.md`
- annotated tag such as `v1.0`
- housekeeping commit for the milestone ritual

</outputs>
