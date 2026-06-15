# Critical Step Pattern

Use this when a step needs panel-style verification.

## Flow

1. dispatch one implementation agent
2. collect the artifact path from its report
3. dispatch two judge agents in parallel against that artifact
4. aggregate scores and compare against the configured threshold
5. if the step fails, feed the judge output back into another implementation
   pass and iterate up to the configured limit
6. only then mark the step complete

## Human Checkpoint

If the step is listed in the human-review configuration, pause only after the
step has already passed judge verification.
