# Skill Quality Rubric

Use this rubric for quick scoring when triaging imported or recently edited skills.

## Discovery and scope

- `excellent`: name, description, and body all point to the same task
- `acceptable`: the skill is useful but the trigger language is vague
- `poor`: the skill tries to do too many unrelated things or duplicates another Lamella skill

## Actionability

- `excellent`: includes clear workflows, commands, or scripts that work in the shipped layout
- `acceptable`: the workflow is useful but still needs manual interpretation
- `poor`: mostly conceptual text with little executable guidance

## Fit for Lamella

- `excellent`: follows local authoring guidance and avoids source-repo baggage
- `acceptable`: useful content with a few foreign assumptions that should be trimmed
- `poor`: depends on external roles, file layouts, or standards that do not exist in Lamella

## Support files

- `excellent`: scripts, references, and assets clearly support the main workflow
- `acceptable`: some support files are useful, others are optional
- `poor`: support files add maintenance cost without improving the skill

## Maintenance risk

- `excellent`: little time-sensitive content and low drift risk
- `acceptable`: some UI paths or product details may need occasional review
- `poor`: brittle version tables, stale endpoints, or hardcoded environment assumptions
