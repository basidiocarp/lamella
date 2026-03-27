# Error Propagation Analysis Workflow

Use this workflow when a multi-agent chain produces a bad final result and you
need to determine where the error entered and how it spread.

## When to Use

- final output is wrong but the chain is long enough that local debugging is not
  obvious
- an early mistake appears to be amplified by later agents
- you want to place better verification boundaries in an existing chain

## Workflow

### 1. Capture the Chain

Record the output of each stage or agent in order. You need a comparable trace,
not only the final artifact.

### 2. Identify End Symptoms

List the concrete defects in the final output:
- false facts
- wrong file changes
- missing required steps
- invalid assumptions

### 3. Trace Backward

For each defect, ask:
- where does this first appear?
- which agent introduced it?
- which later agents preserved or amplified it?

### 4. Measure Propagation

Useful questions:
- how many errors were introduced vs merely repeated?
- which stage catches errors vs passes them through?
- where should verification be inserted next time?

### 5. Add Boundaries

After identifying the weak stage, add a verification checkpoint immediately
after it:
- targeted judge
- schema or artifact validation
- explicit claim verification
- human review if the failure mode is subtle

## Output

A useful analysis should end with:
- root cause stage
- propagated downstream effects
- recommended new checkpoint or workflow change

The goal is not only to explain the failure, but to make the same chain more
resilient the next time it runs.
