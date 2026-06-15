# Workflow Execution Engine

Use this reference to execute prompt chains safely. Choose the execution mode
from the dependency pattern, then validate outputs before advancing.

## Execution Modes

### Single Prompt

Use when one prompt produces one artifact.

Flow:
1. read the prompt
2. launch the worker
3. specify output location
4. wait for completion
5. validate output
6. archive or mark complete

### Sequential Execution

Use when each prompt depends on the previous output.

Rules:
- stop on validation failure
- report the exact failed step
- keep completed outputs intact
- offer retry or investigation before continuing

### Parallel Execution

Use only for truly independent prompts.

Rules:
- dispatch all workers in one parallel batch
- validate each result independently
- keep successful outputs even if some siblings fail
- retry only failed prompts

### Mixed Dependencies

For DAG-style work, execute by layers:
- parallel inside each layer
- sequential between layers
- stop when a failed dependency blocks downstream work

## Dependency Detection

Detect dependencies from:
- explicit references to prior prompt outputs
- declared workflow metadata
- known conventions such as research -> plan -> implement

If a required dependency is missing, do not guess. Stop and surface the gap.

## Validation

Every completed prompt should pass basic checks:
- output file exists
- output is substantive
- required structure or metadata exists
- summary or handoff file exists when the workflow expects one

Validation failure should report:
- what is missing
- whether retry is safe
- whether downstream work must stop

## Failure Handling

### Sequential

Fail fast. Do not continue the chain past a broken dependency.

### Parallel

Collect all outcomes, keep successes, and isolate the failures for retry.

## Archiving

Archive successful prompts only after the output is validated.

Recommended behavior:
- sequential chains: archive step-by-step after each success
- parallel batches: archive successful siblings after collecting results

## Result Presentation

Report:
- what ran
- what succeeded
- what failed
- what the next operator options are

Do not make the user inspect raw prompt directories just to understand the
state of the workflow.

## Special Cases

- re-run completed prompts only after deciding whether existing output should be
  reused, backed up, or replaced
- if output already exists, choose explicit overwrite or reuse behavior before
  execution
- if validation is partial, mark the state clearly instead of treating it as a
  clean success
