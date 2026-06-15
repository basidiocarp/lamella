# Connectors and Lines

Use arrows and lines to show flow, direction, and dependency.

## Arrow

Use arrows when the direction changes the meaning of the diagram.

```json
{
  "type": "arrow",
  "x": 320,
  "y": 124,
  "width": 180,
  "height": 0,
  "points": [[0, 0], [180, 0]],
  "strokeColor": "#1e1e1e",
  "roundness": { "type": 2 }
}
```

Patterns:

- Horizontal flow: `points` like `[[0, 0], [180, 0]]`
- Vertical flow: `[[0, 0], [0, 150]]`
- Diagonal flow: `[[0, 0], [180, 120]]`

## Line

Use plain lines for grouping, partitioning, or non-directional relationships.

```json
{
  "type": "line",
  "x": 140,
  "y": 320,
  "width": 260,
  "height": 0,
  "points": [[0, 0], [260, 0]],
  "strokeColor": "#868e96"
}
```

## Binding Rule

Bind connectors to shapes when the diagram will be edited later. Binding keeps
arrows attached when nodes move. If you are generating a static one-off export,
manual coordinates are acceptable.

## Style Rule

- Solid arrows for normal flow
- Dashed arrows for async, optional, or indirect relationships
- Thin gray lines for layout guides or separators

Do not overuse curved arrows. Use them only when they reduce overlap or make a
loop clearer.
