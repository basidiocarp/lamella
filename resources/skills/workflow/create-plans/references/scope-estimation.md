# Scope Estimation and Plan Splitting

Plans should stay small enough that execution never enters the low-quality
"finish quickly" mode.

## Working Heuristic

- target roughly half the context window, not the absolute limit
- prefer `2-3` tasks per plan
- split early when work crosses subsystem, verification, or uncertainty
  boundaries

## Always Split When

- a plan needs more than three real tasks
- the work spans multiple subsystems
- a task is likely to touch many files
- research and implementation are both required
- a checkpoint naturally divides the work

## Good Split Shapes

- backend, then frontend, then integration
- setup, then core implementation, then verification
- one autonomous plan per subsystem, with interactive verification isolated

## Anti-Pattern

A single "complete the whole feature" plan with many tasks usually produces
falling quality halfway through. Split it before execution starts.
