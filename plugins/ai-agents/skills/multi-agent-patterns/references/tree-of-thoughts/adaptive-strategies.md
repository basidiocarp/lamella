# Adaptive Strategy Selection

Use this step after judges review multiple candidate solutions. The orchestrator
chooses the next strategy based on the verdict pattern, not on raw preference
alone.

## Strategy Selection

### Select and Polish

Use when judges clearly converge on one solution.

Best next step:
- take the winning solution as the base
- apply targeted fixes from judge feedback
- preserve the core structure of the winner

### Redesign

Use when all candidates score poorly enough that the approach itself is weak.

Best next step:
- analyze shared failure modes
- redefine constraints or approach
- return to an earlier generation phase with better guidance

### Full Synthesis

Use when multiple candidates have value but no clear winner exists.

Best next step:
- combine the best verified elements
- keep the synthesis evidence-based
- avoid averaging incompatible ideas into one muddy result

## Decision Rule

The orchestrator should look for:
- consensus
- universal failure
- split merit

Do not let report volume drive the choice. The decision should come from judge
structure and score pattern.
