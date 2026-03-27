# Composition Patterns

Use these combinations to build readable diagrams quickly.

## Flowchart

- `ellipse` for start and end
- `rectangle` for steps
- `diamond` for decisions
- `arrow` for flow direction

Keep left-to-right or top-to-bottom flow consistent across the whole diagram.

## Architecture Diagram

- `rectangle` for services, databases, and systems
- `text` for environment labels or protocol notes
- `arrow` for data flow and dependencies

Group related nodes by alignment before adding color. Layout does more work
than color in architecture diagrams.

## Relationship Diagram

- `rectangle` or `ellipse` for entities
- `line` or `arrow` for associations
- `text` for cardinality or qualifiers

Use arrows only when direction matters. Many relationship diagrams read better
with simple lines and nearby labels.

## Annotation Pattern

Use a light-colored `rectangle` or standalone `text` element for notes. Keep
annotations off the primary flow line so they do not compete with the diagram’s
main path.
